"use client";
import MatchDetailsTable from "@/app/components/Table/MatchDetailsTable";
import MatchResultTable from "@/app/components/MatchResult";
import MatchSelector from "@/app/components/MatchSelector";
import { DBMatch } from "@/app/constants/types";
import { ObjectId } from "mongodb";
import { useState } from "react";
import { useMaxMatchNumber } from "@/app/hooks/useMaxMatchNumber";
import { useFetchPlayers } from "@/app/hooks/useFetchPlayers";

export default function EditarEquipos() {
  const [match, setMatch] = useState<DBMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { maxMatchNumber } = useMaxMatchNumber();
  const { players, playersMap } = useFetchPlayers();

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
    index: number,
    playerId: ObjectId
  ) => {
    if (!match) return;

    const newPlayer = players.find((player) => player._id === playerId);

    const updatedMatch = {
      ...match,
      [team]: {
        team,
        players: match[team].players.map((player, i) =>
          i === index && !!newPlayer
            ? { _id: newPlayer._id, goals: player.goals }
            : player
        ),
      },
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
    <div className="min-h-screen bg-[#0B2818] py-8">
      <div className="max-w-7xl mx-auto px-4 ">
        <div className="bg-[#77777736] rounded-lg shadow-lg p-6">
          <MatchSelector
            onMatchSelect={fetchMatch}
            isLoading={isLoading}
            maxMatchNumber={maxMatchNumber}
          />

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
              <MatchDetailsTable
                match={match}
                playersMap={playersMap}
                onUpdatePlayerGoals={updatePlayerGoals}
                isPlayerAvailable={isPlayerAvailable}
                onUpdatePlayer={updatePlayer}
                isEditable
              />

              <MatchResultTable match={match} />

              <div className="flex justify-center">
                <button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className={`
                    px-6 py-3 
                    bg-[#1a472a] hover:bg-[#143620]
                    text-white font-semibold rounded-lg
                    shadow-md flex items-center space-x-2
                    border border-green-700
                    ${
                      !isSaving
                        ? "transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
                        : "opacity-50 cursor-not-allowed"
                    }
                  `}
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
