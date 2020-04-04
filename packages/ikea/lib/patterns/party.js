const { getBulbs } = require("../lamps");
const { getTempo, getLoudness } = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now();

  const bulbs = Object.values(getBulbs());

  const starts = songDetails.energy > 0.75 && songDetails.danceability > 0.7;

  while (starts && runningId === id) {
    const tickStart = Date.now();
    const duration = Date.now() - songStart;
    const tempo = getTempo(songAnalysis, duration);
    const loudness = getLoudness(songAnalysis, duration);

    await Promise.all(
      bulbs.map(async (b) => {
        const brightness =
          tick % 2 === 0
            ? Math.round(80 + loudness)
            : Math.min(100, Math.round(110 + loudness));
        await b.setBrightness(brightness, 0);
        await b.setHue(Math.round(Math.random() * 360));
      })
    );

    console.log({
      ...songDetails,
      pattern: "party",
      id,
      duration: duration / 1000,
      bulbs: bulbs.length,
      tempo,
      loudness,
      energy: songDetails.energy,
    });
    const nextTickIn = (60 / tempo) * 1000;
    const tickDuration = Date.now() - tickStart;

    tick++;

    await new Promise((resolve) =>
      setTimeout(resolve, nextTickIn - tickDuration)
    );
  }
};
