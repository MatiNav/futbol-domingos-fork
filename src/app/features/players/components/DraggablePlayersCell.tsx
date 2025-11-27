"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MatchTeam } from "@/app/constants/types";
import { useDraftMatch } from "@/app/contexts/DraftMatchContext";
import { useMatchWithStats } from "@/app/contexts/MatchWithStatsContext";
import PlayerAutocomplete from "./PlayerAutocomplete";
import useCustomUser from "@/app/features/auth/hooks/useCustomUser";
import { isAdmin } from "@/app/features/auth/utils/roles";

type DraggablePlayersCellProps = {
  team: MatchTeam;
  index: number;
  isEditable: boolean;
  mostVotedPlayersIds: string[];
  className?: string;
};

export default function DraggablePlayersCell({
  className = "",
  team,
  index,
  isEditable = false,
  mostVotedPlayersIds,
}: DraggablePlayersCellProps) {
  const { playersWithStats } = useMatchWithStats();
  const { draftMatch, updatePlayer, isPlayerAvailable } = useDraftMatch();
  const user = useCustomUser();
  const userIsAdmin = isAdmin(user);

  // Create unique ID for this cell
  const cellId = `${team}-${index}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: cellId,
    disabled: !isEditable || !draftMatch?.[team].players[index]?._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
  };

  if (!draftMatch) return <div> Cargando...</div>;

  const teamData = draftMatch[team];
  const isOscuras = team === "oscuras";
  const hasPlayer = teamData.players[index]?._id;

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
      ref={setNodeRef}
      style={style}
      className={`px-2 sm:px-4 py-1 sm:py-2 text-center border-r border-green-700 ${bgColor} ${textColor} ${className} ${
        isDragging ? "z-50 shadow-lg ring-2 ring-blue-500" : ""
      } ${isEditable && hasPlayer ? "cursor-grab active:cursor-grabbing" : ""}`}
      {...(isEditable && hasPlayer ? attributes : {})}
      {...(isEditable && hasPlayer ? listeners : {})}
    >
      <div className="flex items-center justify-center gap-1">
        {isMvp && <span className="text-yellow-400">⭐</span>}

        {/* Drag handle icon when draggable */}
        {isEditable && hasPlayer && (
          <div className="mr-1 opacity-50 hover:opacity-100">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={textColor}
            >
              <path d="M7 7H17V9H7V7Z" fill="currentColor" />
              <path d="M7 11H17V13H7V11Z" fill="currentColor" />
              <path d="M7 15H17V17H7V15Z" fill="currentColor" />
            </svg>
          </div>
        )}

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
          <div className="whitespace-nowrap overflow-hidden text-ellipsis max-w-full flex items-center gap-2">
            {(() => {
              const currentPlayer = playersWithStats.find(
                (player) =>
                  player._id.toString() ===
                  teamData.players[index]?._id.toString()
              );
              return (
                <>
                  {userIsAdmin &&
                    currentPlayer?.nivel !== null &&
                    currentPlayer?.nivel !== undefined && (
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center text-xs font-bold ${
                          isOscuras
                            ? "bg-white/20 text-white"
                            : "bg-gray-600 text-white"
                        }`}
                      >
                        {currentPlayer.nivel}
                      </div>
                    )}
                  <span>{currentPlayer?.name || "-"}</span>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </td>
  );
}
