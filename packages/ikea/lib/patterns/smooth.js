const { getBulbs } = require("../lamps");
const { getTempo, getLoudness } = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now();

  const bulbs = Object.values(getBulbs());

  // Set song color
  const initialHue = Math.round(songDetails.energy * 360);

  const starts = songDetails.energy < 0.75;
  console.log("smooth", starts);

  if (starts) {
    await Promise.all(
      bulbs.map(async (b) => {
        b.setHue(initialHue);
        b.setBrightness(80);
      })
    );
  }

  while (starts && runningId === id) {
    console.clear();

    const tickStart = Date.now();
    const duration = Date.now() - songStart;
    const tempo = getTempo(songAnalysis, duration);
    const loudness = getLoudness(songAnalysis, duration);

    console.log({
      ...songDetails,
      pattern: "smooth",
      id,
      duration: duration / 1000,
      bulbs: bulbs.length,
      tempo,
      loudness,
      energy: songDetails.energy,
      initialHue,
    });
    console.log();

    await Promise.all(
      bulbs.map((b) => {
        const offset = 40 * Math.sin(tick / 10);
        const hue = initialHue + offset;
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
};
