import {
  DBMatch,
  DBPlayer,
  UserProfileWithPlayerId,
} from "@/app/constants/types";
import React, { useEffect, useState } from "react";
import { getVotedPlayers } from "../utils";

type PlayerOfTheMatchProps = {
  match: DBMatch;
  playersMap: { [key: string]: DBPlayer };
  isLatestMatch: boolean;
  onVoteSubmitted: () => void;
  user: UserProfileWithPlayerId | null;
};

export default function PlayerOfTheMatch({
  match,
  playersMap,
  isLatestMatch,
  onVoteSubmitted,
  user,
}: PlayerOfTheMatchProps) {
  const [hasMatchBeenPlayed, setHasMatchBeenPlayed] = useState(
    Boolean(match.winner)
  );
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserPlayedMatch, setHasUserPlayedMatch] = useState(false);

  useEffect(() => {
    setHasMatchBeenPlayed(Boolean(match.winner));
  }, [match]);

  useEffect(() => {
    const alreadySelectedPlayer =
      match?.playerOfTheMatchVotes
        ?.find((vote) => vote.userId === user?.playerId.toString())
        ?.playerVotedFor.toString() || "";

    const userPlayedMatchBoolean = [match.oscuras, match.claras].some((team) =>
      team.players.some(
        (player) => player._id.toString() === user?.playerId.toString()
      )
    );

    setSelectedPlayer(alreadySelectedPlayer);
    setHasUserPlayedMatch(userPlayedMatchBoolean);
  }, [user, match]);

  const allPlayers = [...match.oscuras.players, ...match.claras.players];

  const handleVoteSubmit = async () => {
    if (!user || !selectedPlayer) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/matches/${match.matchNumber}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerVotedFor: selectedPlayer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit vote");
      }

      onVoteSubmitted();
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get vote counts and most voted players
  const voteCounts = match.playerOfTheMatchVotes?.reduce((acc, vote) => {
    const playerId = vote.playerVotedFor.toString();
    acc[playerId] = (acc[playerId] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const votedPlayers = Object.keys(getVotedPlayers(match));

  return (
    <div className="mt-6 p-4 bg-[#1a472a] rounded-lg space-y-6">
      <div className="flex items-center">
        <h3 className="text-xl font-semibold text-white">
          Jugador del Partido
        </h3>
        {hasMatchBeenPlayed === false && (
          <span className="ml-2 text-sm text-gray-300">
            ( se podra elegir una vez finalizado el partido )
          </span>
        )}
      </div>

      {/* Most voted players section */}
      {votedPlayers.length > 0 && voteCounts && (
        <div className="p-4 bg-[#2a573a] rounded-lg">
          <h4 className="text-lg font-medium text-white mb-3">Más Votados</h4>
          <div className="space-y-2">
            {votedPlayers.map((playerId, index) => (
              <div key={playerId} className="p-3 bg-[#1a472a] rounded-lg">
                <div className="flex items-center">
                  {index === 0 && (
                    <span className="text-yellow-400 mr-2">⭐</span>
                  )}
                  <span className="text-white">
                    {playersMap[playerId]?.name} ({voteCounts[playerId]}{" "}
                    {voteCounts[playerId] === 1 ? "voto" : "votos"})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Voting section */}
      {isLatestMatch && hasUserPlayedMatch && hasMatchBeenPlayed && (
        <div className="p-4 bg-[#2a573a] rounded-lg">
          <h4 className="text-lg font-medium text-white mb-3">Votar</h4>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-2 bg-[#1a472a] text-white rounded-lg mb-3"
          >
            <option value="">Seleccionar jugador</option>
            {allPlayers.map((player) => (
              <option key={player._id.toString()} value={player._id.toString()}>
                {playersMap[player._id.toString()]?.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleVoteSubmit}
            disabled={!selectedPlayer || isSubmitting}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Votando..." : "Votar"}
          </button>
        </div>
      )}

      {/* Votes list section */}
      <div className="p-4 bg-[#2a573a] rounded-lg">
        <h4 className="text-lg font-medium text-white mb-3">Votos</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-green-100 font-medium pb-2 border-b border-[#1a472a]">
            Usuario
          </div>
          <div className="text-green-100 font-medium pb-2 border-b border-[#1a472a]">
            Votó por
          </div>
          {match.playerOfTheMatchVotes?.map((vote, index) => (
            <React.Fragment key={index}>
              <div className="text-green-200 py-2 border-b border-[#1a472a] last:border-b-0">
                {vote.userName}
              </div>
              <div className="text-green-200 py-2 border-b border-[#1a472a] last:border-b-0">
                {playersMap[vote.playerVotedFor.toString()]?.name}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
