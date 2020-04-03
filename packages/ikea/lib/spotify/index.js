const fetch = require("node-fetch");

const spotifyApiUrl = "https://api.spotify.com/v1/audio-features/{id}";

module.exports = async function getSongDetails(songId) {
  // const token = await fetch()

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer BQB7aYlbzfQJWTT6ajHE5y7CjDVasi1LTaa71d_Ewl_5VXa_v6NX9r9mH97UV0LMqjKCtuMIseclC-qXxGuwF0hf0f08yLAwG2UHBHHjxO_dDB07oHTusJxOTUW40bRr3fCPyJGP5sLBNHg`
      }
    }
  );

  const body = await response.json();
  return body;
};
