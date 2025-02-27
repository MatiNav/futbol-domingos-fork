import Link from "next/link";
import { FaTable } from "react-icons/fa6";

import { useTournament } from "@/app/contexts/TournamentContext";

export default function TableLink() {
  const { selectedTournamentData } = useTournament();

  return (
    <Link
      href={`/table?tournamentId=${selectedTournamentData?.tournament._id}`}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 p-3 rounded-lg">
          <FaTable size={24} />
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
