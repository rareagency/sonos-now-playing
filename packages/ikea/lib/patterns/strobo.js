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

module.exports = async function onSongChange(songDetails, id) {
  const tempo = (60 / songDetails.tempo) * 1000;

  running = true;
  let i = 0;

  if (!runningId) {
    runningId = id;
  }

  const initialHue = Math.round(Math.random() * 360);
  const bulbs = Object.values(getBulbs());

  while (runningId === id) {
    const start = Date.now();

    if (i % 2 === 0) {
      await Promise.all(
        Object.values(bulbs).map(b => {
          const brightness = i % 4 === 0 ? 10 : 100;
          b.setBrightness(brightness, (tempo - (Date.now() - start)) / 1000);
        })
      );
    }

    i++;
    await new Promise(resolve =>
      setTimeout(resolve, tempo - (Date.now() - start))
    );
  }
};