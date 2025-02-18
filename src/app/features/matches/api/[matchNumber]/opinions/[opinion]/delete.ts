import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { ObjectId } from "mongodb";
import { DBMatch } from "@/app/constants/types";
import {
  getMatchParams,
  getMatchQuery,
} from "@/app/features/matches/utils/server";

export async function deleteOpinionHandler(
  request: NextRequest,
  { params }: { params: { matchNumber: string; opinionId: string } }
) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { matchNumber, tournamentId } = getMatchParams(request, params);
    const opinionId = params.opinionId;

    const client = await clientPromise;
    const db = client.db("futbol");
    const matchesCollection = db.collection<DBMatch>("matches");

    const result = await matchesCollection.updateOne(
      {
        ...getMatchQuery(matchNumber, tournamentId),
        "opinions._id": new ObjectId(opinionId),
        "opinions.userId": user.playerId,
      },
      {
        $pull: {
          opinions: {
            _id: new ObjectId(opinionId),
            userId: user.playerId,
          },
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Opinion not found or not authorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Opinion deleted successfully" });
  } catch (error) {
    console.error("Error deleting opinion:", error);
    return NextResponse.json(
      { error: "Error deleting opinion" },
      { status: 500 }
    );
  }
}
