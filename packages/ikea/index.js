"use strict";
const http = require("http");
const getSongDetails = require("./lib/spotify");
const patterns = require("./lib/patterns");

let currentTrack;

let server = http.createServer((req, res) => {
  const buffer = [];

  req.on("data", data => buffer.push(data.toString()));
  req.on("end", async () => {
    res.end();

    const json = JSON.parse(buffer.join(""));

    const requestCurrentTrack = json.data.state.currentTrack.uri;
    const isSongChange =
      json.type === "transport-state" && currentTrack != requestCurrentTrack;

    if (isSongChange) {
      currentTrack = requestCurrentTrack;

      // parse spotify id from sonos spotify URI e.g.:
      // x-sonos-spotify:spotify:track:0cGdom0OaMZ43cDF97WtXH?sid=9&flags=0&sn=3 ->
      // 0cGdom0OaMZ43cDF97WtXH
      const trackSpotifyId = requestCurrentTrack.split(":")[3].split("?")[0];
      const songDetails = await getSongDetails(trackSpotifyId);
      console.log('SONG CHANGED:');
      console.log(songDetails);

      await patterns.strobo(songDetails, Date.now());
    }
  });
});

server.listen(5007);
console.log("Listening on http://localhost:5007/");
