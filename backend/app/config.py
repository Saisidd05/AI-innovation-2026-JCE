from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # Database configuration for legacy auth (if needed)
    DATABASE_URL: str = "sqlite:///./network_hunter.db"
    
    # RAG Configuration
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama3-8b-8192"
    VECTOR_DB_PATH: str = "./data/chroma_db"
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"
    
    # Authentication (retained)
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

@lru_cache()
def get_settings():
    return Settings()
