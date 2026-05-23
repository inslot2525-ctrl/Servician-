from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings


def split_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
    )

    return splitter.split_documents(docs)
