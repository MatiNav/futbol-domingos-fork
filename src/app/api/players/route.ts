import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { playerName, playerImage, playerFavoriteTeam } =
      await request.json();

    if (!playerName) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const collection = db.collection("players");

    const result = await collection.insertOne({
      name: playerName,
      image: playerImage || "",
      favoriteTeam: playerFavoriteTeam,
      createdAt: new Date(),
    });

    return NextResponse.json({
      message: "Player created successfully",
      playerId: result.insertedId,
    });
  } catch (error) {
    console.error("Error creating player:", error);
    return NextResponse.json(
      { error: "Error creating player" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("futbol");
    const collection = db.collection("players");

    const players = await collection.find({}).toArray();

    return NextResponse.json({ players });
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Error fetching players" },
      { status: 500 }
    );
  }
}
