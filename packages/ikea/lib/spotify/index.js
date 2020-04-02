const fetch = require("node-fetch");

const spotifyApiUrl = "https://api.spotify.com/v1/audio-features/{id}";

module.exports = async function getSongDetails(songId) {
  // const token = await fetch()

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer BQBrg9BfzOnMDFQPXjFktk5SLYUzAWiNQPov-dfFPbY-v45sOyIzgVszd8NSGYTzJRk1eHHK9kBD7sm3BOoY0TAVMIVBwMlyvXmY2JVXge4i6gxmQd9snRwOPJSV7PhBt_1eMfsLqJJmXjo`
      }
    }
  );

  const body = await response.json();
  return body;
};
