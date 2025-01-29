export default function AdminMenu() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid gap-4 max-w-md mx-auto">
        <a
          href="/admin/agregar-jugador"
          className="bg-white p-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
        >
          <div className="text-xl font-semibold text-gray-800">Agregar Jugador</div>
        </a>
        <a
          href="/admin/armar-equipos"
          className="bg-white p-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
        >
          <div className="text-xl font-semibold text-gray-800">Armar Equipos</div>
        </a>
        <a
          href="/admin/editar-equipos"
          className="bg-white p-6 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
        >
          <div className="text-xl font-semibold text-gray-800">Editar Equipos</div>
        </a>
      </div>
    </div>
  );
} 