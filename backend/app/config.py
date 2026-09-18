from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # Database configuration (Defaults to SQLite for easy local dev if not provided)
    DATABASE_URL: str = "sqlite:///./network_hunter.db"
    
    # JWT Auth
    SECRET_KEY: str = "secret"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Groq API
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-70b-8192"

    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    return Settings()
