import os
from langchain_community.vectorstores import FAISS


def save_vectorstore(db, path: str):
    os.makedirs(path, exist_ok=True)
    db.save_local(path)


def load_vectorstore(path: str, embeddings):
    if not os.path.exists(path):
        return None

    try:
        return FAISS.load_local(
            path,
            embeddings,
            allow_dangerous_deserialization=True
        )
    except Exception:
        return None
