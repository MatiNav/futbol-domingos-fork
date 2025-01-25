"use client";
import { DBMatch } from "@/app/constants/types/db-models/Match";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import { ObjectId } from "mongodb";
import { useState, useEffect } from "react";

export default function EditarEquipos() {
  const [matchNumber, setMatchNumber] = useState("1");
  const [match, setMatch] = useState<DBMatch | null>(null);
  const [maxMatchNumber, setMaxMatchNumber] = useState(1);
  const [players, setPlayers] = useState<DBPlayer[]>([]);
  const [playersMap, setPlayersMap] = useState<{ [key: string]: DBPlayer }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      try {
        const response = await fetch("/api/players");
        const data = await response.json();
        if (response.ok) {
          setPlayers(data.players);
          setPlayersMap(
            data.players.reduce(
              (acc: { [key: string]: DBPlayer }, player: DBPlayer) => {
                acc[player._id.toString()] = player;
                return acc;
              },
              {} as { [key: string]: DBPlayer }
            )
          );
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };

    fetchMaxMatchNumber();
    fetchPlayers();
  }, []);

  const fetchMatch = async (number: string) => {
    setIsLoading(true);
    setError("");
    setMatch(null);
    setSuccessMessage("");

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

  const updatePlayerGoals = (
    team: "oscuras" | "claras",
    index: number,
    goals: number
  ) => {
    if (!match) return;

    setMatch((prevMatch) => {
      if (prevMatch == null) return null;

      return {
        ...prevMatch,
        [team]: {
          ...prevMatch[team],
          players: prevMatch[team].players.map((player, i) =>
            i === index ? { ...player, goals } : player
          ),
        },
      };
    });
  };

  const updatePlayer = (
    team: "oscuras" | "claras",
    index: number
    // playerId: ObjectId
  ) => {
    if (!match) return;

    const updatedMatch = {
      ...match,
      [team]: match[team].players.map((player, i) =>
        i === index ? { _id: player._id, goals: player.goals } : player
      ),
    };

    setMatch(updatedMatch);
  };

  const saveChanges = async () => {
    if (!match) return;

    setIsSaving(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/matches/${match.matchNumber}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oscuras: { team: "oscuras", players: match.oscuras.players },
          claras: { team: "claras", players: match.claras.players },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al guardar los cambios");
      }

      setSuccessMessage("Cambios guardados exitosamente");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al guardar los cambios"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const isPlayerAvailable = (
    playerId: ObjectId,
    team: "oscuras" | "claras",
    currentIndex: number
  ) => {
    if (!match) return false;

    const isInOscuras = match.oscuras.players.some(
      (p, i) =>
        p._id === playerId && i !== (team === "oscuras" ? currentIndex : -1)
    );
    const isInClaras = match.claras.players.some(
      (p, i) =>
        p._id === playerId && i !== (team === "claras" ? currentIndex : -1)
    );

    return !isInOscuras && !isInClaras;
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

          {successMessage && (
            <div className="text-center p-4 bg-green-100 text-green-700 rounded-lg mb-6">
              {successMessage}
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
                        match.oscuras.players?.length || 0,
                        match.claras.players?.length || 0
                      ),
                    }).map((_, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 text-center text-black">
                          <input
                            type="number"
                            min="0"
                            value={match.oscuras.players[index]?.goals || 0}
                            onChange={(e) =>
                              updatePlayerGoals(
                                "oscuras",
                                index,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 px-2 py-1 text-center border rounded-lg"
                          />
                        </td>
                        <td className="px-4 py-3 text-center bg-red-300">
                          <select
                            value={
                              match.oscuras.players[index]?._id.toString() || ""
                            }
                            onChange={(e) => {
                              const playerId = players.find(
                                (player) => player.name === e.target.value
                              )?._id;
                              if (playerId) {
                                // updatePlayer("oscuras", index, playerId);
                                updatePlayer("oscuras", index);
                              }
                            }}
                            className="w-[115px] px-2 py-1 bg-transparent border border-red-400 rounded-lg"
                          >
                            <option value="">
                              {playersMap[
                                match.oscuras.players[index]?._id.toString()
                              ]?.name || "Seleccionar jugador"}
                            </option>
                            {players.map((player) => {
                              const isAvailable = isPlayerAvailable(
                                player._id,
                                "oscuras",
                                index
                              );
                              return (
                                <option
                                  key={player._id.toString()}
                                  value={player.name}
                                  disabled={!isAvailable}
                                  className={`${
                                    isAvailable
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                  style={{
                                    color: isAvailable ? "#16a34a" : "#dc2626",
                                    backgroundColor: "white",
                                  }}
                                >
                                  {player.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center bg-blue-300">
                          <select
                            value={
                              match.claras.players[index]?._id.toString() || ""
                            }
                            onChange={(e) => {
                              const playerId = players.find(
                                (player) => player.name === e.target.value
                              )?._id;
                              if (playerId) {
                                // updatePlayer("claras", index, playerId);
                                updatePlayer("claras", index);
                              }
                            }}
                            className="w-[115px] px-2 py-1 bg-transparent border border-blue-400 rounded-lg"
                          >
                            <option value="">
                              {playersMap[
                                match.claras.players[index]?._id.toString()
                              ]?.name || "Seleccionar jugador"}
                            </option>
                            {players.map((player) => {
                              const isAvailable = isPlayerAvailable(
                                player._id,
                                "claras",
                                index
                              );
                              return (
                                <option
                                  key={player._id.toString()}
                                  value={player.name}
                                  disabled={!isAvailable}
                                  className={`${
                                    isAvailable
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }`}
                                  style={{
                                    color: isAvailable ? "#16a34a" : "#dc2626",
                                    backgroundColor: "white",
                                  }}
                                >
                                  {player.name}
                                </option>
                              );
                            })}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-center text-black">
                          <input
                            type="number"
                            min="0"
                            value={match.claras.players[index]?.goals || 0}
                            onChange={(e) =>
                              updatePlayerGoals(
                                "claras",
                                index,
                                parseInt(e.target.value) || 0
                              )
                            }
                            className="w-16 px-2 py-1 text-center border rounded-lg"
                          />
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

              <div className="flex justify-center">
                <button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 
                           text-white font-semibold rounded-lg
                           hover:from-blue-600 hover:to-blue-700
                           transform hover:scale-105 transition-all duration-200
                           shadow-md hover:shadow-lg
                           disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center space-x-2"
                >
                  {isSaving ? (
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
                      <span>Guardar Cambios</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
