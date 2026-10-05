const axios = require('axios');

async function listModels() {
  try {
    const response = await axios.get(
      "https://api.groq.com/openai/v1/models",
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );
    console.log(response.data.data.map(m => m.id));
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

listModels();
