"use client";
import { useState, useEffect } from "react";
import { DBMatch } from "@/app/constants/types/db-models/Match";
import { DBPlayer } from "@/app/constants/types/db-models/Player";

export default function Matches() {
  const [matchNumber, setMatchNumber] = useState("1");
  const [match, setMatch] = useState<DBMatch | null>(null);
  const [playersMap, setPlayersMap] = useState<{ [key: string]: DBPlayer }>({});
  const [maxMatchNumber, setMaxMatchNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch max match number on component mount
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

    const fetchPlayers = async () => {
      const response = await fetch("/api/players");
      const data = await response.json();
      setPlayersMap(
        data.players.reduce(
          (acc: { [key: string]: DBPlayer }, player: DBPlayer) => {
            acc[player._id.toString()] = player;
            return acc;
          },
          {} as { [key: string]: DBPlayer }
        )
      );
    };

    fetchMaxMatchNumber();
    fetchPlayers();
  }, []);

  const fetchMatch = async (number: string) => {
    setIsLoading(true);
    setError("");
    setMatch(null);

    try {
      const response = await fetch(`/api/matches/${number}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al buscar el partido");
      }

      if (data.match) {
        setMatch(data.match);
      } else {
        setError("Partido no encontrado");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al buscar el partido"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMatch(matchNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
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

          {error && (
            <div className="text-center p-4 bg-red-100 text-red-700 rounded-lg mb-6">
              {error}
            </div>
          )}

          {match && (
            <>
              <div className="overflow-x-auto mb-6">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center">
                        Goles
                      </th>
                      <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-red-300">
                        Oscuras
                      </th>
                      <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-cyan-300">
                        Claras
                      </th>
                      <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center">
                        Goles
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({
                      length: Math.max(
                        match.oscuras.players.length,
                        match.claras.players.length
                      ),
                    }).map((_, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-center text-black">
                          {match.oscuras.players[index]?.goals || 0}
                        </td>
                        <td className="px-4 py-3 text-center bg-red-300">
                          {/* TODO: show the name instead of the id */}
                          {playersMap[
                            match.oscuras.players[index]?._id.toString()
                          ]?.name || ""}
                        </td>
                        <td className="px-4 py-3 text-center bg-cyan-300">
                          {/* TODO: show the name instead of the id */}
                          {playersMap[
                            match.claras.players[index]?._id.toString()
                          ]?.name || ""}
                        </td>
                        <td className="px-4 py-3 text-center text-black">
                          {match.claras.players[index]?.goals || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                      <th
                        colSpan={2}
                        className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-lg text-center"
                      >
                        Resultado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t hover:bg-gray-50">
                      <td className="px-4 py-3 text-center bg-red-300 text-xl font-semibold whitespace-nowrap w-1/2">
                        {match.oscuras.players.reduce(
                          (sum, player) => sum + (player.goals || 0),
                          0
                        )}
                      </td>
                      <td className="px-4 py-3 text-center bg-cyan-300 text-xl font-semibold whitespace-nowrap w-1/2">
                        {match.claras.players.reduce(
                          (sum, player) => sum + (player.goals || 0),
                          0
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
