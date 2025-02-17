import { SerializedMatch } from "@/app/constants/types";

type GoalsCellProps = {
  team: "oscuras" | "claras";
  index: number;
  match: SerializedMatch;
  isEditable?: boolean;
  onUpdatePlayerGoals?: (
    team: "oscuras" | "claras",
    index: number,
    goals: number
  ) => void;
};

export default function GoalsCell({
  team,
  index,
  match,
  isEditable = false,
  onUpdatePlayerGoals,
}: GoalsCellProps) {
  const teamData = match[team];

  return (
    <td className="px-4 py-2 text-center text-white border-r border-green-700">
      {isEditable ? (
        <input
          type="number"
          min="0"
          value={teamData.players[index]?.goals || 0}
          onChange={(e) =>
            onUpdatePlayerGoals?.(team, index, parseInt(e.target.value) || 0)
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
