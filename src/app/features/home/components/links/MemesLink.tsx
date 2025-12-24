import Link from "next/link";
import { FaRegImage } from "react-icons/fa";

import { useTournament } from "@/app/contexts/TournamentContext";

export default function MemesLink() {
  const { selectedTournamentData } = useTournament();

  return (
    <Link
      href={`/memes?tournamentId=${selectedTournamentData?.tournament._id}`}
      className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
    >
      <div className="flex items-center space-x-4">
        <div className="bg-green-500 p-3 rounded-lg">
          <FaRegImage size={24} />
        </div>
        <div className="text-left">
          <h2 className="text-xl font-semibold text-white">Memes</h2>
          <p className="text-green-100 text-sm">Ver imágenes del torneo</p>
        </div>
      </div>
    </Link>
  );
}
