const axios = require('axios');

async function testEleven() {
  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM`,
      {
        text: "hello world",
        model_id: "eleven_multilingual_v2",
      },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Success");
  } catch (err) {
    console.error(JSON.stringify(err.response?.data));
  }
}

testEleven();
