const {
  discoverGateway,
  AccessoryTypes,
  TradfriClient
} = require("node-tradfri-client");
// const chalk = require("chalk");

let tradfri = null;

/*
 * Fake implementation
 */

// let lampState = {
//   hue: 0,
//   saturation: 100,
//   lightness: 0,
// };

let bulbs = {
  // fake: {
  //   setBrightness: async (brightness, transitionTime) => {
  //     lampState.lightness = brightness;
  //     printScreen({
  //       ...lampState,
  //       lightness: lampState.lightness - 50,
  //     });
  //   },
  //   setHue: async (hue) => {
  //     lampState.hue = hue;
  //     printScreen(lampState);
  //   },
  //   setSaturation: async (saturation) => {
  //     lampState.saturation = saturation;
  //     printScreen(lampState);
  //   },
  // },
};

// function printScreen(state) {
//   console.clear();
//   let row = "";

//   for (let i = 0; i < 16; i++) {
//     for (let o = 0; o < 32; o++) {
//       row += chalk.bgHsl(state.hue, state.saturation, state.lightness)(" ");
//     }
//     console.log(row);
//     row = "";
//   }
//   console.log();

//   console.log(lampState);
// }

module.exports.getBulbs = function() {
  // console.log(bulbs);
  return Object.values(bulbs);
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
