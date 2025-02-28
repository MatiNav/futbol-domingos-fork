"use client";

import { useFetchMatchWithStats } from "@/app/hooks/useFetchMatchWithStats";
import { useTournament } from "@/app/contexts/TournamentContext";

type MatchSelectorProps = {
  isLoading: boolean;
};

export default function MatchSelector({ isLoading }: MatchSelectorProps) {
  const { selectedTournamentData } = useTournament();
  const { matchNumber, setMatchNumber } = useFetchMatchWithStats([]);

  const handleNumberClick = (number: number) => {
    setMatchNumber(number);
  };

  const handlePrevious = () => {
    const newNumber = Math.max(1, matchNumber - 1);
    setMatchNumber(newNumber);
  };

  const handleNext = () => {
    if (!selectedTournamentData) {
      return;
    }

    const newNumber = Math.min(
      selectedTournamentData.maxMatchNumber,
      matchNumber + 1
    );
    setMatchNumber(newNumber);
  };

  return (
    <div className="flex flex-col space-y-1">
      {selectedTournamentData?.maxMatchNumber && (
        <>
          {/* Numbers row with horizontal scroll */}
          <div className="flex items-center bg-green-900 p-2 overflow-x-auto">
            <div className="flex items-center justify-start gap-1 flex-wrap">
              {Array.from(
                { length: selectedTournamentData?.maxMatchNumber },
                (_, i) => i + 1
              ).map((number) => (
                <button
                  key={number}
                  onClick={() => handleNumberClick(number)}
                  className={`min-w-[28px] h-7 flex items-center justify-center text-base
                ${
                  number === matchNumber
                    ? "bg-[#018000] text-white"
                    : "bg-green-800 text-green-100 hover:bg-green-700"
                }
                font-normal transition-colors duration-200`}
                >
                  {number}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation section */}
          <div className="flex items-center justify-between bg-green-900 p-3">
            <button
              onClick={handlePrevious}
              disabled={matchNumber === 1 || isLoading}
              className="bg-green-800 p-2 rounded disabled:opacity-50 
                   disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8 text-green-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <span className="text-green-100 text-lg font-medium">
                {selectedTournamentData?.tournament.name}
              </span>
              <span className="text-green-200 text-md">
                Fecha {matchNumber} de {selectedTournamentData.maxMatchNumber}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={
                matchNumber >= selectedTournamentData.maxMatchNumber ||
                isLoading
              }
              className="bg-green-800 p-2 rounded disabled:opacity-50 
                   disabled:cursor-not-allowed hover:bg-green-700 transition-colors duration-200"
            >
              <svg
                className="w-8 h-8 text-green-300"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
