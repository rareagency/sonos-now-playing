const { getBulbs } = require("../lamps");
const { getTempo, getLoudness } = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now();

  const bulbs = getBulbs();

  const starts = songDetails.energy > 0.7 && songDetails.danceability > 0.7;

  const minLoudness = Math.abs(
    Math.min(...songAnalysis.segments.map(({ loudness_max }) => loudness_max))
  );

  while (starts && runningId === id) {
    const tickStart = Date.now();
    const duration = Date.now() - songStart;
    const tempo = getTempo(songAnalysis, duration);
    const loudness = getLoudness(songAnalysis, duration);

    const loudnessPercentage = Math.max(
      0.1,
      1 - Math.abs(loudness) / minLoudness
    );

    const brightness =
      tick % 2 === 0 ? 80 * loudnessPercentage : 100 * loudnessPercentage;
    await Promise.all(
      bulbs.map(async b => {
        await b.setBrightness(brightness, 0);
        await b.setHue(Math.round(Math.random() * 360));
      })
    );

    console.log({
      brightness,
      loudnessPercentage,
      pattern: "party",
      id,
      duration: duration / 1000,
      bulbs: bulbs.length,
      tempo,
      loudness,
      energy: songDetails.energy
    });
    const nextTickIn = (60 / tempo) * 1000;
    const tickDuration = Date.now() - tickStart;

    tick++;

    await new Promise(resolve =>
      setTimeout(resolve, nextTickIn - tickDuration)
    );
  }
};
