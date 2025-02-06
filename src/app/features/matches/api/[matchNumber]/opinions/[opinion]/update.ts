import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { ObjectId } from "mongodb";
import { DBMatch } from "@/app/constants/types";
import clientPromise from "@/lib/mongodb";

export async function updateOpinionHandler(
  request: NextRequest,
  { params }: { params: { matchNumber: string; opinionId: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { content } = await request.json();
    const matchNumber = parseInt(params.matchNumber);
    const opinionId = params.opinionId;

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

    const result = await matchesCollection.updateOne(
      {
        matchNumber,
        "opinions._id": new ObjectId(opinionId),
        "opinions.userId": user.playerId,
      },
      {
        $set: {
          "opinions.$.content": content.trim(),
          "opinions.$.updatedAt": new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Opinion not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Opinion updated successfully" });
  } catch (error) {
    console.error("Error updating opinion:", error);
    return NextResponse.json(
      { error: "Error updating opinion" },
      { status: 500 }
    );
  }
}
