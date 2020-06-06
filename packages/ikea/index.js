"use strict";
const http = require("http");
const spotify = require("./lib/spotify");
const patterns = require("./lib/patterns");

let currentTrack;
let stopCurrentPattern;
let currentPattern;

let server = http.createServer((req, res) => {
  const buffer = [];

  req.on("data", (data) => buffer.push(data.toString()));
  req.on("end", async () => {
    res.end();

    const json = JSON.parse(buffer.join(""));

    if (json.type !== "transport-state") {
      return;
    }

    const requestCurrentTrack = decodeURIComponent(
      json.data.state.currentTrack.uri
    );

    const isSongChange =
      json.type === "transport-state" && currentTrack != requestCurrentTrack;

    if (
      isSongChange &&
      requestCurrentTrack &&
      requestCurrentTrack.includes("spotify")
    ) {
      currentTrack = requestCurrentTrack;

      // parse spotify id from sonos spotify URI e.g.:
      // x-sonos-spotify:spotify:track:0cGdom0OaMZ43cDF97WtXH?sid=9&flags=0&sn=3 ->
      // 0cGdom0OaMZ43cDF97WtXH

      const trackSpotifyId = requestCurrentTrack.split(":")[3].split("?")[0];

      const authToken = await spotify.getAuthToken();
      const songDetails = await spotify.getSongDetails(
        authToken,
        trackSpotifyId
      );
      const getSongAnalysis = await spotify.getSongAnalysis(
        authToken,
        trackSpotifyId
      );

      if (stopCurrentPattern) {
        console.log("Stopping", currentPattern.patternName);
        stopCurrentPattern();
      }

      for (const pattern of patterns) {
        if (pattern.shouldStart(currentTrack, songDetails, getSongAnalysis)) {
          console.log("Initiating", pattern.patternName);
          currentPattern = pattern;
          stopCurrentPattern = pattern(
            currentTrack,
            songDetails,
            getSongAnalysis
          );

          break;
        }
      }
    }
  });
});

server.listen(5007);
console.log("Listening on http://localhost:5007/");
