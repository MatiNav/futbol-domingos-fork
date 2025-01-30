import { PlayerWithStats } from "../constants/types/db-models/Player";

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
