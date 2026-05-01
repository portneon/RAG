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
        import json
        from google.oauth2.credentials import Credentials
        
        # Manually load credentials to ensure they are valid
        with open("token.json", "r") as f:
            creds_data = json.load(f)
            
        creds = Credentials.from_authorized_user_info(creds_data)
        
        loader = GoogleDriveLoader(
            folder_id=folder_id,
            recursive=False,
            credentials=creds # Pass the loaded credentials object directly
        )
        
        documents = loader.load()
        logger.info(f"Successfully fetched {len(documents)} documents.")
        return documents
        
    except Exception as e:
        logger.error(f"Failed to fetch documents from Google Drive: {e}")
        raise e
