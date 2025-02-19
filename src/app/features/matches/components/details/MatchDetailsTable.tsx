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
  teamPercentages?: { oscuras: number; claras: number };
  untilMatchTeamPercentages?: { oscuras: number; claras: number };
  playersWithStatsUntilMatchNumber?: PlayerWithStats[];
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
  teamPercentages,
  untilMatchTeamPercentages,
  playersWithStatsUntilMatchNumber,
  showOnlyMatchPercentage = false,
  onShowOnlyMatchPercentageChange,
}: MatchDetailsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState({
    goals: true,
    percentage: true,
  });
  const mostVotedPlayersIds = getMostVotedPlayersOfTheMatch(match);

  return (
    <div>
      <div className="flex justify-start mb-4 mt-4">
        <MatchConfiguration
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          showOnlyMatchPercentage={showOnlyMatchPercentage}
          onShowOnlyMatchPercentageChange={onShowOnlyMatchPercentageChange}
          matchNumber={match.matchNumber}
        />
      </div>
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-[#1a472a]">
          <thead>
            <tr>
              {columnVisibility.goals && (
                <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/6 text-center border-r border-green-700">
                  Goles
                </th>
              )}

              {columnVisibility.percentage &&
                playersWithStats &&
                teamPercentages &&
                untilMatchTeamPercentages && (
                  <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/6 text-center border-r border-green-700">
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-bold">
                        <div className="text-yellow-400">
                          {showOnlyMatchPercentage ? (
                            <span>
                              {(untilMatchTeamPercentages.oscuras / 8).toFixed(
                                1
                              )}
                              %
                            </span>
                          ) : (
                            <span>
                              {(teamPercentages.oscuras / 8).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                )}
              <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/6 text-center bg-gray-600 border-r border-green-700">
                Oscuras
              </th>
              <th className="px-4 py-2 text-gray-600 font-bold uppercase tracking-wider text-sm w-1/6 text-center bg-white border-r border-green-700">
                Claras
              </th>

              {columnVisibility.percentage &&
                playersWithStats &&
                teamPercentages &&
                untilMatchTeamPercentages && (
                  <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/6 text-center border-r border-green-700">
                    <div className="flex flex-col gap-2">
                      <div className="text-lg font-bold">
                        <div className="text-yellow-400">
                          {showOnlyMatchPercentage ? (
                            <span>
                              {(untilMatchTeamPercentages.claras / 8).toFixed(
                                1
                              )}
                              %
                            </span>
                          ) : (
                            <span>
                              {(teamPercentages.claras / 8).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </th>
                )}
              {columnVisibility.goals && (
                <th className="px-4 py-2 text-white font-bold uppercase tracking-wider text-sm w-1/6 text-center">
                  Goles
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {Array.from({
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
