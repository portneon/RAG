from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.api.routes import router

# Load environment variables
load_dotenv()

app = FastAPI(title="Highwatch AI RAG System API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (change this to specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allows all headers
)

@app.get("/")
async def root():
    return {
        "message": "Welcome to the Highwatch AI RAG API! Please use the /docs endpoint to interact with the API.",
        "documentation_url": "http://127.0.0.1:8000/docs"
    }

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
