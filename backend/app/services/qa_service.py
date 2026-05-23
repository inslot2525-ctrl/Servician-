from app.core.llm import generate_response


def answer_query(query: str, docs):
    if not docs:
        return "No relevant document content found."

    context = "\n\n".join(
        [
            f"Source: {doc.metadata.get('source', 'unknown')}, Page: {doc.metadata.get('page', 'N/A')}\n{doc.page_content}"
            for doc in docs
        ]
    )

    prompt = f"""
You are Careflow, an AI customer support assistant.

Answer the user question using ONLY the provided company document context.

Rules:
- If the answer exists in the context, answer clearly.
- If the answer is not present, say: "I could not find this information in the uploaded company documents."
- Mention source/page if available.
- Keep the answer simple and useful.

Context:
{context}

User question:
{query}

Answer:
"""

    return generate_response(prompt)
