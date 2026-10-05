import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import RabbitHole from "@/models/RabbitHole";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectToDatabase();
    // Get latest 6 rabbit holes
    const holes = await RabbitHole.find({}, "topic _id createdAt")
      .sort({ createdAt: -1 })
      .limit(6);
      
    return NextResponse.json(holes);
  } catch (error) {
    console.error("Fetch Trending Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
