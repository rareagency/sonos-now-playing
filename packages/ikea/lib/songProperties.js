const { getAuthToken, getSongAnalysis } = require("./spotify/index");

const getTempo = (songAnalysis, time) => {
  const sections = songAnalysis.sections;
  const match = sections.find(
    (a) => a.start <= time && a.start + a.duration >= time
  );
  return match ? match.tempo : null;
};

const getLoudness = (songAnalysis, time) => {
  const sections = songAnalysis.sections;
  const match = sections.find(
    (a) => a.start <= time && a.start + a.duration >= time
  );
  return match ? match.loudness : null;
};

module.exports = { getTempo, getLoudness };
