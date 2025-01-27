import { DBMatch } from "@/app/constants/types/db-models/Match";

type GoalsColumnProps = {
  team: "oscuras" | "claras";
  index: number;
  match: DBMatch;
  isEditable?: boolean;
  onUpdatePlayerGoals?: (
    team: "oscuras" | "claras",
    index: number,
    goals: number
  ) => void;
};

export default function GoalsColumn({
  team,
  index,
  match,
  isEditable = false,
  onUpdatePlayerGoals,
}: GoalsColumnProps) {
  const teamData = match[team];

  return (
    <td className="px-4 py-3 text-center text-black">
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
          className="w-16 px-2 py-1 text-center border rounded-lg"
        />
      ) : (
        teamData.players[index]?.goals || 0
      )}
    </td>
  );
}
