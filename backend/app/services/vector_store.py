import chromadb
from app.config import get_settings
import os

settings = get_settings()

class VectorStore:
    def __init__(self):
        # Ensure the directory exists
        os.makedirs(settings.VECTOR_DB_PATH, exist_ok=True)
        
        # Initialize ChromaDB Persistent Client
        self.client = chromadb.PersistentClient(path=settings.VECTOR_DB_PATH)
        
        # Get or create the collection
        self.collection = self.client.get_or_create_collection(
            name="network_hunter_records",
            metadata={"hnsw:space": "cosine"} # Use cosine similarity
        )

    def add_documents(self, ids: list[str], documents: list[str], embeddings: list[list[float]], metadatas: list[dict]):
        self.collection.upsert(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

    def search(self, query_embedding: list[float], top_k: int = 5):
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        return results

vector_store = VectorStore()
