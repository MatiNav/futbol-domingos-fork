import { SerializedTeam, SerializedMatch } from "@/app/constants/types";

type MatchResultProps = {
  match: SerializedMatch;
};

function calculateTotalGoals(team: SerializedTeam) {
  return team.players.reduce((sum, player) => sum + (player.goals || 0), 0);
}

export default function MatchResult({ match }: MatchResultProps) {
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
            <td className="px-4 py-3 text-center bg-gray-600 text-white text-xl font-semibold whitespace-nowrap w-1/2 border-r border-green-700">
              {oscurasTotal}
            </td>
            <td className="px-4 py-3 text-center bg-white text-gray-600 text-xl font-semibold whitespace-nowrap w-1/2">
              {clarasTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
