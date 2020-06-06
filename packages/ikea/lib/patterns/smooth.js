const { getBulbs } = require("../lamps");
const { getTempo, getLoudness } = require("../songProperties");

const shouldStart = (id, songDetails, songAnalysis) => {
  return songDetails.energy <= 0.7 || songDetails.tempo < 90;
};

module.exports = function onSongChange(id, songDetails, songAnalysis) {
  let running = true;

  (async () => {
    let tick = 0;
    const songStart = Date.now();

    const bulbs = getBulbs();

    // Set song color
    const initialHue = Math.round(songDetails.energy * 360);

    await Promise.all(
      bulbs.map(async (b) => {
        await b.setHue(initialHue);
        await b.setBrightness(songDetails.valence < 0.1 ? 50 : 80);
        await b.setSaturation(songDetails.valence < 0.1 ? 30 : 100);
      })
    );

    while (running) {
      const tickStart = Date.now();
      const duration = Date.now() - songStart;
      const tempo = getTempo(songAnalysis, duration);
      const loudness = getLoudness(songAnalysis, duration);

      await Promise.all(
        bulbs.map(async (b) => {
          const offset = 40 * Math.sin(tick / 10);
          const hue = initialHue + offset;
          await b.setHue(hue);
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
module.exports.patternName = "smooth";
