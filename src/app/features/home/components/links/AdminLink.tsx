import Link from "next/link";
import { isAdmin } from "@/app/features/auth/utils/roles";
import useCustomUser from "@/app/features/auth/hooks/useCustomUser";
import { useTournament } from "@/app/contexts/TournamentContext";

export default function AdminLink() {
  const user = useCustomUser();
  const { selectedTournament } = useTournament();

  return (
    <>
      {isAdmin(user) && (
        <Link
          href={`/admin?tournamentId=${selectedTournament?._id}`}
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
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
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
