from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, cases, hacker_ai_routes, evidence, graph, timeline, audit

# Create all database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="THE NETWORK HUNTER API",
    description="Evidence-first investigation and relationship intelligence platform",
    version="2.0.0"
)

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ───
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(hacker_ai_routes.router)
app.include_router(evidence.router)
app.include_router(graph.router)
app.include_router(timeline.router)
app.include_router(audit.router)

@app.get("/")
def read_root():
    return {"message": "THE NETWORK HUNTER API", "version": "2.0.0"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
