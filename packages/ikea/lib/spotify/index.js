const fetch = require("node-fetch");

const spotifyApiUrl = "https://api.spotify.com/v1/audio-features/{id}";

module.exports = async function getSongDetails(songId) {
  // const token = await fetch()

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer BQA_yqjoQAxNd8zVHzRni1fbHFrYhywNdQ98lAJdCR27F4OxOrdKSlRdr8Dviu5Cr3l_1Xn14rT97_9VCNmr__9Wd3VD7dZ6OM5w8_QnE0xwNARNj0VizXz4zDalDV2hA468AKEppljPbl8`
      }
    }
  );

  const body = await response.json();
  return body;
};
