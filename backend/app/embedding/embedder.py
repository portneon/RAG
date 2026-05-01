import logging
from langchain_community.embeddings import HuggingFaceEmbeddings
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

# Cache the embedder instance to avoid reloading it constantly
_embedder_instance = None

def get_embedder() -> HuggingFaceEmbeddings:
    """
    Returns an instance of the HuggingFaceEmbeddings model using sentence-transformers.
    Model 'all-MiniLM-L6-v2' is small, fast, and highly effective for general purpose RAG.
    """
    global _embedder_instance
    if _embedder_instance is None:
        logger.info("Initializing HuggingFaceEmbeddings model (all-MiniLM-L6-v2)...")
        # You can change the model name to any other compatible sentence-transformer model
        _embedder_instance = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return _embedder_instance
