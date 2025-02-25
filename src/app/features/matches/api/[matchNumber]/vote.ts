import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { UserProfileWithPlayerId } from "@/app/constants/types";
import { getCollection } from "@/app/utils/server/db";
import {
  getMatchNumberFromContext,
  getMatchNumberQuery,
} from "@/app/features/matches/utils/server";
import { BadRequestError, NotFoundError } from "@/app/utils/server/errors";
import { ObjectId } from "mongodb";
import { RouteHandlerContext } from "@/app/utils/server/withErrorHandler";

export async function createVoteHandler(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const user = await getAuthenticatedUser(true);

  const { matchNumber, playerVotedFor, tournamentId } =
    await getMatchParamsFromJson(request, context);

  assertTournamentIsNotFinished(tournamentId);

  await removeVoteFromPlayer(user.playerId, matchNumber, tournamentId);
  await addVoteToPlayer(user, matchNumber, playerVotedFor, tournamentId);

  return NextResponse.json({ message: "Vote registered successfully" });
}

async function getMatchParamsFromJson(
  request: NextRequest,
  context: RouteHandlerContext
) {
  const matchNumber = getMatchNumberFromContext(context);

  const { playerVotedFor, tournamentId } = await request.json();

  if (!playerVotedFor) {
    throw new BadRequestError("Missing playerVotedFor in request body");
  }

  if (!tournamentId) {
    throw new BadRequestError("Missing tournamentId in request body");
  }

  return { matchNumber, playerVotedFor, tournamentId };
}

async function removeVoteFromPlayer(
  playerId: string,
  matchNumber: number,
  tournamentId: string
) {
  const matchesCollection = await getCollection("matches");

  try {
    // Add or update the vote
    await matchesCollection.updateOne(
      getMatchNumberQuery(matchNumber, tournamentId),
      {
        $pull: {
          playerOfTheMatchVotes: { userId: playerId },
        },
      }
    );
  } catch (error) {
    console.error("Error removing vote from player:", error);
    throw error;
  }
}

async function addVoteToPlayer(
  { playerId, displayName }: UserProfileWithPlayerId,
  matchNumber: number,
  playerVotedFor: string,
  tournamentId: string
) {
  const matchesCollection = await getCollection("matches");

  try {
    const updatedMatch = await matchesCollection.updateOne(
      getMatchNumberQuery(matchNumber, tournamentId),
      {
        $push: {
          playerOfTheMatchVotes: {
            userId: playerId,
            playerVotedFor: playerVotedFor,
            userName: displayName,
          },
        },
      }
    );

    if (!updatedMatch) {
      throw new NotFoundError("Match not found");
    }
  } catch (error) {
    console.error("Error adding vote to player:", error);
    throw error;
  }
}

async function assertTournamentIsNotFinished(tournamentId: string) {
  const tournamentsCollection = await getCollection("tournaments");
  const tournament = await tournamentsCollection.findOne({
    _id: new ObjectId(tournamentId),
  });

  if (tournament?.finished) {
    throw new BadRequestError("Tournament has finished");
  }
}
