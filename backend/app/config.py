import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    OLLAMA_URL = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
    OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gpt-oss:120b-cloud")
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
    GOOGLE_MODEL = os.getenv("GOOGLE_MODEL", "gemini-1.5-flash")
    EMBEDDING_MODEL = os.getenv(
        "EMBEDDING_MODEL",
        "sentence-transformers/paraphrase-MiniLM-L3-v2",
    )
    VECTOR_DB_PATH = "data/vectorstore"
    DOCUMENT_PATH = "data/documents"
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200


settings = Settings()
