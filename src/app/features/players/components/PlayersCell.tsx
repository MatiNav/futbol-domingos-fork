import { MatchTeam } from "@/app/constants/types";
import { useDraftMatch } from "@/app/contexts/DraftMatchContext";
import { useMatchWithStats } from "@/app/contexts/MatchWithStatsContext";

type PlayersCellProps = {
  team: MatchTeam;
  index: number;
  isEditable: boolean;
  mostVotedPlayersIds: string[];
};

export default function PlayersCell({
  className = "",
  team,
  index,
  isEditable = false,
  mostVotedPlayersIds,
}: PlayersCellProps & { className?: string }) {
  const { playersWithStats } = useMatchWithStats();
  const { draftMatch, updatePlayer, isPlayerAvailable } = useDraftMatch();
  console.log(draftMatch, "PLAYERS CELL");
  if (!draftMatch) return <div> Cargando...</div>;

  const teamData = draftMatch[team];
  const isOscuras = team === "oscuras";

  // Darker maroon for Oscuras, lighter blue for Claras
  const bgColor = isOscuras ? "bg-gray-600" : "bg-white";
  const borderColor = isOscuras ? "border-[#6B0000]" : "border-[#60A5FA]";
  const optionBgColor = isOscuras ? "#8B0000" : "#93C5FD";
  const textColor = isOscuras ? "text-white" : "text-gray-600";
  const isMvp = mostVotedPlayersIds.includes(
    teamData.players[index]?._id.toString()
  );

  return (
    <td
      className={`px-2 sm:px-4 py-1 sm:py-2 text-center border-r border-green-700 ${bgColor} ${textColor} ${className}`}
    >
      <div className="flex items-center justify-center gap-1">
        {isMvp && <span className="text-yellow-400">⭐</span>}
        {isEditable ? (
          <select
            value={teamData.players[index]?._id.toString() || ""}
            onChange={(e) => {
              const selectedPlayerId = e.target.value as unknown as string;
              if (selectedPlayerId) {
                updatePlayer(team, index, selectedPlayerId);
              }
            }}
            className={`w-[115px] px-2 py-1 ${bgColor} border 
              ${borderColor} rounded ${textColor} cursor-pointer`}
            style={{
              backgroundColor: optionBgColor,
              WebkitAppearance: "menulist",
              MozAppearance: "menulist",
              appearance: "menulist",
            }}
          >
            <option value="">
              {playersWithStats.find(
                (player) =>
                  player._id.toString() ===
                  teamData.players[index]?._id.toString()
              )?.name || "Seleccionar jugador"}
            </option>
            {playersWithStats.map((player) => {
              const isAvailable = isPlayerAvailable(player._id, team, index);
              return (
                <option
                  key={player._id.toString()}
                  value={player._id.toString()}
                  disabled={!isAvailable}
                  className={isAvailable ? textColor : "text-gray-400"}
                  style={{
                    backgroundColor: optionBgColor,
                  }}
                >
                  {player.name}
                </option>
              );
            })}
          </select>
        ) : (
          <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            {playersWithStats.find(
              (player) =>
                player._id.toString() ===
                teamData.players[index]?._id.toString()
            )?.name || "-"}
          </div>
        )}
      </div>
    </td>
  );
}
