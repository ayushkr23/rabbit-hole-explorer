import axios from "axios";

export async function searchWeb(topic: string) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) throw new Error("SERPAPI_KEY is not defined");

  try {
    const response = await axios.get("https://serpapi.com/search.json", {
      params: {
        engine: "google",
        q: `${topic} history facts deep dive`,
        api_key: apiKey,
        num: 5, // Top 5 results for context
      },
    });

    const organicResults = response.data.organic_results || [];
    // Extract snippets to feed to Gemma
    const context = organicResults
      .map((r: any) => `${r.title}: ${r.snippet}`)
      .join("\n\n");

    return context;
  } catch (error) {
    console.error("SerpApi error:", error);
    throw new Error("Failed to search the web");
  }
}
