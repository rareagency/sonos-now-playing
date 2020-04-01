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

async function run() {
  const tradfri = require("node-tradfri").create({
    coapClientPath: "./node_modules/node-tradfri/lib/coap-client", // use embedded coap-client
    identity: "c051a5a0740b11eaa80c01a76f276d41",
    preSharedKey: "xrbR9uhPhfbL0fUt",
    hubIpAddress: "192.168.8.175"
  });

  const devices = await tradfri.getDevices();
  const bulbs = devices.filter(device => device.name.includes("TRADFRI bulb"));
  let i = 0;
  while (true) {
    for (const device of bulbs) {
      await tradfri.turnOnDevice(device.id);

      await new Promise(resolve => setTimeout(resolve, 10));
      console.log(i);
      await tradfri.setDeviceState(device.id, {
        color: COLORS[i % (COLORS.length - 1)]
      });
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    await new Promise(resolve => setTimeout(resolve, 200));
    i++;
  }
}

run();
