const { getBulbs } = require("../lamps");
const { getTempo, getLoudness } = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now();

  const bulbs = getBulbs();

  // Set song color
  const initialHue = Math.round(songDetails.energy * 360);

  const starts = songDetails.energy <= 0.7 || songDetails.tempo < 90;

  if (starts) {
    await Promise.all(
      bulbs.map(async b => {
        await b.setHue(initialHue);
        await b.setBrightness(songDetails.valence < 0.1 ? 50 : 80);
        await b.setSaturation(songDetails.valence < 0.1 ? 30 : 100);
      })
    );
  }

  while (starts && runningId === id) {
    const tickStart = Date.now();
    const duration = Date.now() - songStart;
    const tempo = getTempo(songAnalysis, duration);
    const loudness = getLoudness(songAnalysis, duration);

    await Promise.all(
      bulbs.map(async b => {
        const offset = 40 * Math.sin(tick / 10);
        const hue = initialHue + offset;
        await b.setHue(hue);
      })
    );

    console.log({
      pattern: "smooth",
      id,
      duration: duration / 1000,
      bulbs: bulbs.length,
      tempo,
      loudness,
      energy: songDetails.energy,
      initialHue
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
