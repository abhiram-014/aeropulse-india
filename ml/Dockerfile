FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model
COPY app ./app
COPY models ./models

# Render injects PORT at runtime; fallback 8000 for local usage
ENV PORT=8000
EXPOSE $PORT

# uvicorn reads $PORT at startup so it binds correctly on Render
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
