import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Swal from "sweetalert2";

import Header from "../components/Header";
import Footer from "../components/Footer";
import FilterBar from "../components/FilterBar";
import NoteForm from "../components/NoteForm";
import NoteCard from "../components/NoteCard";

/**
 * Página principal de Notas
 *
 * Responsabilidades:
 * - Obtener notas desde el backend
 * - Manejar CRUD completo
 * - Aplicar filtro por categoría
 * - Mostrar alertas profesionales
 * - Controlar sesión y logout
 */
const Notes = () => {
  const navigate = useNavigate();

  // =====================================================
  // ESTADOS PRINCIPALES
  // =====================================================

  /**
   * allNotes → Todas las notas del usuario
   * filteredNotes → Notas visibles según filtro
   */
  const [allNotes, setAllNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);

  /**
   * filter → categoría activa
   * editingNote → nota seleccionada para edición
   */
  const [filter, setFilter] = useState("Todas");
  const [editingNote, setEditingNote] = useState(null);

  /**
   * Estados auxiliares
   */
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =====================================================
  // OBTENER TODAS LAS NOTAS DESDE BACKEND
  // =====================================================
  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axiosClient.get("/notes/");
      setAllNotes(response.data);

    } catch (err) {
      console.error("Error al obtener notas:", err);

      // Manejo profesional de sesión expirada
      if (err.response?.status === 401) {
        localStorage.removeItem('auth');
        navigate("/login");
      } else {
        setError("No se pudieron cargar las notas.");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================================
  // CARGA INICIAL
  // =====================================================
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // =====================================================
  // FILTRADO LOCAL (mantiene contadores correctos)
  // =====================================================
  useEffect(() => {
    if (filter === "Todas") {
      setFilteredNotes(allNotes);
    } else {
      setFilteredNotes(
        allNotes.filter((note) => note.category === filter)
      );
    }
  }, [filter, allNotes]);

  // =====================================================
  // CREAR NOTA
  // =====================================================
  const addNote = async (data) => {
    try {
      const response = await axiosClient.post("/notes/", data);

      setAllNotes((prev) => [response.data, ...prev]);

      Swal.fire({
        icon: "success",
        title: "Nota creada",
        text: "La nota se creó correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo crear la nota", "error");
      return false;
    }
  };

  // =====================================================
  // ACTUALIZAR NOTA
  // =====================================================
  const updateNote = async (updatedNote) => {
    try {
      const response = await axiosClient.put(
        `/notes/${updatedNote.id}`,
        updatedNote
      );

      setAllNotes((prev) =>
        prev.map((note) =>
          note.id === updatedNote.id ? response.data : note
        )
      );

      setEditingNote(null);

      Swal.fire({
        icon: "success",
        title: "Nota actualizada",
        text: "Los cambios se guardaron correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo actualizar la nota", "error");
    }
  };

  // =====================================================
  // ELIMINAR NOTA (UNA SOLA CONFIRMACIÓN)
  // =====================================================
  const deleteNote = async (id) => {

    const result = await Swal.fire({
      title: "¿Seguro que deseas eliminar la nota?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosClient.delete(`/notes/${id}`);

      setAllNotes((prev) =>
        prev.filter((note) => note.id !== id)
      );

      Swal.fire({
        icon: "success",
        title: "Eliminada",
        text: "La nota fue eliminada correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo eliminar la nota", "error");
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================
  const logout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  // =====================================================
  // CONTADOR DE CATEGORÍAS
  // =====================================================
  const categoryCounts = allNotes.reduce(
    (acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      acc.Todas += 1;
      return acc;
    },
    { Todas: 0 }
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-blue-50">
      <Header onLogout={logout} />

      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">

        {/* ================= FILTRO ================= */}
        <FilterBar
          value={filter}
          onChange={setFilter}
          counts={categoryCounts}
        />

        {/* ================= FORMULARIO ================= */}
        <NoteForm
          onAdd={addNote}
          onUpdate={updateNote}
          editingNote={editingNote}
          onCancelEdit={() => setEditingNote(null)}
        />

        {/* ================= ESTADOS ================= */}
        {loading ? (
          <p className="text-center text-gray-500 mt-12">
            Cargando notas...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 mt-12">
            {error}
          </p>
        ) : filteredNotes.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">
            No hay notas para esta categoría 📭
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onEdit={() => setEditingNote(note)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Notes;

