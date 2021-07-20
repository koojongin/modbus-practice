const ModbusRTU = require("modbus-serial");
const {REGISTER_FORMAT} = require("./register-map");
const client = new ModbusRTU();
const {registerRangeMap} = require('./register-map.js')
const {DEVICE_HOST, DEVICE_PORT} = process.env;

async function getConnection() {
  return client.connectTCP(DEVICE_HOST, {port: DEVICE_PORT});
}

async function readData({name}) {
  client.setID(1);
  const registerInfo = getItemRangeAddress({name});
  if (!registerInfo)
    throw new Error(`Invalid RegisterName. ${name}`)
  const [startRange, endRange = startRange + 1] = registerInfo.range;
  const result = await client.readHoldingRegisters(startRange, endRange - startRange + 1);
  return Object.assign(result, registerInfo);
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

async function getItem({name}) {
  const {data, buffer, format} = await readData({name});
  let value;
  switch (format) {
    case REGISTER_FORMAT.CHARACTER:
      value = Buffer.from(buffer).filter(d => !!d).toString('utf8');
      break;
    case REGISTER_FORMAT.FLOAT32:
      value = sliceIntoChunks(buffer, 4).map((buff) => Buffer.from(buff).readFloatBE(0))
      break;
    case REGISTER_FORMAT.UINT16:
      value = Buffer.from(buffer).readUint16BE(0);
      break;
    case REGISTER_FORMAT.UINT32:
      value = Buffer.from(buffer).readUint32BE(0);
      break;
  }
  return value;
}

function getItemRangeAddress({name}) {
  return registerRangeMap[name];
}

async function rangeFind({names}) {
  const collectItemNames = names;
  const createItemQuery = async (name) => {
    return getItem({name})
  };
  const queryPromises = collectItemNames.map(name => createItemQuery(name));
  const result = await Promise.all(queryPromises);
  return registerMergeFilter({names, result});
}

function registerMergeFilter({names, result}) {
  return result.map((datum, index) => {
    const extendedDatum = {
      [names[index]]: datum
    }
    return extendedDatum;
  });
}


module.exports = {
  getConnection, rangeFind
}
