import { DBMatch } from "../constants/types/db-models/Match";
import { DBPlayer } from "../constants/types/db-models/Player";
import React, { useEffect, useState } from "react";
import { AuthenticatedUserData } from "../utils/server/users";
import { getMostVotedPlayersOfTheMatch } from "../utils/players";

type PlayerOfTheMatchProps = {
  match: DBMatch;
  playersMap: { [key: string]: DBPlayer };
  isLatestMatch: boolean;
  onVoteSubmitted: () => void;
  authenticatedUser: AuthenticatedUserData | null;
};

export default function PlayerOfTheMatch({
  match,
  playersMap,
  isLatestMatch,
  onVoteSubmitted,
  authenticatedUser,
}: PlayerOfTheMatchProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUserPlayedMatch, setHasUserPlayedMatch] = useState(false);

  useEffect(() => {
    const alreadySelectedPlayer =
      match?.playerOfTheMatchVotes
        ?.find(
          (vote) => vote.userId === authenticatedUser?.dbData._id.toString()
        )
        ?.playerVotedFor.toString() || "";

    const userPlayedMatchBoolean = [match.oscuras, match.claras].some((team) =>
      team.players.some(
        (player) =>
          player._id.toString() === authenticatedUser?.dbData._id.toString()
      )
    );

    setSelectedPlayer(alreadySelectedPlayer);
    setHasUserPlayedMatch(userPlayedMatchBoolean);
  }, [authenticatedUser, match]);

  const allPlayers = [...match.oscuras.players, ...match.claras.players];

  const handleVoteSubmit = async () => {
    if (!authenticatedUser || !selectedPlayer) return;

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

  const mostVotedPlayerIds = getMostVotedPlayersOfTheMatch(match);

  return (
    <div className="mt-6 p-4 bg-[#1a472a] rounded-lg">
      <h3 className="text-xl font-semibold text-white mb-4">
        Jugador del Partido
      </h3>

      {mostVotedPlayerIds.length > 0 && voteCounts && (
        <div className="mb-4 space-y-2">
          {mostVotedPlayerIds.map((playerId) => (
            <div key={playerId} className="p-3 bg-green-800 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">⭐</span>
                <span className="text-white">
                  {playersMap[playerId]?.name} ({voteCounts[playerId]} votos)
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLatestMatch && hasUserPlayedMatch && (
        <div className="mt-4">
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-2 bg-green-800 text-white rounded-lg mb-3"
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

      <div className="mt-4">
        <h4 className="text-white font-medium mb-2">Votos:</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-green-100 font-medium">Usuario</div>
          <div className="text-green-100 font-medium">Votó por</div>
          {match.playerOfTheMatchVotes?.map((vote, index) => (
            <React.Fragment key={index}>
              <div className="text-green-200">{vote.userName}</div>
              <div className="text-green-200">
                {playersMap[vote.playerVotedFor.toString()]?.name}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
