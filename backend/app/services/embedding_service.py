from sentence_transformers import SentenceTransformer
from app.config import get_settings

settings = get_settings()

class EmbeddingService:
    def __init__(self):
        # Initialize the model once
        self.model = SentenceTransformer(settings.EMBEDDING_MODEL)

    def get_embedding(self, text: str) -> list[float]:
        # Generate the embedding and convert to list of floats for ChromaDB
        return self.model.encode(text).tolist()

# Singleton instance
embedding_service = EmbeddingService()
