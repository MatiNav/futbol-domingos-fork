import Link from "next/link";

export default function AdminMenu() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-600 to-green-800">
      <main className="p-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Administración
          </h1>
          <p className="text-green-100 text-lg mb-8">Panel de Control</p>

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
              href="/admin/armar-equipos"
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
              href="/admin/editar-equipos"
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
          </div>
        </div>
      </main>
    </div>
  );
}
