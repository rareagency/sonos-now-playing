const hsl = require("hsl-to-hex");

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

let runningId = null;

module.exports = async function changeLight(tempo, id) {
  runningId = id;

  const tradfri = require("node-tradfri").create({
    coapClientPath: "./node_modules/node-tradfri/lib/coap-client", // use embedded coap-client
    identity: "c051a5a0740b11eaa80c01a76f276d41",
    preSharedKey: "xrbR9uhPhfbL0fUt",
    hubIpAddress: "192.168.8.175"
  });

  const devices = await tradfri.getDevices();
  const bulbs = devices.filter(device => device.name.includes("TRADFRI bulb"));
  let i = 0;

  while (runningId === id) {

    for (const device of bulbs) {
      tradfri.turnOnDevice(device.id);

      await new Promise(resolve => setTimeout(resolve, 10));
      const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];

      tradfri.setDeviceState(device.id, {
        color: COLORS[2],
        brightness: i % 2 === 0 ? 30 : 100
      });

      await new Promise(resolve => setTimeout(resolve, 10));
    }

    await new Promise(resolve => setTimeout(resolve, tempo - 20));

    console.log('TT')
    i++;
  }
}

