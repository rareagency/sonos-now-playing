const fetch = require("node-fetch");

const spotifyApiUrl = "https://api.spotify.com/v1/audio-features/{id}";

module.exports = async function getSongDetails(songId) {
  // const token = await fetch()

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer BQAm0NieQuK2oLZrSbaEfWEYtwa4odQoSrOGHtgRR1vQ7imXUi5y4DW16nVUtwsWeCGQzSYw1ZD8npU0XCBhMwsYwZ2A3JbVwrcVT2rX3E1Lrws0hK2ZkSrhf0cKb6ivTjw1IAQOzKVw1c4`
      }
    }
  );

  const body = await response.json();
  return body;
};
