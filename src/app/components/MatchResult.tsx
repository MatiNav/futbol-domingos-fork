import { DBMatch, Team } from "@/app/constants/types/db-models/Match";

interface MatchResultTableProps {
  match: DBMatch;
}

function calculateTotalGoals(team: Team) {
  return team.players.reduce((sum, player) => sum + (player.goals || 0), 0);
}

export default function MatchResultTable({ match }: MatchResultTableProps) {
  const oscurasTotal = calculateTotalGoals(match.oscuras);
  const clarasTotal = calculateTotalGoals(match.claras);

  return (
    <div className="overflow-x-auto mb-6">
      <table className="min-w-full bg-[#1a472a]">
        <thead>
          <tr>
            <th
              colSpan={2}
              className="px-4 py-2 text-white font-bold uppercase tracking-wider text-lg text-center border-b border-green-700"
            >
              Resultado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-3 text-center bg-[#8B0000] text-white text-xl font-semibold whitespace-nowrap w-1/2 border-r border-green-700">
              {oscurasTotal}
            </td>
            <td className="px-4 py-3 text-center bg-[#93C5FD] text-gray-700 text-xl font-semibold whitespace-nowrap w-1/2">
              {clarasTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
