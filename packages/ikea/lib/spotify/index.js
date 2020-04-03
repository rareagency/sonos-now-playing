const fetch = require("node-fetch");

const spotifyApiUrl = "https://api.spotify.com/v1/audio-features/{id}";

module.exports = async function getSongDetails(songId) {
  const params = {
    grant_type: "refresh_token",
    refresh_token:
      "AQDYHT90I7vkU01HP6BqsW4IFVKJ9y21IfPhQoS9WPxETyO7tKMcc1ZITQssS3KVCHLyMne-21lMFISu5kKzSfIDHytcUIHv6FST_-MS-GmfwGysaovpuYUUfhSaKUapvos"
  };

  const searchParams = Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      authorization:
        "Basic YmI4ZTgzNTgyZGNjNDRmOTk1ZjY4MDFkNTAzZWYzZTM6NWJiOWU5NzNmYzBiNGI4OGJiNTFlNTFkMTYyNzk4ZDU="
    },
    body: searchParams
  });

  const { access_token } = await tokenResponse.json();

  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    }
  );

  const body = await response.json();
  return body;
};
