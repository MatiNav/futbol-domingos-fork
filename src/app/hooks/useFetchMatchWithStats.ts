import { useCallback, useEffect, useState } from "react";
import { useTournament } from "../contexts/TournamentContext";
import { PlayerWithStats, SerializedMatch } from "../constants/types";

export const useFetchMatchWithStats = (
  playersWithStats: PlayerWithStats[],
  maxMatchNumber: number
) => {
  const [matchNumber, setMatchNumber] = useState(maxMatchNumber);
  const [match, setMatch] = useState<SerializedMatch | null>(null);
  const [currentTeamPercentages, setCurrentTeamPercentages] = useState({
    oscuras: 0,
    claras: 0,
  });
  const [untilMatchTeamPercentages, setUntilMatchTeamPercentages] = useState({
    oscuras: 0,
    claras: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [
    playersWithStatsUntilMatchNumber,
    setPlayersWithStatsUntilMatchNumber,
  ] = useState<PlayerWithStats[]>([]);

  const { selectedTournament } = useTournament();

  const getSumOfPercentageColumnByTeamUntilMatch = useCallback(
    async (match: SerializedMatch) => {
      try {
        const response = await fetch(
          `/api/players/withStats?matchNumber=${match.matchNumber}&tournamentId=${selectedTournament?._id}`
        );
        const data = await response.json();

        setPlayersWithStatsUntilMatchNumber(data);
        setUntilMatchTeamPercentages(
          getSumOfPercentageColumnByTeam(data, match)
        );
      } catch (error: unknown) {
        console.error("Error fetching players:", error);
        setError("Error fetching players");
      }
    },
    [selectedTournament?._id]
  );

  const fetchMatch = useCallback(
    async (number: string) => {
      setIsLoading(true);
      setError("");
      setMatch(null);
      setSuccessMessage("");

      try {
        const response = await fetch(
          `/api/matches/${number}?tournamentId=${selectedTournament?._id}`
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Error al buscar el partido");
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
    },
    [selectedTournament?._id]
  );

  useEffect(() => {
    if (matchNumber) {
      fetchMatch(matchNumber.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchNumber]);

  useEffect(() => {
    if (match) {
      getSumOfPercentageColumnByTeamUntilMatch(match);

      const teamPercentages = getSumOfPercentageColumnByTeam(
        playersWithStats,
        match
      );

      setCurrentTeamPercentages(teamPercentages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match]);

  useEffect(() => {
    if (selectedTournament?._id) {
      setMatchNumber(maxMatchNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTournament?._id]);

  return {
    fetchMatch,
    matchNumber,
    match,
    setMatch,
    setMatchNumber,
    currentTeamPercentages,
    untilMatchTeamPercentages,
    isLoading,
    error,
    successMessage,
    playersWithStatsUntilMatchNumber,
  };
};

function getSumOfPercentageColumnByTeam(
  playersWithStats: PlayerWithStats[],
  match: SerializedMatch
) {
  const oscurasPercentage = match.oscuras.players.reduce((acc, player) => {
    const playerStats = playersWithStats.find((p) => p._id === player._id);
    return acc + (playerStats?.percentage || 0);
  }, 0);

  const clarasPercentage = match.claras.players.reduce((acc, player) => {
    const playerStats = playersWithStats.find((p) => p._id === player._id);
    return acc + (playerStats?.percentage || 0);
  }, 0);

  return { oscuras: oscurasPercentage, claras: clarasPercentage };
}
