import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("futbol");
    const collection = db.collection("matches");

    const lastMatch = await collection
      .find({})
      .sort({ matchNumber: -1 })
      .limit(1)
      .toArray();

    const maxMatchNumber = lastMatch.length > 0 ? lastMatch[0].matchNumber : 1;

    return NextResponse.json({ maxMatchNumber });
  } catch (error) {
    console.error("Error fetching max match number:", error);
    return NextResponse.json(
      { error: "Error fetching max match number" },
      { status: 500 }
    );
  }
}
