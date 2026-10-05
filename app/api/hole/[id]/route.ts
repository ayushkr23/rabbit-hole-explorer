import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import RabbitHole from "@/models/RabbitHole";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const hole = await RabbitHole.findById(id);
    
    if (!hole) {
      return NextResponse.json({ error: "Rabbit hole not found" }, { status: 404 });
    }

    return NextResponse.json(hole);
  } catch (error) {
    console.error("Fetch Hole Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
