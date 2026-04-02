FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY ./frontend/package*.json .
RUN npm install

COPY ./frontend/public ./public
COPY ./frontend/src ./src
COPY ./frontend/index.html ./index.html
RUN npm run build

FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app
COPY backend/pyproject.toml ./
COPY backend/.python-version ./
RUN uv sync

COPY backend/data ./data
COPY backend/scripts ./scripts
COPY backend/src ./src
COPY backend/main.py ./main.py
COPY backend/serviceAccountKey.json ./serviceAccountKey.json

COPY --from=frontend-builder /app/frontend/dist ./static

RUN uv pip install -e .
RUN uv run scripts/init_data.py

ENV FIREBASE_API_KEY AIzaSyCFgu7JQabI46Zee4uw8WjW5R1_J9x-ifM
CMD ["uv", "run", "main.py"]
