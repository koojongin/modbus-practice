require('dotenv').config({path: '.env'});
const {getConnection, rangeFind} = require("./modbus.js");

async function getData() {
  return rangeFind({names: ['Product ID', 'Voltage data', 'Frequency', 'Temperature']});
}

async function run() {
  await getConnection();
  const result = await getData();
  console.log(result);
}

run();
