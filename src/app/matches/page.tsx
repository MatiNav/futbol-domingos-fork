"use client";
import { useState, useEffect } from "react";
import { DBMatch } from "@/app/constants/types/Match";
import MatchSelector from "../components/MatchSelector";
import MatchResultTable from "../components/MatchResult";
import MatchDetailsTable from "../components/Table/MatchDetailsTable";
import PlayerOfTheMatch from "../components/PlayerOfTheMatch";
import { useMaxMatchNumber } from "../hooks/useMaxMatchNumber";
import { useFetchPlayers } from "../hooks/useFetchPlayers";

export default function Matches() {
  const [match, setMatch] = useState<DBMatch | null>(null);
  const { playersMap } = useFetchPlayers();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { maxMatchNumber } = useMaxMatchNumber();

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

  useEffect(() => {
    console.log(maxMatchNumber, "it changed");
    if (maxMatchNumber) {
      fetchMatch(maxMatchNumber.toString());
    }
  }, [maxMatchNumber]);

  const onVoteSubmitted = () => {
    fetchMatch(maxMatchNumber.toString());
  };

  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-7xl mx-auto bg-[#77777736] rounded-lg shadow-lg p-6">
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

        {match && (
          <>
            <MatchDetailsTable match={match} playersMap={playersMap} />

            <MatchResultTable match={match} />

            {match.matchNumber >= 5 && (
              <PlayerOfTheMatch
                match={match}
                playersMap={playersMap}
                isLatestMatch={match.matchNumber === maxMatchNumber}
                onVoteSubmitted={onVoteSubmitted}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
