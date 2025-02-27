import Link from "next/link";
import { IoMdFootball } from "react-icons/io";

import { useTournament } from "@/app/contexts/TournamentContext";

export default function MatchesLink() {
  const { selectedTournamentData } = useTournament();

  return (
    <Link
      href={`/matches?tournamentId=${selectedTournamentData?.tournament._id}`}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 p-3 rounded-lg">
          <IoMdFootball size={24} />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-semibold text-white">Partidos</h2>
          <p className="text-green-100 text-sm">Consultar resultados</p>
        </div>
      </div>
    </Link>
  );
}
