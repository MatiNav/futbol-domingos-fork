import { PlayerWithStats } from "@/app/constants/types/Player";

type PercentageCellProps = {
  playerId: string;
  playersWithStats: PlayerWithStats[];
};

export default function PercentageCell({
  playerId,
  playersWithStats,
}: PercentageCellProps) {
  const player = playersWithStats.find((player) => player._id === playerId);

  if (!player) return <td className="px-4 py-2 text-center text-white">-</td>;

  const totalGames = player.wins + player.draws + player.losses;
  const points = player.wins * 3 + player.draws;
  const maxPoints = totalGames * 3;
  const percentage = totalGames === 0 ? 0 : (points / maxPoints) * 100;

  return (
    <td className="px-4 py-2 text-center text-white border-r border-green-700">
      {percentage.toFixed(1)}%
    </td>
  );
}
