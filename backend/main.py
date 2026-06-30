from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import zones, recommendations, budget

app = FastAPI(
    title="UrbanCool Decision-Support API",
    description="Minimal FastAPI structural stub demonstrating back-end routing, geo-allocations, and optimization structures.",
    version="1.0.0"
)

# Enable CORS for Next.js dev server running on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(zones.router)
app.include_router(recommendations.router)
app.include_router(budget.router)

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "service": "urban-cool-api",
        "version": "1.0.0",
        "endpoints": {
            "swagger_docs": "/docs",
            "health_check": "/"
        }
    }
