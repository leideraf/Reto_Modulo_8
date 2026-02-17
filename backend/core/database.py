from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import SQLAlchemyError

from core.config import settings
from core.logger import logger

try:
    engine = create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
    )

    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    Base = declarative_base()

    logger.info("Conexión a PostgreSQL establecida correctamente")

except SQLAlchemyError as e:
    logger.critical(
        "Error crítico al conectar con la base de datos",
        exc_info=True,
    )
    raise RuntimeError(
        f"Error al conectar con la base de datos: {str(e)}"
    )


def get_db():
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError:
        db.rollback()
        logger.error(
            "Error durante operación en base de datos",
            exc_info=True,
        )
        raise
    finally:
        db.close()

