const infaredTempService = {
  name: "infared",
  uuid: "f000aa00-0451-4000-b000-000000000000",
  data: "f000aa01-0451-4000-b000-000000000000",
  notification: "00002902-0000-1000-8000-00805f9b34fb",
  configuration: "f000aa02-0451-4000-b000-000000000000",
  period: "f000aa03-0451-4000-b000-000000000000"
};

const humidityService = {
  name: "humidity",
  uuid: "f000aa20-0451-4000-b000-000000000000",
  data: "f000aa21-0451-4000-b000-000000000000",
  notification: "00002902-0000-1000-8000-00805f9b34fb",
  configuration: "f000aa22-0451-4000-b000-000000000000",
  period: "f000aa23-0451-4000-b000-000000000000"
};

const barometerService = {
  name: "barometer",
  uuid: "f000aa40-0451-4000-b000-000000000000",
  data: "f000aa41-0451-4000-b000-000000000000",
  notification: "00002902-0000-1000-8000-00805f9b34fb",
  configuration: "f000aa42-0451-4000-b000-000000000000",
  period: "f000aa44-0451-4000-b000-000000000000"
};

const opticalService = {
  name: "optical",
  uuid: "f000aa70-0451-4000-b000-000000000000",
  data: "f000aa71-0451-4000-b000-000000000000",
  notification: "00002902-0000-1000-8000-00805f9b34fb",
  configuration: "f000aa72-0451-4000-b000-000000000000",
  period: "f000aa73-0451-4000-b000-000000000000"
};

const movementService = {
  name: "movement",
  uuid: "f000aa80-0451-4000-b000-000000000000",
  data: "f000aa81-0451-4000-b000-000000000000",
  notification: "00002902-0000-1000-8000-00805f9b34fb",
  configuration: "f000aa82-0451-4000-b000-000000000000",
  period: "f000aa83-0451-4000-b000-000000000000"
};

export {
  infaredTempService as infared,
  humidityService as humidity,
  barometerService as barometer,
  opticalService as optical,
  movementService as movement
};
