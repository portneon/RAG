from typing import List
import logging
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

logger = logging.getLogger(__name__)

def process_and_chunk_documents(documents: List[Document], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Document]:
    """
    Processes a list of documents by splitting them into smaller chunks.
    Ensures that metadata (doc_id, file_name, source) is preserved and attached.
    """
    logger.info(f"Chunking {len(documents)} documents. Size: {chunk_size}, Overlap: {chunk_overlap}")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunked_docs = []
    
    for doc in documents:
        # Normalize and clean text slightly if needed
        clean_text = doc.page_content.replace("\x00", "") # Remove null bytes
        
        # We ensure metadata contains specific keys as required by the assignment
        metadata = doc.metadata.copy()
        metadata["source"] = metadata.get("source", "gdrive")
        # Extract file name if not explicitly set (GoogleDriveLoader often sets 'title' or 'source')
        metadata["file_name"] = metadata.get("title", metadata.get("source", "unknown"))
        metadata["doc_id"] = metadata.get("id", "unknown")
        
        chunks = text_splitter.split_text(clean_text)
        
        for i, chunk in enumerate(chunks):
            chunk_metadata = metadata.copy()
            chunk_metadata["chunk_index"] = i
            chunked_docs.append(Document(page_content=chunk, metadata=chunk_metadata))
            
    logger.info(f"Generated {len(chunked_docs)} chunks.")
    return chunked_docs
