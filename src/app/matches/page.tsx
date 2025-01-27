"use client";
import { useState, useEffect } from "react";
import { DBMatch } from "@/app/constants/types/db-models/Match";
import { DBPlayer } from "@/app/constants/types/db-models/Player";
import MatchSelector from "../components/MatchSelector";
import MatchResultTable from "../components/MatchResult";
import MatchDetailsTable from "../components/Table/MatchDetailsTable";

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
              <MatchDetailsTable match={match} playersMap={playersMap} />

              <MatchResultTable match={match} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
