import { useState, useEffect } from "react";

type MatchSelectorProps = {
  onMatchSelect: (matchNumber: string) => void;
  isLoading: boolean;
};

export default function MatchSelector({
  onMatchSelect,
  isLoading,
}: MatchSelectorProps) {
  const [matchNumber, setMatchNumber] = useState("1");
  const [maxMatchNumber, setMaxMatchNumber] = useState(1);

  useEffect(() => {
    const fetchMaxMatchNumber = async () => {
      try {
        const response = await fetch("/api/matches/latest");
        const data = await response.json();
        if (response.ok && data.maxMatchNumber) {
          setMaxMatchNumber(data.maxMatchNumber);
        }
      } catch (error) {
        console.error("Error fetching max match number:", error);
      }
    };

    fetchMaxMatchNumber();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onMatchSelect(matchNumber);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center space-y-4 mb-8"
    >
      <label className="text-lg font-semibold text-gray-700">
        Seleccionar Partido
      </label>
      <div className="flex items-center space-x-4">
        <div className="relative flex items-center">
          <input
            type="number"
            min="1"
            max={maxMatchNumber}
            value={matchNumber}
            onChange={(e) => setMatchNumber(e.target.value)}
            className="w-24 px-4 py-3 text-center text-lg font-semibold text-gray-700 
                     border-2 border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-green-500 focus:border-transparent
                     transition-all duration-200"
          />
          <span className="ml-2 text-lg font-semibold text-gray-600">
            de {maxMatchNumber}
          </span>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 
                   text-white font-semibold rounded-lg
                   hover:from-green-600 hover:to-green-700
                   transform hover:scale-105 transition-all duration-200
                   shadow-md hover:shadow-lg
                   disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Buscando...</span>
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>Buscar</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
