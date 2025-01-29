import { DBPlayer } from "../constants/types/db-models/Player";

import clientPromise from "@/lib/mongodb";
import { PlayerWithStats } from "../constants/types/db-models/Player";
import { DBMatch } from "../constants/types/db-models/Match";

export function getPichichis(players: PlayerWithStats[]) {
  return players.reduce((pichichis, player) => {
    if (pichichis.length === 0 || player.goals > pichichis[0].goals) {
      return [player];
    } else if (player.goals === pichichis[0].goals) {
      return [...pichichis, player];
    }
    return pichichis;
  }, [] as PlayerWithStats[]);
}

export async function getPlayers(): Promise<PlayerWithStats[]> {
  const client = await clientPromise;
  const db = client.db("futbol");
  const matchesCollection = db.collection("matches");
  const playersCollection = db.collection("players");

  const dbMatches = await matchesCollection.find<DBMatch>({}).toArray();
  const dbPlayers = await playersCollection.find<DBPlayer>({}).toArray();

  //percentage will be calculated in the frontend
  const playersForTable = dbPlayers.map((player) => ({
    ...player,
    wins: 0,
    draws: 0,
    losses: 0,
    goals: 0,
  }));
  if (!Array.isArray(dbMatches)) {
    return [];
  }

  dbMatches.forEach(({ oscuras, claras, winner }) => {
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

        if (winner === team) {
          playerData.wins += 1;
        } else if (winner === "draw") {
          playerData.draws += 1;
        } else {
          playerData.losses += 1;
        }

        playerData.goals += matchPlayer.goals;
      });
    });
  });

  // Calculate stats and sort players
  const playersWithStats = playersForTable.map((player) => {
    const points = player.wins * 3 + player.draws;
    const totalGames = player.wins + player.draws + player.losses;
    const maxPoints = totalGames * 3;
    const percentage = totalGames === 0 ? 0 : (points / maxPoints) * 100;

    return {
      ...player,
      points,
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal place
    };
  });

  // Sort by points (desc), then goals (desc)
  const sortedPlayers = playersWithStats.sort((a, b) => {
    if (b.points !== a.points) {
      return b.points - a.points;
    }
    return b.goals - a.goals;
  });
  // Add position
  return sortedPlayers.map((player, index) => ({
    ...player,
    _id: player._id.toString(), // Convert ObjectId to string
    position: index + 1,
  }));
}
