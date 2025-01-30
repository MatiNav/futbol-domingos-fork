export default function ConfirmarEmail() {
  return (
    <div className="min-h-screen bg-[#0B2818] p-4">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-sm rounded-lg shadow-lg p-8 mt-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-6">
            Confirmar Email
          </h1>

          <div className="bg-yellow-500/20 border border-yellow-600 rounded-lg p-6 mb-8">
            <p className="text-yellow-100 text-lg mb-4">
              Tu email no está registrado en nuestra base de datos.
            </p>
            <p className="text-yellow-100">
              Por favor, contacta al administrador para que te agregue al
              sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
