const REGISTER_FORMAT = {
  FLOAT32: 'Float32',
  UINT16: 'UInt16',
  UINT32: 'UInt32',
  CHARACTER: 'Char',
}
const registerRangeMap = {
  'Voltage Van': {range: [11100], format: REGISTER_FORMAT.FLOAT32},
  'Voltage Vbn': {range: [11102], format: REGISTER_FORMAT.FLOAT32},
  'Voltage Vcn': {range: [11104], format: REGISTER_FORMAT.FLOAT32},
  'Voltage Vavg_ln': {range: [11106], format: REGISTER_FORMAT.FLOAT32},
  'Frequency': {range: [11150], format: REGISTER_FORMAT.FLOAT32},
  'Temperature': {range: [11152], format: REGISTER_FORMAT.FLOAT32},

  'Product ID': {range: [0], format: REGISTER_FORMAT.UINT16},
  'Serial number': {range: [1], format: REGISTER_FORMAT.UINT32},
  'Vendor name': {range: [3, 12], format: REGISTER_FORMAT.CHARACTER},
  'Voltage data': {range: [11100, 11155], format: REGISTER_FORMAT.FLOAT32},
}


module.exports = {REGISTER_FORMAT, registerRangeMap}
