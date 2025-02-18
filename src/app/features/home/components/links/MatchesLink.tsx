import Link from "next/link";
import { useTournament } from "@/app/contexts/TournamentContext";

export default function MatchesLink() {
  const { selectedTournament } = useTournament();

  return (
    <Link
      href={`/matches?tournamentId=${selectedTournament?._id}`}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 p-3 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 8v8m-4-5v5M8 8v8m-4-5v5m0-5h18"
            />
          </svg>
        </div>
        <div className="text-left">
          <h2 className="text-xl font-semibold text-white">Partidos</h2>
          <p className="text-green-100 text-sm">Consultar resultados</p>
        </div>
      </div>
    </Link>
  );
}
