import google.generativeai as genai

from app.config import settings


def generate_response(prompt: str) -> str:
    if not settings.GOOGLE_API_KEY:
        return "Missing GOOGLE_API_KEY. Set it in .env."

    try:
        genai.configure(api_key=settings.GOOGLE_API_KEY)
        model = genai.GenerativeModel(settings.GOOGLE_MODEL)
        result = model.generate_content(prompt)
        if getattr(result, "text", None):
            return result.text
        return "No response generated."
    except Exception as e:
        return f"Google API error: {str(e)}"
