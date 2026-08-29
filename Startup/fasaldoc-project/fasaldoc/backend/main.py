"""
FasalDoc Backend - FastAPI Skeleton
Serves the trained crop disease model and returns diagnosis + remedy info.

Run locally with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000

Then test at http://localhost:8000/docs (FastAPI auto-generates interactive docs)
"""

import io
import json
from pathlib import Path

import numpy as np
import tensorflow as tf
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

# ---------------------------------------------------------
# CONFIG
# ---------------------------------------------------------
MODEL_PATH = "fasaldoc_model.keras"       # from training script
CLASS_NAMES_PATH = "class_names.json"     # save this list during/after training
REMEDY_DB_PATH = "remedy_database.json"   # disease -> remedy mapping
IMG_SIZE = (224, 224)
CONFIDENCE_THRESHOLD = 0.5                # below this, return "unclear" instead of a guess

# ---------------------------------------------------------
# APP SETUP
# ---------------------------------------------------------
app = FastAPI(title="FasalDoc API", version="0.1.0")

# Allow the mobile app to call this API during development.
# Tighten this to your actual app's origin before going to production.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# LOAD MODEL + DATA AT STARTUP
# ---------------------------------------------------------
model = None
class_names = []
remedy_db = {}


@app.on_event("startup")
def load_resources():
    global model, class_names, remedy_db

    if Path(MODEL_PATH).exists():
        model = tf.keras.models.load_model(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    else:
        print(f"WARNING: {MODEL_PATH} not found - /predict will fail until it's added.")

    if Path(CLASS_NAMES_PATH).exists():
        with open(CLASS_NAMES_PATH) as f:
            class_names.extend(json.load(f))
        print(f"Loaded {len(class_names)} class names")
    else:
        print(f"WARNING: {CLASS_NAMES_PATH} not found.")

    if Path(REMEDY_DB_PATH).exists():
        with open(REMEDY_DB_PATH) as f:
            remedy_db.update(json.load(f))
        print(f"Loaded remedy entries for {len(remedy_db)} conditions")
    else:
        print(f"WARNING: {REMEDY_DB_PATH} not found - remedies won't be returned.")


# ---------------------------------------------------------
# RESPONSE MODELS
# ---------------------------------------------------------
class Remedy(BaseModel):
    organic: str | None = None
    chemical: str | None = None
    dosage: str | None = None
    local_products: list[str] = []


class PredictionResponse(BaseModel):
    disease: str
    confidence: float
    is_confident: bool
    remedy: Remedy | None = None


# ---------------------------------------------------------
# HELPERS
# ---------------------------------------------------------
def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Convert uploaded image bytes into a model-ready array."""
    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read image file.")

    image = image.resize(IMG_SIZE)
    arr = tf.keras.utils.img_to_array(image)
    arr = np.expand_dims(arr, axis=0)  # add batch dimension
    return arr


def get_remedy(disease_name: str) -> Remedy | None:
    entry = remedy_db.get(disease_name)
    if not entry:
        return None
    return Remedy(**entry)


# ---------------------------------------------------------
# ROUTES
# ---------------------------------------------------------
@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "classes_loaded": len(class_names),
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded on server yet.")

    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    image_bytes = await file.read()
    arr = preprocess_image(image_bytes)

    predictions = model.predict(arr)[0]  # shape: (num_classes,)
    top_idx = int(np.argmax(predictions))
    confidence = float(predictions[top_idx])

    disease_name = class_names[top_idx] if class_names else f"class_{top_idx}"
    is_confident = confidence >= CONFIDENCE_THRESHOLD

    return PredictionResponse(
        disease=disease_name,
        confidence=round(confidence, 4),
        is_confident=is_confident,
        remedy=get_remedy(disease_name) if is_confident else None,
    )


@app.get("/diseases")
def list_diseases():
    """Returns all diseases the model currently knows about - useful for app dropdowns/docs."""
    return {"classes": class_names}


# ---------------------------------------------------------
# NEXT STEPS (don't skip these):
# 1. After training, save class_names as a JSON list matching train_ds.class_names order:
#       import json
#       json.dump(class_names, open("class_names.json", "w"))
# 2. Build remedy_database.json - one entry per disease class, e.g.:
#       {
#         "Tomato___Early_blight": {
#           "organic": "Neem oil spray, remove affected leaves",
#           "chemical": "Chlorothalonil-based fungicide",
#           "dosage": "As per product label, typically every 7-10 days",
#           "local_products": ["Score 250 EC", "Antracol"]
#         }
#       }
#    IMPORTANT: get this validated by an agronomist before relying on it -
#    wrong dosage/remedy is a real liability, not just a UX detail.
# 3. Add authentication/rate-limiting before any public deployment.
# 4. Containerize with Docker once this is stable (Dockerfile next if needed).
# ---------------------------------------------------------
