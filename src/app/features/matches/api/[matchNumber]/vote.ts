import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/app/features/auth/utils/users";
import { UserProfileWithPlayerId } from "@/app/constants/types";
import { getCollection } from "@/app/utils/server/db";
import { getMatchNumberQuery } from "@/app/features/matches/utils/server";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "@/app/utils/server/errors";
type MatchParams = {
  matchNumber: string;
};

export async function createVoteHandler(
  request: NextRequest,
  { params }: { params: MatchParams }
) {
  const user = await getAuthenticatedUser();

  const { matchNumber, playerVotedFor, tournamentId } =
    await getMatchParamsFromJson(request, params);

  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  await removeVoteFromPlayer(user?.playerId, matchNumber, tournamentId);
  await addVoteToPlayer(user, matchNumber, playerVotedFor, tournamentId);

  return NextResponse.json({ message: "Vote registered successfully" });
}

async function getMatchParamsFromJson(
  request: NextRequest,
  params: MatchParams
) {
  const matchNumber = parseInt(params.matchNumber);
  const { playerVotedFor, tournamentId } = await request.json();

  if (!playerVotedFor) {
    throw new BadRequestError("Player vote is required");
  }

  if (!tournamentId) {
    throw new BadRequestError("Tournament ID is required");
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
