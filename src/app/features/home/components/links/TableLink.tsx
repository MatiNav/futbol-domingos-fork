import Link from "next/link";
import { useTournament } from "@/app/contexts/TournamentContext";

export default function TableLink() {
  const { selectedTournament } = useTournament();

  return (
    <Link
      href={`/table?tournamentId=${selectedTournament?._id}`}
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
              d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <div className="text-left">
          <h2 className="text-xl font-semibold text-white">
            Tabla de Posiciones
          </h2>
          <p className="text-green-100 text-sm">
            Ver estadísticas de jugadores
          </p>
        </div>
      </div>
    </Link>
  );
}
