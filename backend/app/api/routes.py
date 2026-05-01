import os
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from app.connectors.gdrive import fetch_documents_from_drive
from app.processing.chunker import process_and_chunk_documents
from app.search.vector_store import store_documents
from app.rag.pipeline import answer_query

logger = logging.getLogger(__name__)

router = APIRouter()

class SyncDriveRequest(BaseModel):
    folder_id: str = None

class AskRequest(BaseModel):
    query: str

class AskResponse(BaseModel):
    answer: str
    sources: List[str]
@router.get("/health")
async def health_check():
    return {"status": "ok"}
@router.post("/sync-drive")
async def sync_drive(request: SyncDriveRequest = None):
    """
    Fetches documents from Google Drive, chunks them, and stores them in FAISS.
    Uses the Folder ID from .env if not provided in the request.
    """
    try:
        folder_id = (request.folder_id if request else None) or os.getenv("GOOGLE_DRIVE_FOLDER_ID")
        
        if not folder_id or folder_id == "your_folder_id_here":
            raise HTTPException(status_code=400, detail="Google Drive Folder ID not configured in .env")

        logger.info(f"Starting sync for folder: {folder_id}")
        # 1. Fetch from Drive
        docs = fetch_documents_from_drive(folder_id)
        if not docs:
            return {"message": "No documents found in the specified folder.", "count": 0}
            
        # 2. Chunk documents
        chunked_docs = process_and_chunk_documents(docs)
        
        # 3. Embed and store in FAISS
        store_documents(chunked_docs)
        
        return {
            "message": "Successfully synchronized and stored documents.",
            "documents_processed": len(docs),
            "chunks_created": len(chunked_docs)
        }
    except Exception as e:
        logger.error(f"Error during sync-drive: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ask", response_model=AskResponse)
async def ask_question(request: AskRequest):
    """
    Answers a query based on the ingested Google Drive documents.
    """
    try:
        if not request.query.strip():
            raise HTTPException(status_code=400, detail="Query cannot be empty.")
            
        logger.info(f"Received query: {request.query}")
        result = answer_query(request.query)
        
        return AskResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        logger.error(f"Error during ask: {e}")
        raise HTTPException(status_code=500, detail=str(e))