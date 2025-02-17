"use client";

import { useState, useEffect } from "react";
import MatchSelector from "./MatchSelector";
import MatchResultTable from "./MatchResult";
import MatchDetailsTable from "./MatchDetailsTable";
import PlayerOfTheMatch from "@/app/features/players/components/PlayerOfTheMatch";
import MatchOpinions from "./MatchOpinions";
import { PlayersResponse } from "@/app/features/players/utils/server";
import {
  UserProfileWithPlayerId,
  SerializedMatch,
} from "@/app/constants/types";

export default function Matches({
  user,
  players: { playersMap },
  maxMatchNumber,
}: {
  user: UserProfileWithPlayerId | null;
  players: PlayersResponse;
  maxMatchNumber: number;
}) {
  const [match, setMatch] = useState<SerializedMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
              <>
                <PlayerOfTheMatch
                  match={match}
                  playersMap={playersMap}
                  isLatestMatch={match.matchNumber === maxMatchNumber}
                  onVoteSubmitted={onVoteSubmitted}
                  user={user}
                />
                <MatchOpinions
                  match={match}
                  isLatestMatch={match.matchNumber === maxMatchNumber}
                  hasUserPlayedMatch={[match.oscuras, match.claras].some(
                    (team) =>
                      team.players.some(
                        (player) =>
                          player._id.toString() === user?.playerId.toString()
                      )
                  )}
                  // TODO: Add onOpinionSubmitted
                  onOpinionSubmitted={onVoteSubmitted}
                  user={user}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
