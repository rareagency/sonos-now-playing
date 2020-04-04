const { getBulbs } = require("../ikea");
const { getTempo, getLoudness } = require("../songProperties");

let runningId = null;

module.exports = async function onSongChange(id, songDetails, songAnalysis) {
  runningId = id;

  let tick = 0;
  const songStart = Date.now();

  const bulbs = Object.values(getBulbs()).slice(1, 2);

  // Set song color
  const initialHue = Math.round(songDetails.energy * 360);
  await Promise.all(bulbs.map(b => b.setHue(initialHue)));

  while (runningId === id) {
    // console.log("BEAT");

    const tickStart = Date.now();
    const duration = Date.now() - songStart;
    const tempo = getTempo(songAnalysis, duration);
    const loudness = getLoudness(songAnalysis, duration);

    console.log({ tempo, loudness, energy: songDetails.energy });

    await Promise.all(
      bulbs.map(b => {
        const brightness = tick % 2 === 0 ? 1 : 100 - loudness;
        b.setBrightness(brightness, 0);
      })
    );

    const nextTickIn = (60 / tempo) * 1000;
    const tickDuration = Date.now() - tickStart;

    tick++;

    await new Promise(resolve =>
      setTimeout(resolve, nextTickIn - tickDuration)
    );
  }
};
