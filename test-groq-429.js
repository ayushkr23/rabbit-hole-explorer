const axios = require('axios');

async function testGroqLimit() {
  const prompt = `
You are a witty, dramatic, and highly engaging podcast host. 
We are doing a "rabbit hole" deep dive on: cats.

Here is some fresh context from the web:
cats are animals.

Task:
1. Write a short 2-3 paragraph podcast script (around 100-150 words) exploring this topic. Make it sound like a dramatic, slightly humorous spoken word intro. Do not include sound effects or speaker labels, just the spoken text.
2. Below the script, provide a concise 3-bullet point summary of the facts.

Format your output exactly like this:
SCRIPT:
[Your script here]
SUMMARY:
[Your summary here]
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "qwen/qwen3.8-27b",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Success");
  } catch (err) {
    console.error(JSON.stringify(err.response?.data, null, 2));
  }
}

testGroqLimit();
