import groq
import httpx
from app.config import get_settings

settings = get_settings()

SYSTEM_PROMPT = """You are "Hacker AI — Evidence-Grounded Investigation Assistant". 
Answer only using the provided retrieved records. Do not invent facts, relationships, people, cases, or events.
Do not declare anyone guilty or criminal. Clearly mention uncertainty and cite the source filename, row ID, and case ID whenever available.
If the retrieved context does not contain enough information, say that the available evidence is insufficient.
When summarizing information, explicitly distinguish between:
- Observed (raw data points from records)
- Verified (corroborated facts)
- Inferred (logical deductions based purely on evidence)
- Flagged (anomalies or potential risks)"""

class HackerAIService:
    def __init__(self):
        self.client = None
        self.model = settings.GROQ_MODEL
        try:
            if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
                # Create httpx client without proxies argument to avoid httpx version mismatch
                http_client = httpx.Client(timeout=30.0)
                self.client = groq.Groq(api_key=settings.GROQ_API_KEY, http_client=http_client)
        except Exception as e:
            print(f"Warning: Groq client init failed: {e}")
            self.client = None

    def ask(self, question: str, context: str) -> str:
        if not context or context.strip() == "":
            return "No matching evidence rows found in the vector database for your query. Please upload a dataset or refine search terms."

        prompt = f"Context records:\n{context}\n\nQuestion:\n{question}"

        if self.client:
            try:
                response = self.client.chat.completions.create(
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    model=self.model,
                    temperature=0.0
                )
                return response.choices[0].message.content
            except Exception as e:
                print(f"Groq API call error: {e}")

        # Grounded fallback synthesizer if Groq API key is not present or call fails
        return f"### Grounded Evidence Retrieval Summary\n\nBased on retrieved vector records for query **'{question}'**:\n\n{context}\n\n*Note: Configure GROQ_API_KEY in backend/.env to enable LLM synthesis.*"

hacker_ai_service = HackerAIService()
