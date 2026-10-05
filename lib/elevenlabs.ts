import axios from "axios";

export async function generateAudio(script: string) {
  const apiKey = process.env.ELEVENLABS_KEY;
  if (!apiKey) throw new Error("ELEVENLABS_KEY is not defined");

  // "Charlie" - Deep, Confident, Energetic (Free Tier Compatible)
  const voiceId = "IKne3meq5aSn9XLyUdCD"; 

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      {
        text: script,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      },
      {
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        responseType: "arraybuffer", // Important for audio files
      }
    );

    // Convert audio buffer to base64 for easy frontend playback
    const base64Audio = Buffer.from(response.data).toString("base64");
    const audioUrl = `data:audio/mpeg;base64,${base64Audio}`;
    
    return audioUrl;
  } catch (error) {
    console.error("ElevenLabs error:", error);
    throw new Error("Failed to generate audio");
  }
}
