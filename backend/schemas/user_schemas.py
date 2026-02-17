from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional


# ============================================================
# SCHEMA: REGISTRO DE USUARIO
# ============================================================
class UserCreate(BaseModel):
    """
    Schema para el registro de nuevos usuarios.
    """
    email: EmailStr = Field(
        ...,
        description="Correo electrónico del usuario",
        examples=["usuario@gmail.com"]
    )
    password: str = Field(
        ...,
        min_length=6,
        max_length=128,
        description="Contraseña del usuario (mínimo 6 caracteres)",
        examples=["MiPassword123"]
    )


# ============================================================
# SCHEMA: LOGIN
# ============================================================
class UserLogin(BaseModel):
    """
    Schema para autenticación de usuarios.
    """
    email: EmailStr = Field(
        ...,
        description="Correo electrónico del usuario",
        examples=["usuario@gmail.com"]
    )
    password: str = Field(
        ...,
        description="Contraseña del usuario",
        examples=["MiPassword123"]
    )


# ============================================================
# SCHEMA: RESPUESTA DE USUARIO (SIN PASSWORD)
# ============================================================
class UserResponse(BaseModel):
    """
    Información pública del usuario (sin contraseña).
    """
    id: int = Field(examples=[1])
    email: EmailStr = Field(examples=["usuario@gmail.com"])
    is_active: bool = Field(examples=[True])

    model_config = ConfigDict(from_attributes=True)


# ============================================================
# SCHEMA: TOKEN JWT
# ============================================================
class Token(BaseModel):
    """
    Respuesta básica con JWT.
    """
    access_token: str = Field(
        ...,
        description="Token JWT generado",
        examples=["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."]
    )
    token_type: str = Field(
        default="bearer",
        description="Tipo de token",
        examples=["bearer"]
    )


# ============================================================
# SCHEMA: RESPUESTA COMPLETA DE LOGIN
# ============================================================
class LoginResponse(BaseModel):
    """
    Respuesta del login:
    token + datos del usuario.
    """
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ============================================================
# SCHEMA: MENSAJES GENERALES
# ============================================================
class Message(BaseModel):
    """
    Schema genérico para mensajes.
    """
    message: str = Field(
        examples=["Operación realizada exitosamente"]
    )
