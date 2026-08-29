# FasalDoc Backend - Dockerfile
# Multi-stage build not needed yet at this scale, but keep the image lean.

FROM python:3.11-slim

WORKDIR /app

# System deps needed by Pillow/TensorFlow for image handling
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python deps first (better layer caching - only reinstalls if requirements.txt changes)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code and model artifacts
COPY main.py .
COPY fasaldoc_model.keras .
COPY class_names.json .
COPY remedy_database.json .

EXPOSE 8000

# --host 0.0.0.0 is required so the API is reachable from outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
