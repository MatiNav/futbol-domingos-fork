import { TeamColumn } from "@/app/features/matches/components/details";
import { getMostVotedPlayersOfTheMatch } from "@/app/features/players/utils";
import { useState } from "react";
import { MatchConfiguration } from "./MatchConfiguration";
import { useDraftMatch } from "@/app/contexts/DraftMatchContext";
import { useMatchWithStats } from "@/app/contexts/MatchWithStatsContext";

type MatchDetailsTableProps = {
  isEditable?: boolean;
  showOnlyMatchPercentage?: boolean;
  onShowOnlyMatchPercentageChange?: (showOnlyMatchPercentage: boolean) => void;
};

export default function MatchDetailsTable({
  isEditable = false,
  showOnlyMatchPercentage = false,
  onShowOnlyMatchPercentageChange,
}: MatchDetailsTableProps) {
  const { draftMatch, removeLastPlayer, addNewPlayer } = useDraftMatch();
  const {
    playersWithStats,
    currentTeamPercentages,
    untilMatchTeamPercentages,
  } = useMatchWithStats();

  const [columnVisibility, setColumnVisibility] = useState({
    goals: true,
    percentage: true,
  });

  const mostVotedPlayersIds = draftMatch
    ? getMostVotedPlayersOfTheMatch(draftMatch)
    : [];

  return (
    <div>
      <div className="flex justify-start mb-2 sm:mb-4 mt-2 sm:mt-4">
        {draftMatch && (
          <MatchConfiguration
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            showOnlyMatchPercentage={showOnlyMatchPercentage}
            onShowOnlyMatchPercentageChange={onShowOnlyMatchPercentageChange}
            matchNumber={draftMatch.matchNumber}
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
            {draftMatch &&
              Array.from({
                length: Math.max(
                  draftMatch.oscuras.players.length,
                  draftMatch.claras.players.length
                ),
              }).map((_, index) => {
                const isLastRow =
                  index ===
                  Math.max(
                    draftMatch.oscuras.players.length,
                    draftMatch.claras.players.length
                  ) -
                    1;

                return (
                  <tr key={index} className="border-t border-green-700">
                    <TeamColumn
                      team="oscuras"
                      index={index}
                      isEditable={isEditable}
                      mostVotedPlayersIds={mostVotedPlayersIds}
                      showOnlyMatchPercentage={showOnlyMatchPercentage}
                      columnVisibility={columnVisibility}
                    />
                    <TeamColumn
                      team="claras"
                      index={index}
                      isEditable={isEditable}
                      mostVotedPlayersIds={mostVotedPlayersIds}
                      showOnlyMatchPercentage={showOnlyMatchPercentage}
                      columnVisibility={columnVisibility}
                    />

                    {isLastRow && isEditable && (
                      <td className="px-2 py-2 text-center">
                        <button
                          onClick={removeLastPlayer}
                          className="p-1 bg-red-500 hover:bg-red-700 text-white rounded-full"
                          title="Eliminar última fila"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      {isEditable && (
        <div className="flex justify-center mb-4 mt-4">
          <button
            onClick={addNewPlayer}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            <span>Agregar Jugador</span>
          </button>
        </div>
      )}
    </div>
  );
}
