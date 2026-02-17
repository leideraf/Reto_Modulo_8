from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from core.database import get_db
from models.note_model import Note
from schemas.note_schemas import NoteCreate, NoteUpdate, NoteResponse
from auth.dependencies import get_current_user
from models.user_model import User

router = APIRouter()


# ============================================================
# CREAR NOTA (PROTEGIDA)
# ============================================================
@router.post("/", response_model=NoteResponse)
def create_note(
    note: NoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    new_note = Note(
        title=note.title,
        content=note.content,
        category=note.category,
        user_id=current_user.id
    )

    db.add(new_note)
    db.commit()
    db.refresh(new_note)

    return new_note


# ============================================================
# LISTAR NOTAS (FILTRABLE POR CATEGORÍA)
# ============================================================
@router.get("/", response_model=List[NoteResponse])
def get_notes(
    category: Optional[str] = Query(
        None,
        description="Filtrar por categoría"
    ),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    query = db.query(Note).filter(Note.user_id == current_user.id)

    if category:
        query = query.filter(Note.category == category)

    notes = query.order_by(Note.created_at.desc()).all()

    return notes


# ============================================================
# EDITAR NOTA
# ============================================================
@router.put("/{note_id}", response_model=NoteResponse)
def update_note(
    note_id: int,
    note_data: NoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Nota no encontrada"
        )

    if note_data.title is not None:
        note.title = note_data.title

    if note_data.content is not None:
        note.content = note_data.content

    if note_data.category is not None:
        note.category = note_data.category

    db.commit()
    db.refresh(note)

    return note


# ============================================================
# ELIMINAR NOTA
# ============================================================
@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    note = db.query(Note).filter(
        Note.id == note_id,
        Note.user_id == current_user.id
    ).first()

    if not note:
        raise HTTPException(
            status_code=404,
            detail="Nota no encontrada"
        )

    db.delete(note)
    db.commit()

    return
