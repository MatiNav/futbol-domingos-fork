"use client";
import { useState, useEffect } from "react";

interface Player {
  _id: string;
  name: string;
  image: string;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
}

export default function ArmarEquipos() {
  const [team1, setTeam1] = useState<(Player | null)[]>([]);
  const [team2, setTeam2] = useState<(Player | null)[]>([]);
  const [searchTerms, setSearchTerms] = useState<{
    [key: number]: { team1: string; team2: string };
  }>(
    Array(8)
      .fill(null)
      .reduce(
        (acc, _, index) => ({ ...acc, [index]: { team1: "", team2: "" } }),
        {}
      )
  );
  const [players, setPlayers] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  //TODO: message should be an object with type and message
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await fetch("/api/players");
        const data = await response.json();
        if (response.ok) {
          setPlayers(data);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchPlayers();
  }, []);

  const handlePlayerSelect = (
    player: Player,
    team: "team1" | "team2",
    index: number
  ) => {
    if (team === "team1") {
      const newTeam1 = [...team1];
      newTeam1[index] = player;
      setTeam1(newTeam1);
      setSearchTerms((prev) => ({
        ...prev,
        [index]: { ...prev[index], team1: player.name },
      }));
    } else {
      const newTeam2 = [...team2];
      newTeam2[index] = player;
      setTeam2(newTeam2);
      setSearchTerms((prev) => ({
        ...prev,
        [index]: { ...prev[index], team2: player.name },
      }));
    }
  };

  const clearSelection = (index: number, team: "team1" | "team2") => {
    if (team === "team1") {
      const newTeam1 = [...team1];
      newTeam1[index] = null;
      setTeam1(newTeam1);
    } else {
      const newTeam2 = [...team2];
      newTeam2[index] = null;
      setTeam2(newTeam2);
    }
  };

  const getFilteredPlayers = (
    searchTerm: string,
    index: number,
    team: "team1" | "team2"
  ) => {
    // const otherTeam = team === "team1" ? team2 : team1;
    return players
      .filter(
        (player) =>
          player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !team1.some((p) => p?._id === player._id) &&
          !team2.some((p) => p?._id === player._id)
      )
      .map((player) => player);
  };

  const handleSaveTeams = async () => {
    if (team1.length === 0 || team2.length === 0) {
      setMessage("Por favor, selecciona jugadores para ambos equipos");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oscuras: {
            team: "oscuras",
            players: team1.map((player) => ({
              _id: player?._id,
              goals: 0,
            })),
          },
          claras: {
            team: "claras",
            players: team2.map((player) => ({
              _id: player?._id,
              goals: 0,
            })),
          },
          date: new Date(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar los equipos");
      }

      setMessage("Equipos guardados exitosamente");
      setTeam1([]);
      setTeam2([]);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Error al guardar los equipos"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Armar Equipos</h2>
        {message && (
          <div
            className={`p-4 rounded-lg mb-6 ${
              message.includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 border-b-2 border-gray-300">
                <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                  Oscuras
                </th>
                <th className="px-4 py-3 text-gray-800 font-bold uppercase tracking-wider text-sm">
                  Claras
                </th>
              </tr>
            </thead>
            <tbody>
              {Array(8)
                .fill(null)
                .map((_, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-2 bg-red-800">
                      <div className="relative">
                        <input
                          type="text"
                          value={team1[index]?.name || searchTerms[index].team1}
                          onChange={(e) => {
                            setSearchTerms((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                team1: e.target.value,
                              },
                            }));
                          }}
                          className="w-full p-2.5 text-white bg-red-800 border-2 border-red-400 rounded-lg shadow-sm 
                          focus:border-red-300 focus:ring-2 focus:ring-red-300 
                          appearance-none cursor-pointer hover:bg-red-900 transition-colors pr-10
                          placeholder-red-300"
                          placeholder="Jugador"
                        />
                        {(team1[index] || searchTerms[index].team1) && (
                          <button
                            onClick={() => {
                              clearSelection(index, "team1");
                              setSearchTerms((prev) => ({
                                ...prev,
                                [index]: { ...prev[index], team1: "" },
                              }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-red-300 hover:text-white transition-colors"
                          >
                            ✕
                          </button>
                        )}
                        {searchTerms[index].team1 && !team1[index] && (
                          <div className="absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto bg-red-700 border-2 border-red-400">
                            {getFilteredPlayers(
                              searchTerms[index].team1,
                              index,
                              "team1"
                            ).map((player) => (
                              <div
                                key={player._id}
                                className="px-4 py-2 hover:bg-red-600 cursor-pointer text-white border-b border-red-600 last:border-b-0"
                                onClick={() =>
                                  handlePlayerSelect(player, "team1", index)
                                }
                              >
                                {player.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 bg-blue-100">
                      <div className="relative">
                        <input
                          type="text"
                          value={team2[index]?.name || searchTerms[index].team2}
                          onChange={(e) => {
                            setSearchTerms((prev) => ({
                              ...prev,
                              [index]: {
                                ...prev[index],
                                team2: e.target.value,
                              },
                            }));
                          }}
                          className="w-full p-2.5 text-gray-800 bg-blue-100 border-2 border-blue-400 rounded-lg shadow-sm 
                          focus:border-blue-500 focus:ring-2 focus:ring-blue-400 
                          appearance-none cursor-pointer hover:bg-blue-200 transition-colors pr-10
                          placeholder-blue-400"
                          placeholder="Jugador"
                        />
                        {(team2[index] || searchTerms[index].team2) && (
                          <button
                            onClick={() => {
                              clearSelection(index, "team2");
                              setSearchTerms((prev) => ({
                                ...prev,
                                [index]: { ...prev[index], team2: "" },
                              }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition-colors"
                          >
                            ✕
                          </button>
                        )}
                        {searchTerms[index].team2 && !team2[index] && (
                          <div className="absolute z-10 w-full mt-1 rounded-lg shadow-lg max-h-48 overflow-y-auto bg-white border-2 border-blue-400">
                            {getFilteredPlayers(
                              searchTerms[index].team2,
                              index,
                              "team2"
                            ).map((player) => (
                              <div
                                key={player._id}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800 border-b border-blue-200 last:border-b-0"
                                onClick={() =>
                                  handlePlayerSelect(player, "team2", index)
                                }
                              >
                                {player.name}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSaveTeams}
            disabled={isLoading}
            className={`
              px-6 py-3 rounded-lg text-white font-semibold
              bg-gradient-to-r from-green-500 to-green-600
              hover:from-green-600 hover:to-green-700
              transform hover:scale-105 transition-all duration-200
              shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              flex items-center gap-2
            `}
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
                <span>Guardando...</span>
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Guardar Equipos</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
