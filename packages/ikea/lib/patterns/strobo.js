const { getBulbs } = require("../ikea");

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
let running = false;

module.exports = async function onSongChange(tempo, id) {
  running = true;
  let i = 0;

  if (!runningId) {
    runningId = id;
  }

  const initialHue = Math.round(Math.random() * 360);
  const bulbs = Object.values(getBulbs());

  while (runningId === id) {
    console.log("Running", bulbs.length);
    const start = Date.now();
    const controlledBulbs = Object.values(bulbs).slice(0, 1);

    // if (i % 5) {
    //   const hue = Math.max(
    //     0,
    //     Math.min(360, initialHue + (-10 + Math.round(20 * Math.random())))
    //   );
    //   console.log("Set hue", hue);
    //   await Promise.all(controlledBulbs.map(b => b.setHue(hue)));
    // }

    if (i % 2 === 0) {
      // const saturation = 30 + ((i * 10) % 100);
      // console.log("Set saturation", saturation);
      // await Promise.all(controlledBulbs.map(b => b.setSaturation(saturation)));
      await Promise.all(
        controlledBulbs.map(b => {
          const brightness = i % 4 === 0 ? 10 : 100;
          console.log(
            "Update brightness",
            b.dimmer,
            brightness,
            (tempo - (Date.now() - start)) / 1000
          );
          b.setBrightness(brightness, (tempo - (Date.now() - start)) / 1000);
        })
      );
    } else {
    }

    i++;
    console.log(tempo - (Date.now() - start), "until next tick");
    await new Promise(resolve =>
      setTimeout(resolve, tempo - (Date.now() - start))
    );
  }
};
