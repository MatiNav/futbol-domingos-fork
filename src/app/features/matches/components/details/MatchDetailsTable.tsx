import {
  MatchTeam,
  PlayerWithStats,
  SerializedMatch,
  SerializedPlayer,
} from "@/app/constants/types";
import { TeamColumn } from "@/app/features/matches/components/details";
import { getMostVotedPlayersOfTheMatch } from "@/app/features/players/utils";
import { useState } from "react";
import { MatchConfiguration } from "./MAtchConfiguration";
import { TeamPercentage } from "@/app/contexts/MatchWithStatsContext";

type MatchDetailsTableProps = {
  match: SerializedMatch;
  playersMap: { [key: string]: SerializedPlayer };
  playersWithStats?: PlayerWithStats[];
  isEditable?: boolean;
  onUpdatePlayerGoals?: (team: MatchTeam, index: number, goals: number) => void;
  onUpdatePlayer?: (team: MatchTeam, index: number, playerId: string) => void;
  players?: SerializedPlayer[];
  isPlayerAvailable?: (
    playerId: string,
    team: MatchTeam,
    currentIndex: number
  ) => boolean;
  currentTeamPercentages: TeamPercentage;
  untilMatchTeamPercentages: TeamPercentage;
  playersWithStatsUntilMatchNumber: PlayerWithStats[];
  showOnlyMatchPercentage?: boolean;
  onShowOnlyMatchPercentageChange?: (showOnlyMatchPercentage: boolean) => void;
};

export default function MatchDetailsTable({
  match,
  playersMap,
  playersWithStats,
  isEditable = false,
  onUpdatePlayerGoals,
  onUpdatePlayer,
  players = [],
  isPlayerAvailable,
  currentTeamPercentages,
  untilMatchTeamPercentages,
  playersWithStatsUntilMatchNumber,
  showOnlyMatchPercentage = false,
  onShowOnlyMatchPercentageChange,
}: MatchDetailsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({
    goals: true,
    percentage: true,
  });

  const mostVotedPlayersIds = match ? getMostVotedPlayersOfTheMatch(match) : [];

  return (
    <div>
      <div className="flex justify-start mb-2 sm:mb-4 mt-2 sm:mt-4">
        {match && (
          <MatchConfiguration
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            showOnlyMatchPercentage={showOnlyMatchPercentage}
            onShowOnlyMatchPercentageChange={onShowOnlyMatchPercentageChange}
            matchNumber={match.matchNumber}
          />
        )}
      </div>
      <div className="overflow-x-auto mb-3 sm:mb-6">
        <table className="min-w-full bg-[#1a472a] table-fixed">
          <thead>
            <tr>
              {columnVisibility.goals && (
                <th className="px-2 sm:px-4 py-1 sm:py-2 text-white font-bold uppercase tracking-wider text-sm w-[10%] text-center border-r border-green-700">
                  Goles
                </th>
              )}

              {columnVisibility.percentage &&
                playersWithStats &&
                currentTeamPercentages &&
                untilMatchTeamPercentages && (
                  <th className="px-2 sm:px-4 py-1 sm:py-2 text-white font-bold uppercase tracking-wider text-sm w-[10%] text-center border-r border-green-700">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <div className="text-base sm:text-lg font-bold">
                        <div className="text-yellow-400">
                          {showOnlyMatchPercentage ? (
                            <span>
                              {(
                                untilMatchTeamPercentages.oscuras.percentage /
                                untilMatchTeamPercentages.claras
                                  .amountOfPlayersWithout0Percentage
                              ).toFixed(1)}
                              %
                            </span>
                          ) : (
                            <span>
                              {(
                                currentTeamPercentages.oscuras.percentage /
                                currentTeamPercentages.claras
                                  .amountOfPlayersWithout0Percentage
                              ).toFixed(1)}
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                )}
              <th className="px-2 sm:px-4 py-1 sm:py-2 text-white font-bold uppercase tracking-wider text-sm w-[30%] text-center bg-gray-600 border-r border-green-700">
                Oscuras
              </th>
              <th className="px-2 sm:px-4 py-1 sm:py-2 text-gray-600 font-bold uppercase tracking-wider text-sm w-[30%] text-center bg-white border-r border-green-700">
                Claras
              </th>

              {columnVisibility.percentage &&
                playersWithStats &&
                currentTeamPercentages &&
                untilMatchTeamPercentages && (
                  <th className="px-2 sm:px-4 py-1 sm:py-2 text-white font-bold uppercase tracking-wider text-sm w-[10%] text-center border-r border-green-700">
                    <div className="flex flex-col gap-1 sm:gap-2">
                      <div className="text-base sm:text-lg font-bold">
                        <div className="text-yellow-400">
                          {showOnlyMatchPercentage ? (
                            <span>
                              {(
                                untilMatchTeamPercentages.claras.percentage /
                                untilMatchTeamPercentages.claras
                                  .amountOfPlayersWithout0Percentage
                              ).toFixed(1)}
                              %
                            </span>
                          ) : (
                            <span>
                              {(
                                currentTeamPercentages.claras.percentage /
                                currentTeamPercentages.claras
                                  .amountOfPlayersWithout0Percentage
                              ).toFixed(1)}
                              %
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                )}
              {columnVisibility.goals && (
                <th className="px-2 sm:px-4 py-1 sm:py-2 text-white font-bold uppercase tracking-wider text-sm w-[10%] text-center">
                  Goles
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {match &&
              Array.from({
                length: Math.max(
                  match.oscuras.players.length,
                  match.claras.players.length
                ),
              }).map((_, index) => (
                <tr key={index} className="border-t border-green-700">
                  <TeamColumn
                    team="oscuras"
                    index={index}
                    match={match}
                    playersMap={playersMap}
                    isEditable={isEditable}
                    onUpdatePlayerGoals={onUpdatePlayerGoals}
                    onUpdatePlayer={onUpdatePlayer}
                    players={players}
                    playersWithStats={playersWithStats}
                    isPlayerAvailable={isPlayerAvailable}
                    mostVotedPlayersIds={mostVotedPlayersIds}
                    playersWithStatsUntilMatchNumber={
                      playersWithStatsUntilMatchNumber
                    }
                    showOnlyMatchPercentage={showOnlyMatchPercentage}
                    columnVisibility={columnVisibility}
                  />
                  <TeamColumn
                    team="claras"
                    index={index}
                    match={match}
                    playersMap={playersMap}
                    isEditable={isEditable}
                    onUpdatePlayerGoals={onUpdatePlayerGoals}
                    onUpdatePlayer={onUpdatePlayer}
                    players={players}
                    playersWithStats={playersWithStats}
                    isPlayerAvailable={isPlayerAvailable}
                    mostVotedPlayersIds={mostVotedPlayersIds}
                    playersWithStatsUntilMatchNumber={
                      playersWithStatsUntilMatchNumber
                    }
                    showOnlyMatchPercentage={showOnlyMatchPercentage}
                    columnVisibility={columnVisibility}
                  />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
