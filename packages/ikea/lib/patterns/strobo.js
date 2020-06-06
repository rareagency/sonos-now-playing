const { getBulbs } = require("../lamps");
const {
  getCurrentSegment,
  getTempo,
  getLoudness
} = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now() + 100;

  const bulbs = getBulbs();

  // Set song color
  const initialHue = Math.round(
    (songDetails.energy - songDetails.valence) * 360
  );

  const starts =
    songDetails.tempo > 90 &&
    songDetails.energy > 0.8 &&
    songDetails.danceability < 0.7;

  if (starts) {
    await Promise.all(
      bulbs.map(async b => {
        await b.setHue(initialHue);
        await b.setSaturation(100);
      })
    );
  }

  const minLoudness = Math.abs(
    Math.min(
      ...songAnalysis.segments
        .slice(
          Math.round(songAnalysis.segments.length * 0.1),
          -Math.round(songAnalysis.segments.length * 0.1)
        )
        .map(({ loudness_max }) => loudness_max)
    )
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

    const brightness =
      tick % 2 === 0 ? 80 * loudnessPercentage : 100 * loudnessPercentage;
    await Promise.all(
      bulbs.map(b => {
        return b.setBrightness(Math.round(brightness), 0);
      })
    );

    console.log({
      brightness,
      loudnessPercentage,
      minLoudness,
      loudnessAbs: Math.abs(loudness),
      initialHue,
      pattern: "strobo",
      id,
      duration: duration / 1000,
      bulbs: bulbs.length,
      tempo,
      loudness,
      energy: songDetails.energy
    });
    console.log();
    console.log(songDetails);

    const nextTickIn = (60 / tempo) * 1000;
    const tickDuration = Date.now() - tickStart;

    tick++;

    await new Promise(resolve =>
      setTimeout(resolve, nextTickIn - tickDuration)
    );
  }
};
