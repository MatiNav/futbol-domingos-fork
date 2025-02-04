import { ObjectId } from "mongodb";
import { DBPlayer } from "../constants/types/Player";
import { DBMatch, MatchTeam } from "../constants/types";
import PlayersCell from "./Table/PlayersCell";
import GoalsColumn from "./Table/GoalsCell";

type TeamColumnProps = {
  team: MatchTeam;
  index: number;
  match: DBMatch;
  playersMap: { [key: string]: DBPlayer };
  isEditable?: boolean;
  onUpdatePlayerGoals?: (team: MatchTeam, index: number, goals: number) => void;
  onUpdatePlayer?: (team: MatchTeam, index: number, playerId: ObjectId) => void;
  players?: DBPlayer[];
  isPlayerAvailable?: (
    playerId: ObjectId,
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
