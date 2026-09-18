from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.services.hacker_ai_service import hacker_ai_service
from app.schemas.hacker_ai import SearchResult, SourceEvidence, HackerAIResponse

class RAGService:
    def search(self, query: str, top_k: int = 5) -> list[SearchResult]:
        query_embedding = embedding_service.get_embedding(query)
        
        results = vector_store.search(query_embedding, top_k)
        
        search_results = []
        if not results['ids'] or not results['ids'][0]:
            return search_results
            
        for i in range(len(results['ids'][0])):
            search_results.append(SearchResult(
                row_id=results['ids'][0][i],
                filename=results['metadatas'][0][i].get('filename', 'Unknown'),
                case_id=results['metadatas'][0][i].get('case_id', 'Unknown'),
                content=results['documents'][0][i],
                score=1.0 - (results['distances'][0][i] if 'distances' in results and results['distances'] else 0.0) # Convert distance to similarity
            ))
            
        return search_results

    def ask(self, question: str) -> HackerAIResponse:
        # Retrieve top 5 most relevant documents
        search_results = self.search(question, top_k=5)
        
        if not search_results:
            return HackerAIResponse(
                question=question,
                answer="Insufficient evidence in the uploaded dataset. Please upload some CSV data first.",
                sources=[]
            )
            
        # Build context from retrieved records
        context_parts = []
        sources = []
        
        for idx, res in enumerate(search_results):
            context_parts.append(f"[Record {idx+1}] (File: {res.filename}, Case: {res.case_id}, Row: {res.row_id}):\n{res.content}")
            sources.append(SourceEvidence(
                filename=res.filename,
                row_id=res.row_id,
                case_id=res.case_id,
                content=res.content
            ))
            
        context_text = "\n\n".join(context_parts)
        
        # Send to Hacker AI
        answer = hacker_ai_service.ask(question, context_text)
        
        return HackerAIResponse(
            question=question,
            answer=answer,
            sources=sources
        )

rag_service = RAGService()
