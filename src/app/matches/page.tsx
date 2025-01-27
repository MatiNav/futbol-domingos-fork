"use client";
import { useState, useEffect } from "react";
import { DBMatch } from "@/app/constants/types/db-models/Match";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import MatchSelector from "../components/MatchSelector";

export default function Matches() {
  const [match, setMatch] = useState<DBMatch | null>(null);
  const [playersMap, setPlayersMap] = useState<{ [key: string]: DBPlayer }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <MatchSelector onMatchSelect={fetchMatch} isLoading={isLoading} />

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
                      <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm w-1/4 text-center bg-blue-300">
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
                        <td className="px-4 py-3 text-center bg-blue-300">
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
                      <td className="px-4 py-3 text-center bg-blue-300 text-xl font-semibold whitespace-nowrap w-1/2">
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
