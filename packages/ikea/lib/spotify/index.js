const fetch = require("node-fetch");

module.exports.getAuthToken = async function getAuthToken() {
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
  return access_token;
};

module.exports.getSongAnalysis = async function getSongAnalysis(
  authToken,
  songId
) {
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }
  );

  const body = await response.json();
  return body;
};

module.exports.getSongDetails = async function getSongDetails(
  authToken,
  songId
) {
  const response = await fetch(
    `https://api.spotify.com/v1/audio-features/${songId}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    }
  );

  const body = await response.json();
  return body;
};
