var modbus = require('modbus-serial');
var jumpers = require('./jumpers');

if (jumpers.cams)
  var cams_polling = require('./cams_polling');
if (jumpers.aura)
  var aura_polling = require('./aura_polling');
if (jumpers.mode == 0)
  var elv_polling = require('./elv_polling');
if (jumpers.mode == 1)
  var elvp_polling = require('./elvp_polling');
if (jumpers.mode == 2)
  var series3_polling = require('./series3_polling');
if (jumpers.mode == 3)
  var series4_polling = require('./series4_polling');

var data = {};

if (jumpers.cams)
  data.cams = cams_polling.data;
if (jumpers.aura)
  data.aura = aura_polling.data;
if (jumpers.mode == 0)
  data.elv = elv_polling.data;
if (jumpers.mode == 1)
  data.elvp = elvp_polling.data;
if (jumpers.mode == 2)
  data.series3 = series3_polling.data;
if (jumpers.mode == 3)
  data.series4 = series4_polling.data;

var maxCoil = 100;
var maxRegister = 1000;
var coils = Buffer.alloc(maxCoil, 0);             // coils and discrete inputs
var regsiters = Buffer.alloc(maxRegister * 2, 0); // input and holding registers

setInterval(update, 10000);
update();

function update() {
  // clang-format off
  var modbus_registers = {
    v1 : {address : 0, value : 'series4' in data ? data.series4.system_information[0] ? data.series4.system_information[0].row_info : NaN : NaN},      // series4 Mains voltage
    v2 : {address : 2, value : 'series4' in data ? data.series4.system_information[1] ? data.series4.system_information[1].row_info : NaN : NaN},      // series4 Battery voltage
    v3 : {address : 4, value : 'series4' in data ? data.series4.system_information[2] ? data.series4.system_information[2].row_info : NaN : NaN},      // series4 Inverter voltage
    v4 : {address : 6, value : 'series4' in data ? data.series4.system_information[3] ? data.series4.system_information[3].row_info : NaN : NaN},      // series4 Battery current
    v5 : {address : 8, value : 'series4' in data ? data.series4.system_information[4] ? data.series4.system_information[4].row_info : NaN : NaN},      // series4 Battery temperature
    v6 : {address : 10, value : 'series4' in data ? data.series4.system_information[5] ? data.series4.system_information[5].row_info : NaN : NaN},     // series4 Chamber temperature
    v7 : {address : 12, value : 'series4' in data ? data.series4.system_information[6] ? data.series4.system_information[6].row_info : NaN : NaN},     // series4 Outside temperature
    v8 : {address : 14, value : 'series4' in data ? data.series4.fan_board_1[0] ? data.series4.fan_board_1[0].row_info : NaN : NaN},                   // series4 CO2 fan I current
    v9 : {address : 16, value : 'series4' in data ? data.series4.fan_board_1[1] ? data.series4.fan_board_1[1].row_info : NaN : NaN},                   // series4 CO2 fan II current
    v10 : {address : 18, value : 'series4' in data ? data.series4.fan_board_1[2] ? data.series4.fan_board_1[2].row_info : NaN : NaN},                  // series4 CO fan current
    v11 : {address : 20, value : 'series4' in data ? data.series4.fan_board_1[3] ? data.series4.fan_board_1[3].row_info : NaN : NaN},                  // series4 Lighting current
    v12 : {address : 22, value : 'series4' in data ? data.series4.fan_board_1[4] ? data.series4.fan_board_1[4].row_info : NaN : NaN},                  // series4 Siren current
    v13 : {address : 24, value : 'series4' in data ? data.series4.fan_board_1[5] ? data.series4.fan_board_1[5].row_info : NaN : NaN},                  // series4 Green strobe current
    v14 : {address : 26, value : 'series4' in data ? data.series4.fan_board_1[6] ? data.series4.fan_board_1[6].row_info : NaN : NaN},                  // series4 Red strobe current
    v15 : {address : 28, value : 'series4' in data ? data.series4.fan_board_1[7] ? data.series4.fan_board_1[7].row_info : NaN : NaN},                  // series4 Yellow strobe current
    v16 : {address : 30, value : 'series3' in data ? data.series3.raw[6] ? data.series3.raw[6].row_info : NaN : NaN},                                  // series3 Inverter voltage
    v17 : {address : 32, value : 'series3' in data ? data.series3.raw[10] ? data.series3.raw[10].row_info : NaN : NaN},                                // series3 Battery voltage
    v18 : {address : 34, value : 'series3' in data ? data.series3.raw[12] ? data.series3.raw[12].row_info : NaN : NaN},                                // series3 Bridge voltage
    v19 : {address : 36, value : 'series3' in data ? data.series3.raw[2] ? data.series3.raw[2].row_info : NaN : NaN},                                  // series3 Outside temperature
    v20 : {address : 38, value : 'series3' in data ? data.series3.raw[4] ? data.series3.raw[4].row_info : NaN : NaN},                                  // series3 Battery temperature
    v21 : {address : 40, value : 'series3' in data ? data.series3.raw[0] ? data.series3.raw[0].row_info : NaN : NaN},                                  // series3 Chamber temperature
    v22 : {address : 42, value : 'series3' in data ? data.series3.raw[8] ? data.series3.raw[8].row_info : NaN : NaN},                                  // series3 Battery current
    v23 : {address : 44, value : 'series3' in data ? data.series3.raw[1] ? data.series3.raw[1].row_info : NaN : NaN},                                  // series3 CO2 fan current
    v24 : {address : 46, value : 'series3' in data ? data.series3.raw[3] ? data.series3.raw[3].row_info : NaN : NaN},                                  // series3 CO fan current
    v25 : {address : 48, value : 'series3' in data ? data.series3.raw[11] ? data.series3.raw[11].row_info : NaN : NaN},                                // series3 Red strobe current
    v26 : {address : 50, value : 'series3' in data ? data.series3.raw[9] ? data.series3.raw[9].row_info : NaN : NaN},                                  // series3 Green strobe current
    v27 : {address : 52, value : 'series3' in data ? data.series3.raw[7] ? data.series3.raw[7].row_info : NaN : NaN},                                  // series3 Fluoro current
    v28 : {address : 54, value : 'series3' in data ? data.series3.raw[5] ? data.series3.raw[5].row_info : NaN : NaN},                                  // series3 Siren current
    v29 : {address : 56, value : 'elvp' in data ? data.elvp.serial.V ? data.elvp.serial.V : NaN : NaN},                                                // ELVP Emergency battery
    v30 : {address : 58, value : 'elvp' in data ? data.elvp.serial.VS ? data.elvp.serial.VS : NaN : NaN},                                              // ELVP Standby battery
    v31 : {address : 60, value : 'elvp' in data ? data.elvp.serial.I ? data.elvp.serial.I : NaN : NaN},                                                // ELVP Battery current
    v32 : {address : 62, value : 'elv' in data ? data.elv.serial.V ? data.elv.serial.V : NaN : NaN},                                                   // ELV Emergency battery
    v33 : {address : 64, value : 'elv' in data ? data.elv.serial.I ? data.elv.serial.I : NaN : NaN},                                                   // ELV Battery current
    v34 : {address : 66, value : 'cams' in data ? data.cams.rate : NaN},                                                                             // CAMS Airflow
    v35 : {address : 68, value : 'aura' in data ? data.aura.Temp.value : NaN},
    v36 : {address : 70, value : 'aura' in data ? data.aura.Temp_F.value : NaN},
    v37 : {address : 72, value : 'aura' in data ? data.aura.O2.value : NaN},
    v38 : {address : 74, value : 'aura' in data ? data.aura.CO2.value : NaN},
    v39 : {address : 76, value : 'aura' in data ? data.aura.CO.value : NaN},
    v40 : {address : 78, value : 'aura' in data ? data.aura.H2S.value : NaN},
    v41 : {address : 80, value : 'aura' in data ? data.aura.NH3.value : NaN},
    v42 : {address : 82, value : 'aura' in data ? data.aura.Cl.value : NaN},
    v43 : {address : 84, value : 'aura' in data ? data.aura.NO.value : NaN},
    v44 : {address : 86, value : 'aura' in data ? data.aura.NO2.value : NaN},
    v45 : {address : 88, value : 'aura' in data ? data.aura.CH4.value : NaN},
    v46 : {address : 90, value : 'aura' in data ? data.aura.SO2.value : NaN},
    v47 : {address : 92, value : 'aura' in data ? data.aura.HF.value : NaN},
    v48 : {address : 94, value : 'aura' in data ? data.aura.ClO2.value : NaN},
    v49 : {address : 96, value : 'aura' in data ? data.aura.HCL.value : NaN},
  }

  var modbus_registers_other = {
    v1 : {address : 200, value : data.elvp ? data.elvp.mains : NaN},    // ELVP Mains
    v2 : {address : 202, value : data.elvp ? data.elvp.inverter : NaN}, // ELVP Inverter
    v3 : {address : 204, value : data.elv ? data.elv.mains : NaN},      // ELV Mains
    v4 : {address : 206, value : data.elv ? data.elv.inverter : NaN},   // ELV Inverter
    v5 : {address : 208, value : data.cams ? data.cams.occupied : NaN}, // CAMS Occupied
    v6 : {address : 210, value : data.cams ? data.cams.solenoid : NaN}, // CAMS Solenoid
  }

  var modbus_coils = {
    v1 : {address : 0, value : data.elvp ? data.elvp.mains : false},    // ELVP Mains
    v2 : {address : 1, value : data.elvp ? data.elvp.inverter : false}, // ELVP Inverter
    v3 : {address : 2, value : data.elv ? data.elv.mains : false},      // ELV Mains
    v4 : {address : 3, value : data.elv ? data.elv.inverter : false},   // ELV Inverter
    v5 : {address : 4, value : data.cams ? data.cams.occupied : false}, // CAMS Occupied
    v6 : {address : 5, value : data.cams ? data.cams.solenoid : false}, // CAMS Solenoid
  }
  // clang-format on

  for ([ key, register ] of Object.entries(modbus_registers)) {
    regsiters.writeFloatLE(register.value, register.address * 2);
  }

  for ([ key, register ] of Object.entries(modbus_registers_other)) {
    regsiters.writeUInt16LE(register.value, register.address * 2);
  }

  for ([ key, coil ] of Object.entries(modbus_coils)) {
    coils.writeUInt8(coil.value, coil.address);
  }
}

