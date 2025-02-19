"use client";

import MatchSelector from "./MatchSelector";
import MatchResultTable from "./details/MatchResult";
import MatchDetailsTable from "./details/MatchDetailsTable";
import PlayerOfTheMatch from "@/app/features/players/components/PlayerOfTheMatch";
import MatchOpinions from "./MatchOpinions";
import { PlayersResponse } from "@/app/features/players/utils/server";
import {
  UserProfileWithPlayerId,
  PlayerWithStats,
} from "@/app/constants/types";
import { useFetchMatchWithStats } from "@/app/hooks/useFetchMatchWithStats";
import { useState } from "react";
import { useTournament } from "@/app/contexts/TournamentContext";
export default function Matches({
  user,
  players: { playersMap, players },
  maxMatchNumber,
  playersWithStats,
}: {
  user: UserProfileWithPlayerId | null;
  players: PlayersResponse;
  maxMatchNumber: number;
  playersWithStats: PlayerWithStats[];
}) {
  const [showOnlyMatchPercentage, setShowOnlyMatchPercentage] = useState(false);
  const { selectedTournament } = useTournament();
  const {
    fetchMatch,
    matchNumber,
    playersWithStatsUntilMatchNumber,
    setMatchNumber,
    match,
    currentTeamPercentages,
    untilMatchTeamPercentages,
    isLoading,
    error,
  } = useFetchMatchWithStats(playersWithStats, maxMatchNumber);

  const onVoteSubmitted = () => {
    fetchMatch(matchNumber.toString());
  };

  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-7xl mx-auto bg-[#77777736] rounded-lg shadow-lg p-6">
        <MatchSelector
          onMatchSelect={setMatchNumber}
          isLoading={isLoading}
          maxMatchNumber={maxMatchNumber}
        />

        {error && (
          <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg mb-6">
            {error}
          </div>
        )}

        {match && (
          <>
            <MatchDetailsTable
              match={match}
              playersMap={playersMap}
              players={players}
              playersWithStats={playersWithStats}
              teamPercentages={currentTeamPercentages}
              untilMatchTeamPercentages={untilMatchTeamPercentages}
              playersWithStatsUntilMatchNumber={
                playersWithStatsUntilMatchNumber
              }
              showOnlyMatchPercentage={showOnlyMatchPercentage}
              onShowOnlyMatchPercentageChange={setShowOnlyMatchPercentage}
            />

            <MatchResultTable match={match} />

            {match.matchNumber >= 5 && (
              <>
                <PlayerOfTheMatch
                  match={match}
                  playersMap={playersMap}
                  isLatestMatch={match.matchNumber === maxMatchNumber}
                  onVoteSubmitted={onVoteSubmitted}
                  user={user}
                />
                <MatchOpinions
                  match={match}
                  isLatestMatch={match.matchNumber === maxMatchNumber}
                  hasUserPlayedMatch={[match.oscuras, match.claras].some(
                    (team) =>
                      team.players.some(
                        (player) =>
                          player._id.toString() === user?.playerId.toString()
                      )
                  )}
                  // TODO: Add onOpinionSubmitted
                  onOpinionSubmitted={onVoteSubmitted}
                  user={user}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
