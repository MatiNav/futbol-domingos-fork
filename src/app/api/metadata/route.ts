import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { DBPlayer } from "@/app/constants/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Verify secret from Authorization header
    const secret = request.headers.get("Authorization");

    //replace with process.env.AUTH0_ACTION_SECRET
    if (secret !== "your-secure-random-string") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const playersCollection = db.collection("players");

    const player = await playersCollection.findOne<DBPlayer>({ email });

    if (!player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    console.log("player", player);
    // Return the metadata that Auth0 should store
    return NextResponse.json({
      metadata: {
        role: player.role || "user",
        playerId: player._id.toString(),
        displayName: player.name,
        favoriteTeam: player.favoriteTeam,
        image: player.image,
      },
    });
  } catch (error) {
    console.error("Error fetching user metadata:", error);
    return NextResponse.json(
      { error: "Error fetching user metadata" },
      { status: 500 }
    );
  }
}
