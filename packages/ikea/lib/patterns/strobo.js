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

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const startTime = Date.now();

  // const initialHue = Math.round(Math.random() * 360);
  const bulbs = Object.values(getBulbs()).slice(1, 2);

  while (runningId === id) {
    const start = Date.now();

    await Promise.all(
      Object.values(bulbs).map(b => {
        const brightness = tick % 2 === 0 ? 10 : 100;
        console.log("BEAT", brightness);
        b.setBrightness(brightness, 0);
      })
    );
    // if (i % 2 === 0) {
    //   await Promise.all(
    //     Object.values(bulbs).map(b => {
    //       const brightness = i % 4 === 0 ? 10 : 100;
    //       b.setBrightness(brightness, (tempo - (Date.now() - start)) / 1000);
    //     })
    //   );
    // }
    tick++;
    await new Promise(resolve =>
      setTimeout(resolve, tempo - (Date.now() - start))
    );
  }
};
