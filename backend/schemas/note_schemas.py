from pydantic import BaseModel, Field
from typing import Literal
from datetime import datetime
from pydantic import ConfigDict


# Categorías permitidas según el reto
CategoryType = Literal["Personal", "Trabajo", "Ideas", "Recordatorios"]


# ============================================================
# CREAR NOTA
# ============================================================
class NoteCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=1,
        max_length=150,
        examples=["Comprar libros"]
    )

    content: str = Field(
        ...,
        min_length=1,
        examples=["Recordar comprar libros de Python"]
    )

    category: CategoryType


# ============================================================
# ACTUALIZAR NOTA
# ============================================================
class NoteUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    category: CategoryType | None = None


# ============================================================
# RESPUESTA NOTA
# ============================================================
class NoteResponse(BaseModel):
    id: int
    title: str
    content: str
    category: CategoryType
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
