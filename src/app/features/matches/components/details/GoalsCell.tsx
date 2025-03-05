import { useDraftMatch } from "@/app/contexts/DraftMatchContext";

type GoalsCellProps = {
  team: "oscuras" | "claras";
  index: number;
  isEditable?: boolean;
};

export default function GoalsCell({
  team,
  index,
  isEditable = false,
}: GoalsCellProps) {
  const { draftMatch, updateGoals } = useDraftMatch();

  if (!draftMatch) return <div> Cargando...</div>;

  const teamData = draftMatch[team];

  return (
    <td className="px-4 py-2 text-center text-white border-r border-green-700">
      {isEditable ? (
        <input
          type="number"
          min="0"
          value={teamData.players[index]?.goals || 0}
          onChange={(e) =>
            updateGoals(team, index, parseInt(e.target.value) || 0)
          }
          onFocus={(e) => (e.target as HTMLInputElement).select()}
          onClick={(e) => (e.target as HTMLInputElement).select()}
          className="w-16 px-2 py-1 text-center border rounded-lg bg-green-800 text-white border-green-700"
        />
      ) : (
        teamData.players[index]?.goals || 0
      )}
    </td>
  );
}
