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
  players,
  isEditable,
  onUpdatePlayer,
  isPlayerAvailable,
}: PlayersColumnProps) {
  const teamData = match[team];
  const borderColor = team === "oscuras" ? "border-red-400" : "border-blue-400";
  const bgColor = team === "oscuras" ? "bg-red-300" : "bg-blue-300";

  return (
    <td className={`px-4 py-3 text-center ${bgColor}`}>
      {isEditable ? (
        <select
          value={teamData.players[index]?._id.toString() || ""}
          onChange={(e) => {
            const playerId = players.find(
              (player) => player.name === e.target.value
            )?._id;
            if (playerId) {
              onUpdatePlayer?.(team, index, playerId);
            }
          }}
          className={`w-[115px] px-2 py-1 bg-transparent border ${borderColor} rounded-lg`}
        >
          <option value="">
            {playersMap[teamData.players[index]?._id.toString()]?.name ||
              "Seleccionar jugador"}
          </option>
          {players.map((player) => {
            const isAvailable = isPlayerAvailable?.(player._id, team, index);
            return (
              <option
                key={player._id.toString()}
                value={player.name}
                disabled={!isAvailable}
                className={`${isAvailable ? "text-green-600" : "text-red-600"}`}
                style={{
                  color: isAvailable ? "#16a34a" : "#dc2626",
                  backgroundColor: "white",
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
