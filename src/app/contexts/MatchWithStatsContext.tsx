"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { SerializedMatch } from "../constants/types";
import { PlayerWithStats } from "../constants/types";
import { useTournament } from "./TournamentContext";

export type TeamPercentage = {
  oscuras: {
    percentage: number;
    amountOfPlayersWithout0Percentage: number;
  };
  claras: {
    percentage: number;
    amountOfPlayersWithout0Percentage: number;
  };
};

const zeroTeamPercentage: TeamPercentage = {
  oscuras: {
    percentage: 0,
    amountOfPlayersWithout0Percentage: 0,
  },
  claras: {
    percentage: 0,
    amountOfPlayersWithout0Percentage: 0,
  },
};

type MatchWithStatsContextType = {
  fetchMatch: () => Promise<void>;
  matchNumber: number | undefined;
  match: SerializedMatch | null;
  setMatch: (match: SerializedMatch | null) => void;
  setMatchNumber: (matchNumber: number) => void;
  currentTeamPercentages: TeamPercentage;
  untilMatchTeamPercentages: TeamPercentage;
  isLoading: boolean;
  error: string;
  successMessage: string;
  playersWithStats: PlayerWithStats[];
  playersWithStatsUntilMatchNumber: PlayerWithStats[];
};

const MatchWithStatsContext = createContext<MatchWithStatsContextType>({
  fetchMatch: async () => {},
  matchNumber: 1,
  match: null,
  setMatch: () => {},
  setMatchNumber: () => {},
  currentTeamPercentages: zeroTeamPercentage,
  untilMatchTeamPercentages: zeroTeamPercentage,
  isLoading: false,
  error: "",
  successMessage: "",
  playersWithStats: [],
  playersWithStatsUntilMatchNumber: [],
});

export default function MatchWithStatsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedTournamentData } = useTournament();

  const [matchNumber, setMatchNumber] = useState(
    selectedTournamentData?.maxMatchNumber
  );
  const [match, setMatch] = useState<SerializedMatch | null>(null);
  const [currentTeamPercentages, setCurrentTeamPercentages] =
    useState<TeamPercentage>(zeroTeamPercentage);
  const [untilMatchTeamPercentages, setUntilMatchTeamPercentages] =
    useState<TeamPercentage>(zeroTeamPercentage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [
    playersWithStatsUntilMatchNumber,
    setPlayersWithStatsUntilMatchNumber,
  ] = useState<PlayerWithStats[]>([]);
  const [playersWithStats, setPlayersWithStats] = useState<PlayerWithStats[]>(
    []
  );

  const getSumOfPercentageColumnByTeamUntilMatch = useCallback(
    async (match: SerializedMatch) => {
      try {
        const response = await fetch(
          `/api/players/withStats?matchNumber=${match.matchNumber}&tournamentId=${selectedTournamentData?.tournament._id}`
        );
        const data = await response.json();

        if (matchNumber === selectedTournamentData?.maxMatchNumber) {
          setPlayersWithStats(data);
          setCurrentTeamPercentages(
            getSumOfPercentageColumnByTeam(data, match)
          );
        }

        setPlayersWithStatsUntilMatchNumber(data);
        setUntilMatchTeamPercentages(
          getSumOfPercentageColumnByTeam(data, match)
        );
      } catch (error: unknown) {
        console.error("Error fetching players:", error);
        setError("Error fetching players");
      }
    },
    [
      selectedTournamentData?.tournament._id,
      matchNumber,
      selectedTournamentData?.maxMatchNumber,
    ]
  );

  const fetchMatch = useCallback(async () => {
    if (!selectedTournamentData?.tournament._id) {
      return;
    }

    setIsLoading(true);
    setError("");
    setMatch(null);
    setSuccessMessage("");

    try {
      if (!matchNumber || matchNumber > selectedTournamentData.maxMatchNumber) {
        setError("No hay partidos disponibles");
        return;
      }

      const response = await fetch(
        `/api/matches/${matchNumber}?tournamentId=${selectedTournamentData?.tournament._id}`
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Error al buscar el partido");
      }

      if (data.match) {
        setMatch(data.match);
        getSumOfPercentageColumnByTeamUntilMatch(data.match);
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
  }, [
    selectedTournamentData?.tournament._id,
    selectedTournamentData?.maxMatchNumber,
    matchNumber,
    getSumOfPercentageColumnByTeamUntilMatch,
  ]);

  useEffect(() => {
    if (selectedTournamentData?.maxMatchNumber) {
      setMatchNumber(selectedTournamentData.maxMatchNumber);
    }
  }, [selectedTournamentData?.maxMatchNumber]);

  useEffect(() => {
    if (selectedTournamentData?.maxMatchNumber) {
      fetchMatch();
    }
  }, [
    selectedTournamentData?.tournament._id,
    selectedTournamentData?.maxMatchNumber,
    matchNumber,
    fetchMatch,
  ]);

  const handleSetMatchNumber = useCallback(
    (matchNumber: number) => {
      if (!selectedTournamentData?.maxMatchNumber) {
        return;
      }

      if (matchNumber > selectedTournamentData?.maxMatchNumber) {
        setMatchNumber(selectedTournamentData?.maxMatchNumber);
      } else {
        setMatchNumber(matchNumber);
      }
    },
    [selectedTournamentData?.maxMatchNumber]
  );

  return (
    <MatchWithStatsContext.Provider
      value={{
        fetchMatch,
        matchNumber,
        match,
        setMatch,
        setMatchNumber: handleSetMatchNumber,
        currentTeamPercentages,
        untilMatchTeamPercentages,
        isLoading,
        error,
        successMessage,
        playersWithStats,
        playersWithStatsUntilMatchNumber,
      }}
    >
      <UserProvider>{children}</UserProvider>
    </MatchWithStatsContext.Provider>
  );
}

export const useMatchWithStats = () => {
  const context = useContext(MatchWithStatsContext);
  if (!context) {
    throw new Error(
      "useMatchWithStats must be used within a MatchWithStatsProvider"
    );
  }
  return context;
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

  const oscurasPercentageWithout0Percentage = match.oscuras.players.filter(
    (player) => {
      const playerStats = playersWithStats.find((p) => p._id === player._id);
      return playerStats?.percentage !== 0;
    }
  ).length;

  const clarasPercentageWithout0Percentage = match.claras.players.filter(
    (player) => {
      const playerStats = playersWithStats.find((p) => p._id === player._id);
      return playerStats?.percentage !== 0;
    }
  ).length;

  return {
    oscuras: {
      percentage: oscurasPercentage,
      amountOfPlayersWithout0Percentage: oscurasPercentageWithout0Percentage,
    },
    claras: {
      percentage: clarasPercentage,
      amountOfPlayersWithout0Percentage: clarasPercentageWithout0Percentage,
    },
  };
}
