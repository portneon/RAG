import os
import logging
from typing import List
from langchain_community.document_loaders import GoogleDriveLoader
from langchain_core.documents import Document
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

def fetch_documents_from_drive(folder_id: str) -> List[Document]:
    """
    Fetches documents from a specified Google Drive folder.
    Supports Google Docs, PDFs, and TXT files as per LangChain's GoogleDriveLoader.
    """
    logger.info(f"Fetching documents from Google Drive folder: {folder_id}")
    
    try:
        # We assume credentials.json is present in the root directory for Service Account
        # or token.json for OAuth
        # You may need to specify file_types or recursive=True depending on the exact needs
        loader = GoogleDriveLoader(
            folder_id=folder_id,
            recursive=False,
            token_path="token.json"
        )
        
        documents = loader.load()
        logger.info(f"Successfully fetched {len(documents)} documents.")
        return documents
        
    except Exception as e:
        logger.error(f"Failed to fetch documents from Google Drive: {e}")
        raise e
