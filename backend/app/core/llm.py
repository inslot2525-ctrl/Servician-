import requests
from app.config import settings


def generate_response(prompt: str) -> str:
    try:
        response = requests.post(
            settings.OLLAMA_URL,
            json={
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
            },
            timeout=120,
        )

        response.raise_for_status()
        return response.json().get("response", "No response generated.")

    except requests.exceptions.RequestException as e:
        return f"Ollama API error: {str(e)}"
