from datetime import datetime, timedelta, timezone
from jose import JWTError, jwt
from fastapi import HTTPException, status

from core.config import settings
from core.logger import logger


# ============================================================
# CREAR TOKEN JWT
# ============================================================
def create_access_token(data: dict) -> str:
    """
    Genera un JWT firmado con SECRET_KEY.
    El 'data' normalmente incluirá:
        {
            "sub": email,
            "user_id": id
        }
    """

    to_encode = data.copy()

    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

    return encoded_jwt


# ============================================================
# DECODIFICAR Y VALIDAR TOKEN
# ============================================================
def verify_token(token: str) -> dict:
    """
    Decodifica el JWT y valida su firma y expiración.
    Devuelve el payload si es válido.
    """

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return payload

    except JWTError:
        logger.warning("Token inválido o expirado")

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"},
        )

