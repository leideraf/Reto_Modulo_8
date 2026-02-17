import logging
import os
from logging.handlers import TimedRotatingFileHandler


def init_logger(name: str = "app") -> logging.Logger:
    """
    Inicializa el sistema de logging con rotación diaria.
    Guarda logs en /logs/app.log
    """

    os.makedirs("logs", exist_ok=True)

    logger = logging.getLogger(name)
    logger.setLevel(logging.INFO)
    logger.propagate = False  # evita duplicación con uvicorn

    if not logger.handlers:
        handler = TimedRotatingFileHandler(
            filename="logs/app.log",
            when="midnight",
            backupCount=7,
            encoding="utf-8",
        )

        formatter = logging.Formatter(
            "%(asctime)s | %(levelname)s | %(name)s | %(message)s"
        )

        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


logger = init_logger()
