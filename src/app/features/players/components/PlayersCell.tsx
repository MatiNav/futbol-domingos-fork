import { MatchTeam } from "@/app/constants/types";
import { useDraftMatch } from "@/app/contexts/DraftMatchContext";
import { useMatchWithStats } from "@/app/contexts/MatchWithStatsContext";
import PlayerAutocomplete from "./PlayerAutocomplete";
import useCustomUser from "@/app/features/auth/hooks/useCustomUser";
import { isAdmin } from "@/app/features/auth/utils/roles";

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
  const user = useCustomUser();
  const userIsAdmin = isAdmin(user);
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
      <div
        className={`flex items-center gap-1 ${
          isOscuras ? "justify-start" : "justify-end"
        }`}
      >
        {isMvp && <span className="text-yellow-400">⭐</span>}
        {isEditable ? (
          <PlayerAutocomplete
            players={playersWithStats}
            selectedPlayerId={teamData.players[index]?._id.toString()}
            onPlayerSelect={(playerId) => {
              if (playerId) {
                updatePlayer(team, index, playerId);
              }
            }}
            isPlayerAvailable={(playerId) =>
              isPlayerAvailable(playerId, team, index)
            }
            placeholder="Buscar jugador..."
            bgColor={bgColor}
            textColor={textColor}
            borderColor={borderColor}
            optionBgColor={optionBgColor}
            userIsAdmin={userIsAdmin}
            teamType={team}
          />
        ) : (
          <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            {(() => {
              const currentPlayer = playersWithStats.find(
                (player) =>
                  player._id.toString() ===
                  teamData.players[index]?._id.toString()
              );

              if (!currentPlayer || currentPlayer.name === "-") {
                return "-";
              }

              const nivelSquare = userIsAdmin &&
                currentPlayer.nivel !== null &&
                currentPlayer.nivel !== undefined && (
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                      isOscuras
                        ? "bg-white/20 text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    {currentPlayer.nivel}
                  </div>
                );

              return (
                <div className="flex items-center gap-2">
                  {isOscuras ? (
                    <>
                      {nivelSquare}
                      <span>{currentPlayer.name}</span>
                    </>
                  ) : (
                    <>
                      <span>{currentPlayer.name}</span>
                      {nivelSquare}
                    </>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </td>
  );
}
