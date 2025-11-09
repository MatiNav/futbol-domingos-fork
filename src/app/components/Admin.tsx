"use client";

import Link from "next/link";
import { useTournament } from "@/app/contexts/TournamentContext";
export default function AdminContent() {
  const { selectedTournamentData } = useTournament();

  return (
    <div className="min-h-screen bg-[#0B2818]">
      <main>
        <div className="text-center mt-10">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg pb-7 italic">
            Administración
          </h1>
          <div className="grid gap-4 max-w-md mx-auto">
            <Link
              href="/admin/agregar-jugador"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">
                    Agregar Jugador
                  </h2>
                  <p className="text-green-100 text-sm">
                    Registrar nuevo jugador
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href={`/admin/armar-equipos?tournamentId=${selectedTournamentData?.tournament._id}`}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">
                    Armar Equipos
                  </h2>
                  <p className="text-green-100 text-sm">Crear nuevos equipos</p>
                </div>
              </div>
            </Link>

            <Link
              href={`/admin/editar-equipos?tournamentId=${selectedTournamentData?.tournament._id}`}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">
                    Editar Equipos
                  </h2>
                  <p className="text-green-100 text-sm">
                    Modificar equipos existentes
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/admin/editar-jugadores"
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div className="text-left">
                  <h2 className="text-xl font-semibold text-white">
                    Editar Jugadores
                  </h2>
                  <p className="text-green-100 text-sm">
                    Modificar información de jugadores
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
