import { DBMatch, MatchTeam } from "@/app/constants/types/db-models/Match";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import { ObjectId } from "mongodb";

type PlayersColumnProps = {
  team: MatchTeam;
  index: number;
  match: DBMatch;
  playersMap: { [key: string]: DBPlayer };
  players: DBPlayer[];
  isEditable: boolean;
  onUpdatePlayer?: (team: MatchTeam, index: number, playerId: ObjectId) => void;
  isPlayerAvailable?: (
    playerId: ObjectId,
    team: MatchTeam,
    currentIndex: number
  ) => boolean;
};

export default function PlayersColumn({
  team,
  index,
  match,
  playersMap,
  isEditable,
  onUpdatePlayer,
  isPlayerAvailable,
}: PlayersColumnProps) {
  const teamData = match[team];
  const isOscuras = team === "oscuras";

  // Darker maroon for Oscuras, lighter blue for Claras
  const bgColor = isOscuras ? "bg-[#8B0000]" : "bg-[#93C5FD]";
  const borderColor = isOscuras ? "border-[#6B0000]" : "border-[#60A5FA]";
  const optionBgColor = isOscuras ? "#8B0000" : "#93C5FD";
  const textColor = isOscuras ? "text-white" : "text-gray-700"; // Changed from text-black to text-gray-700

  return (
    <td
      className={`px-4 py-2 text-center ${bgColor} ${textColor} border-r border-green-900`}
    >
      {isEditable ? (
        <select
          value={teamData.players[index]?._id.toString() || ""}
          onChange={(e) => {
            const selectedPlayerId = e.target.value as unknown as ObjectId;
            console.log(selectedPlayerId, "selectedPlayerId");
            if (selectedPlayerId) {
              onUpdatePlayer?.(team, index, selectedPlayerId);
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
            {playersMap[teamData.players[index]?._id.toString()]?.name ||
              "Seleccionar jugador"}
          </option>
          {Object.values(playersMap).map((player) => {
            const isAvailable = isPlayerAvailable?.(player._id, team, index);
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
        playersMap[teamData.players[index]?._id.toString()]?.name || ""
      )}
    </td>
  );
}
