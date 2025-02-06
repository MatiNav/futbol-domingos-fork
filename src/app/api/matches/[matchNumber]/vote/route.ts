import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/app/utils/server/users";
import { DBMatch } from "@/app/constants/types";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { matchNumber: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const matchNumber = parseInt(params.matchNumber);
    const { playerVotedFor } = await request.json();

    console.log("playerVotedFor", playerVotedFor);
    console.log("matchNumber", matchNumber);

    if (!playerVotedFor) {
      return NextResponse.json(
        { error: "Player vote is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const matchesCollection = db.collection<DBMatch>("matches");

    // Add or update the vote
    await matchesCollection.updateOne(
      { matchNumber },
      {
        $pull: {
          playerOfTheMatchVotes: { userId: user.playerId },
        },
      }
    );

    await matchesCollection.updateOne(
      { matchNumber },
      {
        $push: {
          playerOfTheMatchVotes: {
            userId: user.playerId,
            playerVotedFor: playerVotedFor,
            userName: user.displayName,
          },
        },
      }
    );

    return NextResponse.json({ message: "Vote registered successfully" });
  } catch (error) {
    console.error("Error registering vote:", error);
    return NextResponse.json(
      { error: "Error registering vote" },
      { status: 500 }
    );
  }
}
