from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import upload, query, complaints

app = FastAPI(title="Careflow API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(upload.router)
app.include_router(query.router)
app.include_router(complaints.router)


@app.get("/")
def root():
    return {"message": "Careflow backend is running"}