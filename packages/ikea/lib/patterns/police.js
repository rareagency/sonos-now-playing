const { getBulbs } = require("../lamps");
const { getTempo } = require("../songProperties");

const shouldStart = (id, songDetails) => {
  return (
    songDetails.name.toLowerCase().includes("police") ||
    songDetails.artists.some((artist) =>
      artist.name.toLowerCase().includes("police")
    )
  );
};

module.exports = function onSongChange(id, songDetails, songAnalysis) {
  let running = true;
  (async () => {
    let tick = 0;
    const songStart = Date.now();
    const bulbs = getBulbs();

    await Promise.all(
      bulbs.map(async (b) => {
        await b.setBrightness(50);
        await b.setSaturation(100);
      })
    );

    while (running) {
      const tickStart = Date.now();
      const duration = Date.now() - songStart;

      const tempo = getTempo(songAnalysis, duration);

      await Promise.all(
        bulbs.map((b, i) => {
          const hue = (tick + i) % 2 === 0 ? 0 : 240;
          return b.setHue(hue);
        })
      );

      const nextTickIn = (60 / tempo) * 1000;
      const tickDuration = Date.now() - tickStart;

      tick++;

      await new Promise((resolve) =>
        setTimeout(resolve, nextTickIn - tickDuration)
      );
    }
  })();
  return () => {
    running = false;
  };
};

module.exports.shouldStart = shouldStart;
module.exports.patternName = "police";
