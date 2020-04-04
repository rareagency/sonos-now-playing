const { getAuthToken, getSongAnalysis } = require("./spotify/index");

const getTempo = (songAnalysis, time) => {
  const sections = songAnalysis.sections;
  const match = sections.find(
    (a) => a.start * 1000 <= time && a.start * 1000 + a.duration * 1000 >= time
  );
  return match ? match.tempo : null;
};

const getLoudness = (songAnalysis, time) => {
  const segments = songAnalysis.segments;
  const match = segments.find(
    (a) => a.start * 1000 <= time && a.start * 1000 + a.duration * 1000 >= time
  );
  return match ? match.loudness_max : null;
};

module.exports = { getTempo, getLoudness };
