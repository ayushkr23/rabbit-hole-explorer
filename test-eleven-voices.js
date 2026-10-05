const axios = require('axios');

async function getVoices() {
  try {
    const response = await axios.get(
      `https://api.elevenlabs.io/v1/voices`,
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_KEY,
        },
      }
    );
    console.log(response.data.voices.map(v => `${v.name} (${v.voice_id})`));
  } catch (err) {
    console.error(err.message);
  }
}

getVoices();
