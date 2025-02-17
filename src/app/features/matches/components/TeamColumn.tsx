import { SerializedPlayer } from "@/app/constants/types/Player";
import { MatchTeam, SerializedMatch } from "@/app/constants/types/Match";
import PlayersCell from "@/app/features/players/components/PlayersCell";
import GoalsColumn from "@/app/components/Table/GoalsCell";

type TeamColumnProps = {
  team: MatchTeam;
  index: number;
  match: SerializedMatch;
  playersMap: { [key: string]: SerializedPlayer };
  isEditable?: boolean;
  onUpdatePlayerGoals?: (team: MatchTeam, index: number, goals: number) => void;
  onUpdatePlayer?: (team: MatchTeam, index: number, playerId: string) => void;
  players?: SerializedPlayer[];
  isPlayerAvailable?: (
    playerId: string,
    team: MatchTeam,
    currentIndex: number
  ) => boolean;
  mostVotedPlayersIds: string[];
};

export default function TeamColumn({
  team,
  index,
  match,
  playersMap,
  isEditable = false,
  onUpdatePlayerGoals,
  onUpdatePlayer,
  players = [],
  isPlayerAvailable,
  mostVotedPlayersIds,
}: TeamColumnProps) {
  const goalsColumnComponent = (
    <GoalsColumn
      team={team}
      index={index}
      match={match}
      isEditable={isEditable}
      onUpdatePlayerGoals={onUpdatePlayerGoals}
    />
  );

  const playerColumnComponent = (
    <PlayersCell
      mostVotedPlayersIds={mostVotedPlayersIds}
      team={team}
      index={index}
      match={match}
      playersMap={playersMap}
      players={players}
      isEditable={isEditable}
      onUpdatePlayer={onUpdatePlayer}
      isPlayerAvailable={isPlayerAvailable}
    />
  );

  return (
    <>
      {team === "oscuras" ? (
        <>
          {goalsColumnComponent}
          {playerColumnComponent}
        </>
      ) : (
        <>
          {playerColumnComponent}
          {goalsColumnComponent}
        </>
      )}
    </>
  );
}
