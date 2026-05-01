import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

# Cache the embedder instance
_embedder_instance = None

def get_embedder() -> GoogleGenerativeAIEmbeddings:
    """
    Returns an instance of GoogleGenerativeAIEmbeddings.
    This uses an API call and consumes negligible RAM compared to local models.
    """
    global _embedder_instance
    if _embedder_instance is None:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
            
        _embedder_instance = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
    return _embedder_instance
