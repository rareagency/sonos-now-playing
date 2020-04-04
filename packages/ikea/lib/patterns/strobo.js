const { getBulbs } = require("../lamps");
const { getTempo, getLoudness } = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now();

  const bulbs = Object.values(getBulbs());

  // Set song color
  const initialHue = Math.round(
    (songDetails.energy - songDetails.valence) * 360
  );

  const starts =
    songDetails.tempo > 90 &&
    songDetails.energy > 0.8 &&
    songDetails.danceability < 0.7;

  if (starts) {
    await Promise.all(bulbs.map((b) => b.setHue(initialHue)));
  }

  const minLoudness = Math.abs(
    Math.min(...songAnalysis.segments.map(({ loudness_max }) => loudness_max))
  );

  while (starts && runningId === id) {
    console.clear();

    const tickStart = Date.now();
    const duration = Date.now() - songStart;
    const tempo = getTempo(songAnalysis, duration);
    const loudness = getLoudness(songAnalysis, duration);

    const loudnessPercentage = Math.max(
      0.1,
      1 - Math.abs(loudness) / minLoudness
    );

    await Promise.all(
      bulbs.map((b) => {
        const brightness =
          tick % 2 === 0 ? 80 * loudnessPercentage : 100 * loudnessPercentage;
        return b.setBrightness(Math.round(brightness), 0);
      })
    );

    console.log({
      loudness2: [
        Math.abs(loudness),
        minLoudness,
        1 - Math.abs(loudness) / minLoudness,
      ],
      pattern: "strobo",
      id,
      duration: duration / 1000,
      bulbs: bulbs.length,
      tempo,
      loudness,
      energy: songDetails.energy,
    });
    console.log();
    console.log(songDetails);

    const nextTickIn = (60 / tempo) * 1000;
    const tickDuration = Date.now() - tickStart;

    tick++;

    await new Promise((resolve) =>
      setTimeout(resolve, nextTickIn - tickDuration)
    );
  }
};
