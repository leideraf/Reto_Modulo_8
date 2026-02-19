/**
 * Colores por categoría
 */
const colors = {
  Personal: "border-blue-500 bg-blue-50",
  Trabajo: "border-green-500 bg-green-50",
  Ideas: "border-yellow-500 bg-yellow-50",
  Recordatorios: "border-red-500 bg-red-50",
};

/**
 * Tarjeta individual de nota
 */
const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div
      className={`
        flex flex-col justify-between
        h-[260px]                /* Altura fija */
        p-5 rounded-xl shadow-md
        border-l-4
        transition hover:shadow-lg
        ${colors[note.category]}
      `}
    >
      {/* ================= CONTENIDO SUPERIOR ================= */}
      <div className="overflow-hidden">

        {/* TÍTULO */}
        <h3
          className="
            font-bold text-lg text-gray-800
            break-words
            line-clamp-1
          "
          title={note.title}
        >
          {note.title}
        </h3>

        {/* FECHA */}
        <p className="text-xs text-gray-500 mt-1">
          {new Date(note.created_at).toLocaleDateString()}
        </p>

        {/* DESCRIPCIÓN (con scroll interno si es larga) */}
        <div
          className="
            mt-3 text-gray-700
            break-words
            max-h-[90px]
            overflow-y-auto
            pr-1
          "
        >
          {note.content}
        </div>
      </div>

      {/* ================= BOTONES (SIEMPRE ABAJO) ================= */}
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex gap-4">
          <button
            onClick={() => onEdit(note)}
            className="text-blue-600 hover:underline"
          >
            ✏️ Editar
          </button>

          <button
            onClick={() => onDelete(note.id)}
            className="text-red-600 hover:underline"
          >
            🗑 Eliminar
          </button>
        </div>

        {/* Badge categoría */}
        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white">
          {note.category}
        </span>
      </div>
    </div>
  );
};

export default NoteCard;




