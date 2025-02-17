import { NextResponse } from "next/server";
import { getCollection } from "@/app/utils/server/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function createPlayerHandler(request: Request) {
  try {
    const { playerName, playerImage, playerFavoriteTeam, playerEmail } =
      await request.json();

    if (!playerName) {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    const collection = await getCollection("players");

    const result = await collection.insertOne({
      _id: new ObjectId(),
      name: playerName,
      image: playerImage || "",
      favoriteTeam: playerFavoriteTeam,
      email: playerEmail,
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
