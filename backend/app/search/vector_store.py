import os
import logging
from typing import List
from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document
from app.embedding.embedder import get_embedder

logger = logging.getLogger(__name__)

FAISS_INDEX_PATH = "faiss_index"

def store_documents(documents: List[Document]):
    """
    Takes chunked documents, embeds them, and stores them in FAISS locally.
    """
    logger.info("Generating embeddings and storing in FAISS vector database...")
    embedder = get_embedder()
    
    if os.path.exists(FAISS_INDEX_PATH):
        logger.info(f"Loading existing FAISS index from {FAISS_INDEX_PATH}")
        # allow_dangerous_deserialization is needed for loading FAISS indexes saved via pickle in newer versions
        vector_store = FAISS.load_local(FAISS_INDEX_PATH, embedder, allow_dangerous_deserialization=True)
        vector_store.add_documents(documents)
    else:
        logger.info("Creating new FAISS index")
        vector_store = FAISS.from_documents(documents, embedder)
        
    vector_store.save_local(FAISS_INDEX_PATH)
    logger.info("FAISS index saved successfully.")

def get_vector_store() -> FAISS:
    """
    Loads the FAISS index for retrieval.
    """
    if not os.path.exists(FAISS_INDEX_PATH):
        raise FileNotFoundError("FAISS index not found. Please sync documents first using /sync-drive.")
        
    logger.info(f"Loading FAISS index from {FAISS_INDEX_PATH} for retrieval.")
    embedder = get_embedder()
    return FAISS.load_local(FAISS_INDEX_PATH, embedder, allow_dangerous_deserialization=True)
