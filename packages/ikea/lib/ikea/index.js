const hsl = require("hsl-to-hex");
const coap = require("coap");
const {
  discoverGateway,
  AccessoryTypes,
  TradfriClient
} = require("node-tradfri-client");

const COLORS = [
  "4a418a",
  "6c83ba",
  "8f2686",
  "a9d62b",
  "c984bb",
  "d6e44b",
  "d9337c",
  "da5d41",
  "dc4b31",
  "dcf0f8",
  "e491af",
  "e57345",
  "e78834",
  "e8bedd",
  "eaf6fb",
  "ebb63e",
  "efd275",
  "f1e0b5",
  "f2eccf",
  "f5faf6"
];

let tradfri = null;
let bulbs = {};
let runningId = null;
let running = false;

async function loop(id, tempo) {
  running = true;
  let i = 0;

  const initialHue = Math.round(Math.random() * 360);
  console.log("Initial hue", initialHue, "tempo", tempo);
  while (runningId === id) {
    const start = Date.now();
    const controlledBulbs = Object.values(bulbs);

    if ((i < 100 && i % 20) || i % 100 === 0) {
      const hue = Math.max(
        0,
        Math.min(360, initialHue + (-10 + Math.round(20 * Math.random())))
      );
      console.log("Set hue", hue);
      await Promise.all(controlledBulbs.map(b => b.setHue(hue)));
    }

    if (i % 2 === 0) {
      const saturation = 30 + ((i * 10) % 100);
      console.log("Set saturation", saturation);
      await Promise.all(controlledBulbs.map(b => b.setSaturation(saturation)));
    } else {
      console.log("Update brightnesses");
      await Promise.all(
        controlledBulbs.map(b => b.setBrightness(b.dimmer === 100 ? 20 : 100))
      );
    }

    i++;
    console.log(tempo - (Date.now() - start), "until next tick");
    await new Promise(resolve =>
      setTimeout(resolve, tempo - (Date.now() - start))
    );
  }
}

async function tradfri_deviceUpdated(device) {
  if (device.type === AccessoryTypes.lightbulb) {
    if (!bulbs[device.instanceId]) {
      console.log("Found device", device.name);
      await device.lightList[0].turnOn();
      bulbs[device.instanceId] = device.lightList[0];
    }
  }
}
module.exports = async function changeLight(tempo, id) {
  if (tradfri === null) {
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

  runningId = id;
  loop(id, tempo);
};
