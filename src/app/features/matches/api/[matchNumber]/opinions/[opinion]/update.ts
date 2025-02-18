import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { ObjectId } from "mongodb";
import {
  getMatchParams,
  getMatchNumberQuery,
} from "@/app/features/matches/utils/server";
import { getCollection } from "@/app/utils/server/db";
import { NotFoundError } from "@/app/utils/server/errors";
import { getOpinionParams } from "@/app/features/matches/utils/server/opinions";
export async function updateOpinionHandler(
  request: NextRequest,
  { params }: { params: { matchNumber: string; opinionId: string } }
) {
  const user = await getAuthenticatedUser();

  const { content, opinionId } = await getOpinionParams(request, params);

  const { matchNumber, tournamentId } = getMatchParams(request, params);

  const matchesCollection = await getCollection("matches");

  const result = await matchesCollection.updateOne(
    {
      ...getMatchNumberQuery(matchNumber, tournamentId),
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
    throw new NotFoundError("Opinion not found or not authorized");
  }

  return NextResponse.json({ message: "Opinion updated successfully" });
}
