import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { ObjectId } from "mongodb";
import {
  getMatchNumberQuery,
  getMatchParams,
} from "@/app/features/matches/utils/server";
import { getCollection } from "@/app/utils/server/db";
import { BadRequestError, NotFoundError } from "@/app/utils/server/errors";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";

export async function deleteOpinionHandler(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const user = await getAuthenticatedUser(true);

  const opinionId = context.params.opinionId;
  if (opinionId == null || typeof opinionId !== "string") {
    throw new BadRequestError("Missing opinionId in params or is not a string");
  }

  const { matchNumber, tournamentId } = getMatchParams(request, context);

  const matchesCollection = await getCollection("matches");

  const result = await matchesCollection.updateOne(
    {
      ...getMatchNumberQuery(matchNumber, tournamentId),
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
    throw new NotFoundError("Opinion not found or not authorized");
  }

  return NextResponse.json({ message: "Opinion deleted successfully" });
}
