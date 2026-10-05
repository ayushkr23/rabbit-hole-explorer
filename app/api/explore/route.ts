import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import RabbitHole from "@/models/RabbitHole";
import { searchWeb } from "@/lib/serpapi";
import { generateContentWithGemma } from "@/lib/gemma";
import { generateAudio } from "@/lib/elevenlabs";

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // 1. Fetch live context via SerpApi
    console.log("Searching the web for:", topic);
    const context = await searchWeb(topic);

    // 2. Generate Script & Summary via Gemma 2
    console.log("Generating content with Gemma...");
    const { script, summary, followUps } = await generateContentWithGemma(topic, context);

    // 3. Generate Podcast Audio via ElevenLabs
    console.log("Generating audio with ElevenLabs...");
    let audioUrl = "";
    try {
      audioUrl = await generateAudio(script);
    } catch (audioErr) {
      console.warn("ElevenLabs failed (likely out of credits), skipping audio generation.");
      // We continue without audio so the app doesn't crash!
    }

    // 4. Save to MongoDB Atlas
    console.log("Saving to MongoDB Atlas...");
    await connectToDatabase();
    const rabbitHole = await RabbitHole.create({
      topic,
      summary,
      script,
      audioUrl,
      followUps,
    });

    return NextResponse.json({ success: true, id: rabbitHole._id });
  } catch (error: any) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
