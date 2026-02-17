from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError

from core.config import settings
from core.database import engine, Base
from core.logger import logger

# 👇 IMPORTAR MODELOS AQUÍ (IMPORTANTE)
import models.user_model
import models.note_model
from routes.note_routes import router as note_router
from routes.user_routes import router as user_router


app = FastAPI(
    title="Mini Notas API",
    version="1.0.0"
)

# ==============================
# CORS
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/auth", tags=["Auth"])
app.include_router(note_router, prefix="/notes", tags=["Notes"])


# ==============================
# Evento de inicio (startup)
# ==============================
@app.on_event("startup")
def startup_event():
    try:
        # Crear tablas
        Base.metadata.create_all(bind=engine)
        logger.info("Tablas creadas/verificadas correctamente")

        # Verificar conexión DB
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))

        logger.info("Conexión a la base de datos verificada correctamente")

    except SQLAlchemyError:
        logger.critical("Error crítico al iniciar la aplicación", exc_info=True)
        raise RuntimeError("Error al iniciar la aplicación")


# ==============================
# Endpoint raíz
# ==============================
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "API funcionando correctamente"
    }


@app.get("/test-db")
def test_db():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            value = result.scalar()
        return {
            "database": "connected",
            "result": value
        }
    except SQLAlchemyError:
        logger.error("Error al probar conexión con DB", exc_info=True)
        return {"database": "error"}

