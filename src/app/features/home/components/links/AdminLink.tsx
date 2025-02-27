import Link from "next/link";
import { GrUserAdmin } from "react-icons/gr";

import { isAdmin } from "@/app/features/auth/utils/roles";
import useCustomUser from "@/app/features/auth/hooks/useCustomUser";
import { useTournament } from "@/app/contexts/TournamentContext";

export default function AdminLink() {
  const user = useCustomUser();
  const { selectedTournamentData } = useTournament();

  return (
    <>
      {isAdmin(user) && (
        <Link
          href={`/admin?tournamentId=${selectedTournamentData?.tournament._id}`}
          className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:bg-white/20 transition-all"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-500 p-3 rounded-lg">
              <GrUserAdmin size={24} />
            </div>
            <div className="text-left">
              <h2 className="text-xl font-semibold text-white">
                Administración
              </h2>
              <p className="text-green-100 text-sm">Gestionar jugadores</p>
            </div>
          </div>
        </Link>
      )}
    </>
  );
}
