import "server-only";
import {
  DBPlayer,
  PlayerWithStats,
  FetchResponse,
  SerializedPlayer,
} from "@/app/constants/types";
import { getMostVotedPlayersOfTheMatch } from "@/app/features/players/utils";
import { getCollection } from "@/app/utils/server/db";
import { serializeMatch } from "@/app/features/matches/utils/server";
import { ObjectId } from "mongodb";

export async function getPlayersWithStats(
  tournamentId: string,
  untilMatchNumber?: number
): Promise<PlayerWithStats[]> {
  const matchesCollection = await getCollection("matches");
  const playersCollection = await getCollection("players");

  const dbMatches = await matchesCollection
    .find({
      tournamentId: new ObjectId(tournamentId),
      deletedAt: { $exists: false },
    })
    .toArray();

  const dbPlayers = await playersCollection
    .find({}, { sort: { name: 1 } })
    .toArray();

  const playersForTable = dbPlayers.map((player) => ({
    ...player,
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
    assists: 0,
  }));

  if (!Array.isArray(dbMatches)) {
    return [];
  }
  const serializedMatches = dbMatches.map(serializeMatch);

  const mostVotedPlayersPerMatch: string[][] = [];
  serializedMatches.forEach((match) => {
    if (untilMatchNumber && match.matchNumber >= untilMatchNumber) {
      return;
    }
    const { oscuras, claras, winner } = match;
    mostVotedPlayersPerMatch.push(getMostVotedPlayersOfTheMatch(match));

    [claras, oscuras].map(({ players, team }) => {
      if (!Array.isArray(players)) {
        return;
      }
      players.forEach((matchPlayer) => {
        const playerData = playersForTable.find(
          (playerForTable) =>
            playerForTable._id.toString() === matchPlayer._id.toString()
        );

        if (!playerData) {
          throw new Error("Player not found");
        }

        if (winner) {
          if (winner === team) {
            playerData.wins += 1;
          } else if (winner === "draw") {
            playerData.draws += 1;
          } else {
            playerData.losses += 1;
          }
        }

        playerData.goals += matchPlayer.goals;
        if (matchPlayer.assists) {
          playerData.assists += matchPlayer.assists;
        }
      });
    });
  });

  // Calculate stats and sort players
  const playersWithStats = playersForTable.map((player) => {
    const amountOfMVP = mostVotedPlayersPerMatch.filter((players) =>
      players.includes(player._id.toString())
    ).length;
    const points = player.wins * 3 + player.draws;
    const totalGames = player.wins + player.draws + player.losses;
    const maxPoints = totalGames * 3;
    const percentage = totalGames === 0 ? 0 : (points / maxPoints) * 100;

    return {
      ...player,
      mvp: amountOfMVP,
      points,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  });

  // Sort by points (desc), then goals (desc), then total games played (desc)
  const sortedPlayers = playersWithStats.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    if (b.goals !== a.goals) {
      return b.goals - a.goals;
    }
    const totalGamesA = a.wins + a.draws + a.losses;
    const totalGamesB = b.wins + b.draws + b.losses;
    return totalGamesB - totalGamesA;
  });
  // Add position
  return sortedPlayers.map((player, index) => ({
    ...player,
    _id: player._id.toString(), // Convert ObjectId to string
    position: index + 1,
  }));
}

export type PlayersResponse = {
  players: SerializedPlayer[];
  playersMap: { [key: string]: SerializedPlayer };
};

export const getPlayers = async (): Promise<FetchResponse<PlayersResponse>> => {
  const playersCollection = await getCollection("players");
  const players = await playersCollection.find({}).toArray();

  if (!players || players.length === 0) {
    return {
      error: "No players found",
      message: "No players found",
      status: 404,
    };
  }

  const serializedPlayers = serializePlayers(players);

  const playersMap = serializedPlayers.reduce(
    (acc: { [key: string]: SerializedPlayer }, player: SerializedPlayer) => {
      acc[player._id] = player;
      return acc;
    },
    {} as { [key: string]: SerializedPlayer }
  );

  return {
    data: {
      players: serializedPlayers,
      playersMap,
    },
    status: 200,
  };
};

function serializePlayers(players: DBPlayer[]) {
  return players.map((player) => ({
    ...player,
    _id: player._id.toString(),
  }));
}