var vector = {
  getCoil : function(addr) {
    if (addr >= 0 && addr < maxCoil) {
      return coils.readUInt8(addr);
    }
  },
  getInputRegister : function(addr) {
    if (addr >= 0 && addr < maxRegister) {
      return regsiters.readUInt16LE(addr * 2);
    }
  },
  getHoldingRegister : function(addr) {
    if (addr >= 0 && addr < maxRegister) {
      return regsiters.readUInt16LE(addr * 2);
    }
  },

  setCoil : function(addr, value) {
    if (addr >= 0 && addr < maxCoil) {
      coils.writeUInt8(value, addr);
    }
  },
  setRegister : function(addr, value) {
    if (addr >= 0 && addr < maxRegister) {
      regsiters.writeUInt16LE(value, addr * 2);
    }
  },
  readDeviceIdentification: function(addr) {
    return {
      0x00: "MyVendorName",
      0x01: "MyProductCode",
      0x02: "MyMajorMinorRevision",
      0x05: "MyModelName",
      0x97: "MyExtendedObject1",
      0xAB: "MyExtendedObject2"
    };
  }
};

console.log('ModbusTCP listening on modbus://0.0.0.0:502');
var serverTCP = new modbus.ServerTCP(vector, {host : '0.0.0.0', port : 502, debug : true, unitID : 1});

serverTCP.on('initialized', function() { console.log('ModbusTCP initialized'); });

serverTCP.on('socketError', function(err) {
  console.error(err);
});