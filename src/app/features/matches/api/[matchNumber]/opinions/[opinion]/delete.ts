import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { ObjectId } from "mongodb";
import {
  getMatchNumberQuery,
  getMatchParams,
} from "@/app/features/matches/utils/server";
import { getCollection } from "@/app/utils/server/db";
import { NotFoundError } from "@/app/utils/server/errors";

export async function deleteOpinionHandler(
  request: NextRequest,
  { params }: { params: { matchNumber: string; opinionId: string } }
) {
  const user = await getAuthenticatedUser();

  const { matchNumber, tournamentId } = getMatchParams(request, params);
  const opinionId = params.opinionId;

  const matchesCollection = await getCollection("matches");

  const result = await matchesCollection.updateOne(
    {
      ...getMatchNumberQuery(matchNumber, tournamentId),
      "opinions._id": new ObjectId(opinionId),
      "opinions.userId": user?.playerId,
    },
    {
      $pull: {
        opinions: {
          _id: new ObjectId(opinionId),
          userId: user?.playerId,
        },
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new NotFoundError("Opinion not found or not authorized");
  }

  return NextResponse.json({ message: "Opinion deleted successfully" });
}
