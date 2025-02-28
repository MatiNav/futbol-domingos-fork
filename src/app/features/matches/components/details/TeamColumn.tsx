import {
  PlayerWithStats,
  SerializedPlayer,
} from "@/app/constants/types/Player";
import { MatchTeam, SerializedMatch } from "@/app/constants/types/Match";
import PlayersCell from "@/app/features/players/components/PlayersCell";
import GoalsColumn from "@/app/features/matches/components/details/GoalsCell";
import PercentageCell from "@/app/features/matches/components/details/PercentageCell";

type TeamColumnProps = {
  team: MatchTeam;
  index: number;
  match: SerializedMatch;
  playersMap: { [key: string]: SerializedPlayer };
  playersWithStats?: PlayerWithStats[];
  playersWithStatsUntilMatchNumber?: PlayerWithStats[];
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
  onPercentageCalculated?: (team: MatchTeam, percentage: number) => void;
  showOnlyMatchPercentage?: boolean;
  columnVisibility?: {
    goals: boolean;
    percentage: boolean;
  };
};

export default function TeamColumn({
  team,
  index,
  match,
  playersMap,
  playersWithStats,
  playersWithStatsUntilMatchNumber,
  isEditable = false,
  onUpdatePlayerGoals,
  onUpdatePlayer,
  players = [],
  isPlayerAvailable,
  mostVotedPlayersIds,
  showOnlyMatchPercentage = false,
  columnVisibility = {
    goals: true,
    percentage: true,
  },
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
      className="w-[30%]"
    />
  );

  const percentageColumnComponent = playersWithStats && (
    <PercentageCell
      playerId={match[team].players[index]?._id.toString()}
      playersWithStats={playersWithStats}
      playersWithStatsUntilMatchNumber={playersWithStatsUntilMatchNumber}
      showOnlyMatchPercentage={showOnlyMatchPercentage}
    />
  );

  return (
    <>
      {team === "oscuras" ? (
        <>
          {columnVisibility.goals && goalsColumnComponent}
          {columnVisibility.percentage && percentageColumnComponent}
          {playerColumnComponent}
        </>
      ) : (
        <>
          {playerColumnComponent}
          {columnVisibility.percentage && percentageColumnComponent}
          {columnVisibility.goals && goalsColumnComponent}
        </>
      )}
    </>
  );
}
