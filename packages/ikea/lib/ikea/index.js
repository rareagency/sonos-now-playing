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

  const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const controlledBulbs = Object.values(bulbs).slice(0, 1);

  await Promise.all(controlledBulbs.map(b => b.setColor(randomColor)));

  while (runningId === id) {
    console.log("beat");
    const start = Date.now();
    if (i % 100 === 0) {
      await Promise.all(
        controlledBulbs.map(b => b.setHue(Math.round(360 * Math.random())))
      );
    }

    if (i % 2 === 0) {
      await Promise.all(
        controlledBulbs.map(b => b.setSaturation(30 + ((i * 10) % 100)))
      );
    } else {
      await Promise.all(
        controlledBulbs.map(b => b.setBrightness(i % 3 === 0 ? 100 : 254))
      );
    }

    i++;
    await new Promise(resolve =>
      setTimeout(resolve, tempo - (Date.now() - start))
    );
  }
}

function tradfri_deviceUpdated(device) {
  if (device.type === AccessoryTypes.lightbulb) {
    bulbs[device.instanceId] = device.lightList[0];
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
