import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/app/utils/server/users";
import { ObjectId } from "mongodb";
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
    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Opinion content is required" },
        { status: 400 }
      );
    }

    if (content.trim().length > 1000) {
      return NextResponse.json(
        { error: "Opinion must be 1000 characters or less" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("futbol");
    const matchesCollection = db.collection<DBMatch>("matches");

    await matchesCollection.updateOne(
      { matchNumber },
      {
        $push: {
          opinions: {
            _id: new ObjectId(),
            userId: user.playerId,
            userName: user.displayName,
            content: content.trim(),
            createdAt: new Date(),
          },
        },
      }
    );

    return NextResponse.json({ message: "Opinion registered successfully" });
  } catch (error) {
    console.error("Error registering opinion:", error);
    return NextResponse.json(
      { error: "Error registering opinion" },
      { status: 500 }
    );
  }
}
