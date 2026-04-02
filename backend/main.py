import os

from fastapi.responses import FileResponse
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.analysis import router as analysis_router
from app.routes.auth import router as auth_router
from app.routes.post import router as institution_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발 중에는 일단 이렇게
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(institution_router, prefix="/api")
app.include_router(analysis_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.mount("/", StaticFiles(directory="./static", html=True), name="static")
# app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="static")


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
