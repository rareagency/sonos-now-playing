
const fetch = require('node-fetch');

const spotifyApiUrl = 'https://api.spotify.com/v1/audio-features/{id}'

module.exports = async function getSongDetails(songId) {
  // const token = await fetch()

  const response = await fetch(`https://api.spotify.com/v1/audio-features/${songId}`, {
    headers: {
      'Authorization': `Bearer BQCYnyWOXri4_881mCpXcOeJYHN-ii2rmwQkqG8oyTb9NmAJmxCvxo06IndLAECV2B4ISUpULF20j_I36PrkCVMda30iO15QOjYgVz-1fhJagHeoQqfEUShrORTJ3fakvaQFrZouyKtaHec`
    }
  })

  const body = await response.json();
  return body;
}

