import { DBMatch } from "../constants/types/Match";
import { PlayerWithStats } from "../constants/types/Player";

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

export function getMostVotedPlayersOfTheMatch(match: DBMatch): string[] {
  if (!match.playerOfTheMatchVotes?.length) return [];

  // Count votes for each player
  const voteCounts = match.playerOfTheMatchVotes.reduce((result, vote) => {
    const playerId = vote.playerVotedFor.toString();
    result[playerId] = (result[playerId] || 0) + 1;
    return result;
  }, {} as { [key: string]: number });

  // Find the maximum number of votes
  const maxVotes = Math.max(...Object.values(voteCounts));

  // Get all players with the maximum number of votes
  return Object.entries(voteCounts)
    .filter(([_, votes]) => votes === maxVotes)
    .map(([playerId]) => playerId);
}
