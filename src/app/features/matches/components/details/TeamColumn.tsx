import { MatchTeam } from "@/app/constants/types/Match";
import PlayersCell from "@/app/features/players/components/PlayersCell";
import GoalsColumn from "@/app/features/matches/components/details/GoalsCell";
import PercentageCell from "@/app/features/matches/components/details/PercentageCell";
import { useDraftMatch } from "@/app/contexts/DraftMatchContext";
import { useMatchWithStats } from "@/app/contexts/MatchWithStatsContext";

type TeamColumnProps = {
  team: MatchTeam;
  index: number;
  isEditable?: boolean;
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
  isEditable = false,
  mostVotedPlayersIds,
  showOnlyMatchPercentage = false,
  columnVisibility = {
    goals: true,
    percentage: true,
  },
}: TeamColumnProps) {
  const { playersWithStats, playersWithStatsUntilMatchNumber } =
    useMatchWithStats();
  const { draftMatch } = useDraftMatch();

  const goalsColumnComponent = (
    <GoalsColumn team={team} index={index} isEditable={isEditable} />
  );

  const playerColumnComponent = (
    <PlayersCell
      mostVotedPlayersIds={mostVotedPlayersIds}
      team={team}
      index={index}
      isEditable={isEditable}
      className="w-[30%]"
    />
  );

  const percentageColumnComponent = playersWithStats && draftMatch && (
    <PercentageCell
      playerId={draftMatch[team].players[index]?._id.toString()}
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
