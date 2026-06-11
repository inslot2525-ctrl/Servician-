from google import genai
from app.config import settings

def generate_response(prompt: str) -> str:
    if not settings.GOOGLE_API_KEY:
        return "Missing GOOGLE_API_KEY. Set it in .env."

    try:
        client = genai.Client(api_key=settings.GOOGLE_API_KEY)
        response = client.models.generate_content(
            model=settings.GOOGLE_MODEL,
            contents=prompt
        )
        if getattr(response, "text", None):
            return response.text
        return "No response generated."
    except Exception as e:
        return f"Google API error: {str(e)}"
