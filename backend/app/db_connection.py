import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        raise RuntimeError(
            "DATABASE_URL environment variable is not set. "
            "Create a .env file with DATABASE_URL=postgresql://... for local dev, "
            "or set it in your Railway dashboard for production."
        )
    conn = psycopg2.connect(database_url)
    return conn