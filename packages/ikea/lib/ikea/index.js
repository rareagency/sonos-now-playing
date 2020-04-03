const {
  discoverGateway,
  AccessoryTypes,
  TradfriClient
} = require("node-tradfri-client");

let tradfri = null;
let bulbs = {};

module.exports.getBulbs = function() {
  return bulbs;
};

async function tradfri_deviceUpdated(device) {
  if (device.type === AccessoryTypes.lightbulb) {
    if (!bulbs[device.instanceId]) {
      console.log("Found device", device.name);
      await device.lightList[0].turnOn();
      bulbs[device.instanceId] = device.lightList[0];
    }
  }
}

async function init() {
  const gateway = await discoverGateway();

  tradfri = new TradfriClient(gateway.addresses[0]);
  tradfri.on("error", err => {
    console.log({ err });
  });

  try {
    await tradfri.connect(
      "4d3ffa1074c111ea9450af76b0fc788b",
      "1EzHOXDzB9Qmc5Zw"
    );
  } catch (error) {
    console.log(error);
  }
  tradfri.on("device updated", tradfri_deviceUpdated).observeDevices();
}

init();
