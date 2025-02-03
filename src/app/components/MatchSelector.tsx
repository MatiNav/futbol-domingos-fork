import { useState, useEffect } from "react";

type MatchSelectorProps = {
  onMatchSelect: (matchNumber: string) => void;
  isLoading: boolean;
  maxMatchNumber: number;
};

export default function MatchSelector({
  onMatchSelect,
  isLoading,
  maxMatchNumber,
}: MatchSelectorProps) {
  const [matchNumber, setMatchNumber] = useState(maxMatchNumber);

  useEffect(() => {
    setMatchNumber(maxMatchNumber);
  }, [maxMatchNumber]);

  const handleNumberClick = (number: number) => {
    setMatchNumber(number);
    onMatchSelect(number.toString());
  };

  const handlePrevious = () => {
    const newNumber = Math.max(1, matchNumber - 1);
    setMatchNumber(newNumber);
    onMatchSelect(newNumber.toString());
  };

  const handleNext = () => {
    const newNumber = Math.min(maxMatchNumber, matchNumber + 1);
    setMatchNumber(newNumber);
    onMatchSelect(newNumber.toString());
  };

  return (
    <div className="flex flex-col space-y-1">
      {/* Numbers row */}
      <div className="flex items-center justify-start space-x-2 bg-green-900 p-2">
        {Array.from({ length: maxMatchNumber }, (_, i) => i + 1).map(
          (number) => (
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
          )
        )}
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
            Torneo Clausura 2025
          </span>
          <span className="text-green-200 text-md">Fecha {matchNumber}</span>
        </div>

        <button
          onClick={handleNext}
          disabled={matchNumber >= maxMatchNumber || isLoading}
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
    </div>
  );
}
