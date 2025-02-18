import { PlayerWithStats } from "@/app/constants/types/Player";

type PercentageCellProps = {
  playerId: string;
  playersWithStats: PlayerWithStats[];
  playersWithStatsUntilMatchNumber?: PlayerWithStats[];
  showOnlyMatchPercentage?: boolean;
};

export default function PercentageCell({
  playerId,
  playersWithStats,
  playersWithStatsUntilMatchNumber,
  showOnlyMatchPercentage,
}: PercentageCellProps) {
  const currentPercentage = getPercentage(playerId, playersWithStats);

  let percentageUntilMatchNumber = null;

  if (Array.isArray(playersWithStatsUntilMatchNumber)) {
    percentageUntilMatchNumber = getPercentage(
      playerId,
      playersWithStatsUntilMatchNumber
    );
  }

  return (
    <td className="px-4 py-2 text-white border-r border-green-700 text-center">
      <div className="text-lg font-bold">
        {showOnlyMatchPercentage
          ? percentageUntilMatchNumber?.toFixed(1)
          : currentPercentage?.toFixed(1)}
        %
      </div>
    </td>
  );
}

function getPercentage(playerId: string, playersWithStats: PlayerWithStats[]) {
  const player = playersWithStats.find((player) => player._id === playerId);

  if (!player) return;

  const totalGames = player.wins + player.draws + player.losses;
  const points = player.wins * 3 + player.draws;
  const maxPoints = totalGames * 3;
  const percentage = totalGames === 0 ? 0 : (points / maxPoints) * 100;
  return percentage;
}
