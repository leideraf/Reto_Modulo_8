const Header = ({ onLogout }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Título */}
        <div className="flex items-center gap-3">
          <div className="bg-white/20 text-white rounded-lg px-3 py-1 text-lg">
            📒
          </div>
          <h1 className="text-xl md:text-2xl font-semibold text-white tracking-wide">
            Mis Notas Personales
          </h1>
        </div>

        {/* Botón logout */}
        <button
          onClick={onLogout}
          className="
            flex items-center gap-2
            bg-white/10 hover:bg-white/20
            text-white px-4 py-2 rounded-lg
            text-sm font-medium
            transition-all duration-200
          "
        >
          <span>Salir</span>
          <span className="text-lg">⎋</span>
        </button>
      </div>
    </header>
  );
};

export default Header;

