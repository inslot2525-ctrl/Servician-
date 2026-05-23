import os
import shutil
from fastapi import APIRouter, UploadFile, File

from langchain_community.vectorstores import FAISS

from app.config import settings
from app.services.document_loader import load_document
from app.services.chunking import split_documents
from app.core.embeddings import get_embeddings
from app.core.vectorstore import save_vectorstore

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    os.makedirs(settings.DOCUMENT_PATH, exist_ok=True)

    file_path = os.path.join(settings.DOCUMENT_PATH, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    docs = load_document(file_path)
    chunks = split_documents(docs)

    embeddings = get_embeddings()
    db = FAISS.from_documents(chunks, embeddings)

    save_vectorstore(db, settings.VECTOR_DB_PATH)

    return {
        "message": "Document uploaded and processed successfully.",
        "chunks_created": len(chunks),
        "filename": file.filename,
    }
