import os
import logging
from typing import List
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_core.documents import Document
from app.search.vector_store import get_vector_store

logger = logging.getLogger(__name__)

def format_docs(docs: List[Document]) -> str:
    """Format the retrieved documents into a single context string."""
    return "\n\n".join(doc.page_content for doc in docs)

def answer_query(query: str) -> dict:
    """
    Runs the RAG pipeline using LCEL (LangChain Expression Language).
    This avoids dependencies on the langchain.chains module which can be unstable across versions.
    """
    try:
        logger.info(f"Generating answer for query: {query}")
        
        # 1. Initialize LLM
        llm = ChatGroq(
            api_key=os.environ.get("GROQ_API_KEY"),
            model_name="openai/gpt-oss-120b",
            temperature=0.1
        )
        
        # 2. Get Retriever
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 5})
        
        # 3. Define Prompt
        template = """You are an AI assistant capable of answering questions based on the provided context.
Use the following pieces of retrieved context to answer the question.
If you don't know the answer, say that you don't know. Keep the answer concise.

Context:
{context}

Question: {question}

Answer:"""
        prompt = ChatPromptTemplate.from_template(template)
        
        # 4. Build the LCEL Chain
        # We use a slight variation to capture the retrieved documents so we can return sources
        retrieved_docs = retriever.invoke(query)
        context_text = format_docs(retrieved_docs)
        
        # Create a simple chain for generation
        chain = prompt | llm | StrOutputParser()
        
        # Run generation
        answer = chain.invoke({"context": context_text, "question": query})
        
        # 5. Extract unique source file names from metadata
        sources = set()
        for doc in retrieved_docs:
            file_name = doc.metadata.get("file_name", doc.metadata.get("source", "unknown"))
            sources.add(file_name)
            
        return {
            "answer": answer,
            "sources": list(sources)
        }
        
    except Exception as e:
        logger.error(f"Error in RAG pipeline: {e}")
        raise e
