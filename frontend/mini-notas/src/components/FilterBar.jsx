/**
 * Definición de categorías disponibles
 * Cada categoría tiene:
 * - name: nombre visible
 * - color: usado para estilos dinámicos
 */
const categories = [
  { name: "Todas", color: "gray" },
  { name: "Personal", color: "blue" },
  { name: "Trabajo", color: "green" },
  { name: "Ideas", color: "yellow" },
  { name: "Recordatorios", color: "red" },
];

/**
 * Estilos base por color (estado normal)
 */
const colorClasses = {
  gray: "border-gray-400 text-gray-700 hover:bg-gray-100",
  blue: "border-blue-500 text-blue-600 hover:bg-blue-50",
  green: "border-green-500 text-green-600 hover:bg-green-50",
  yellow: "border-yellow-500 text-yellow-600 hover:bg-yellow-50",
  red: "border-red-500 text-red-600 hover:bg-red-50",
};

/**
 * Estilos cuando la categoría está activa
 * Más fuerte visualmente
 */
const activeClasses = {
  gray: "bg-gray-600 text-white shadow-md scale-105",
  blue: "bg-blue-600 text-white shadow-md scale-105",
  green: "bg-green-600 text-white shadow-md scale-105",
  yellow: "bg-yellow-500 text-white shadow-md scale-105",
  red: "bg-red-600 text-white shadow-md scale-105",
};

/**
 * Componente FilterBar
 *
 * Props:
 * - value: categoría seleccionada
 * - onChange: función para cambiar categoría
 * - counts: objeto con conteo por categoría
 */
const FilterBar = ({ value, onChange, counts = {} }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {categories.map((cat) => {
        const isActive = value === cat.name;
        const count = counts[cat.name] || 0;

        return (
          <button
            key={cat.name}
            onClick={() => onChange(cat.name)}
            className={`
              px-4 py-2 rounded-full border text-sm font-medium
              flex items-center gap-2
              transition-all duration-200
              ${
                isActive
                  ? activeClasses[cat.color]
                  : `${colorClasses[cat.color]} bg-white`
              }
            `}
          >
            <span>{cat.name}</span>

            {/* Badge contador */}
            <span
              className={`
                text-xs font-semibold px-2 py-0.5 rounded-full
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;



