import { useState, useEffect } from "react";

/**
 * Categorías disponibles
 */
const categories = ["Personal", "Trabajo", "Ideas", "Recordatorios"];

const MAX_TITLE = 60;
const MAX_CONTENT = 2000;

const emptyForm = {
  title: "",
  content: "",
  category: "Personal",
};

/**
 * Formulario de creación y edición
 *
 * - NO guarda automáticamente
 * - Solo actualiza cuando se envía el formulario
 */
const NoteForm = ({ onAdd, onUpdate, editingNote, onCancelEdit }) => {
  const [form, setForm] = useState(emptyForm);

  /**
   * Sincroniza cuando cambia editingNote
   */
  useEffect(() => {
    if (editingNote) {
      setForm({
        title: editingNote.title,
        content: editingNote.content,
        category: editingNote.category,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingNote]);

  /**
   * Maneja cambios locales (NO llama al backend)
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Envía datos al presionar botón
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) return;

    if (editingNote) {
      await onUpdate({ ...form, id: editingNote.id });
    } else {
      const created = await onAdd(form);
      if (created) {
        setForm({ ...emptyForm });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        {editingNote ? "✏️ Editar nota" : "➕ Nueva nota"}
      </h2>

      <div>
        <input
          name="title"
          maxLength={MAX_TITLE}
          className="w-full border px-4 py-2 rounded-lg"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
        />
        <p className="text-xs text-gray-500">
          {form.title.length}/{MAX_TITLE}
        </p>
      </div>

      <div>
        <textarea
          name="content"
          maxLength={MAX_CONTENT}
          className="w-full border px-4 py-2 rounded-lg min-h-[120px] max-h-[280px] overflow-y-auto resize-y"
          value={form.content}
          onChange={handleChange}
        />
        <p className="text-xs text-gray-500">
          {form.content.length}/{MAX_CONTENT}
        </p>
      </div>

      <select
        name="category"
        value={form.category}
        onChange={handleChange}
        className="border px-4 py-2 rounded-lg"
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          {editingNote ? "Guardar cambios" : "Agregar nota"}
        </button>

        {editingNote && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-gray-500 hover:underline"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default NoteForm;













