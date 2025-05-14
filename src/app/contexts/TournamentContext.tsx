"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { SerializedTournament } from "../constants/types";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

type TournamentData = {
  tournament: SerializedTournament;
  maxMatchNumber: number;
};

type TournamentContextType = {
  tournamentsData: TournamentData[];
  selectedTournamentData: TournamentData | null;
  setSelectedTournamentData: (tournament: TournamentData) => void;
  errorFetchingTournaments: Error | null;
  isLoadingTournaments: boolean;
};

const TournamentContext = createContext<TournamentContextType>({
  tournamentsData: [],
  selectedTournamentData: null,
  setSelectedTournamentData: () => {},
  errorFetchingTournaments: null,
  isLoadingTournaments: false,
});

export const TournamentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tournamentsData, setTournamentsData] = useState<TournamentData[]>([]);
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const tournamentId = searchParams.get("tournamentId");

  const [selectedTournamentData, setSelectedTournamentData] =
    useState<TournamentData | null>(getLastTournament(tournamentsData));

  useEffect(() => {
    const fetchTournamentsData = async () => {
      try {
        setIsLoadingTournaments(true);
        const response = await fetch("/api/tournaments", {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            Expires: "0",
          },
          next: { revalidate: 0 },
        });
        const tournaments = await response.json();

        const responses = await Promise.all(
          tournaments.map(async (tournament: SerializedTournament) => {
            const response = await fetch(
              `/api/matches/latest?tournamentId=${tournament._id}`
            );
            return response.json();
          })
        );

        const tournamentsData = responses.map((response, index) => ({
          tournament: tournaments[index],
          maxMatchNumber: response.maxMatchNumber,
        }));

        setTournamentsData(tournamentsData);
      } catch (error: unknown) {
        console.error("Error fetching tournaments", error);
        setError(error as Error);
      } finally {
        setIsLoadingTournaments(false);
      }
    };

    fetchTournamentsData();
  }, []);

  useEffect(() => {
    if (tournamentId) {
      setSelectedTournamentData(
        tournamentsData.find((t) => t.tournament._id === tournamentId) ||
          getLastTournament(tournamentsData)
      );
    } else {
      setSelectedTournamentData(getLastTournament(tournamentsData));
    }
  }, [tournamentsData, tournamentId]);

  const handleSetSelectedTournament = (tournament: TournamentData) => {
    setSelectedTournamentData(tournament);
    const url = new URL(window.location.href);
    url.searchParams.set("tournamentId", tournament.tournament._id);
    router.push(url.toString());
  };

  return (
    <TournamentContext.Provider
      value={{
        tournamentsData,
        selectedTournamentData,
        setSelectedTournamentData: handleSetSelectedTournament,
        errorFetchingTournaments: error,
        isLoadingTournaments,
      }}
    >
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error("useTournament must be used within a TournamentProvider");
  }
  return context;
};

function getLastTournament(tournamentsData: TournamentData[]) {
  return tournamentsData.length > 0 ? tournamentsData[0] : null;
}
