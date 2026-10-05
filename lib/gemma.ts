import axios from "axios";

// Using Groq for blazingly fast inference of the open-source Gemma model
export async function generateContentWithGemma(topic: string, context: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is not defined in .env.local");

  const prompt = `
You are a witty, dramatic, and highly engaging podcast host. 
We are doing a "rabbit hole" deep dive on: ${topic}.

Here is some fresh context from the web:
${context.substring(0, 800)}

Task:
1. Write a short 2-3 paragraph podcast script (around 100-150 words) exploring this topic. Make it sound like a dramatic, slightly humorous spoken word intro. Do not include sound effects or speaker labels, just the spoken text.
2. Below the script, provide a concise 3-bullet point summary of the facts.
3. Finally, suggest 3 highly intriguing, related sub-topics for the user to explore next.

Format your output exactly like this:
SCRIPT:
[Your script here]
SUMMARY:
[Your summary here]
FOLLOWUPS:
[Topic 1] | [Topic 2] | [Topic 3]
`;

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "qwen/qwen3.8-27b", // Switched to Qwen (Open Source) since Groq deprecated Gemma
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const generatedText = response.data.choices[0].message.content as string;
    
    // Parse the output
    const scriptMatch = generatedText.split("SCRIPT:")[1]?.split("SUMMARY:")[0]?.trim();
    const summaryMatch = generatedText.split("SUMMARY:")[1]?.split("FOLLOWUPS:")[0]?.trim();
    const followUpsText = generatedText.split("FOLLOWUPS:")[1] || "";
    const followUps = followUpsText.split("|").map(s => s.trim()).filter(Boolean);

    return {
      script: scriptMatch || "Welcome to the rabbit hole...",
      summary: summaryMatch || "- Error generating summary.",
      followUps: followUps.length > 0 ? followUps : ["The mystery continues...", "What else?", "Dig deeper"],
    };
  } catch (error: any) {
    console.error("Gemma (Groq) error:", error.response?.data || error.message);
    throw new Error("Failed to generate content with Gemma via Groq");
  }
}
