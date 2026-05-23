from fastapi import APIRouter, Query

from app.config import settings
from app.core.embeddings import get_embeddings
from app.core.vectorstore import load_vectorstore
from app.services.qa_service import answer_query

router = APIRouter()


@router.post("/query")
def query_document(q: str = Query(...)):
    embeddings = get_embeddings()
    db = load_vectorstore(settings.VECTOR_DB_PATH, embeddings)

    if db is None:
        return {
            "response": "No company document has been uploaded yet. Please upload a document first."
        }

    retriever = db.as_retriever(search_kwargs={"k": 6})
    docs = retriever.get_relevant_documents(q)

    response = answer_query(q, docs)

    return {"response": response}
