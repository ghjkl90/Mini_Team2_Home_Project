import uvicorn
from fastapi import FastAPI
from routes.post import router as institution_router

app = FastAPI()

app.include_router(institution_router)

if __name__ == "__main__" :
    uvicorn.run("main:app", host="0.0.0.0", port=6000, reload=True)