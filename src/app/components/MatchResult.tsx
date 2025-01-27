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
      <table className="min-w-full">
        <thead>
          <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
            <th
              colSpan={2}
              className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-lg text-center"
            >
              Resultado
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-50">
            <td className="px-4 py-3 text-center bg-red-300 text-xl font-semibold whitespace-nowrap w-1/2">
              {oscurasTotal}
            </td>
            <td className="px-4 py-3 text-center bg-blue-300 text-xl font-semibold whitespace-nowrap w-1/2">
              {clarasTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
