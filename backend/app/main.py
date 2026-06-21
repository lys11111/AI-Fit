from contextlib import asynccontextmanager

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.model_service import ModelService
from app.schemas import PlanRequest, TrainingFeedbackRequest


settings = get_settings()
model_service = ModelService(
    settings.model_path,
    settings.model_kind,
    deepseek_api_key=settings.deepseek_api_key,
    deepseek_base_url=settings.deepseek_base_url,
    deepseek_model=settings.deepseek_model,
    deepseek_timeout_seconds=settings.deepseek_timeout_seconds,
    yolo_config_dir=settings.yolo_config_dir,
    yolo_python_path=settings.yolo_python_path,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    model_service.load()
    yield


app = FastAPI(title="AI-FIT Local Model API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=(
        r"https?://(localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+)(:\d+)?"
        r"|https://.*\.trycloudflare\.com"
    ),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return model_service.health()


@app.post("/api/plan/generate")
def generate_plan(payload: PlanRequest):
    return model_service.generate_plan(payload)


@app.post("/api/meal/analyze")
def analyze_meal():
    return model_service.analyze_meal()


@app.post("/api/training/feedback")
def analyze_training_feedback(payload: TrainingFeedbackRequest):
    return model_service.analyze_training_feedback(payload)


@app.post("/api/equipment/detect")
async def detect_equipment(image: UploadFile | None = File(default=None)):
    image_bytes = await image.read() if image else None
    return model_service.detect_equipment(image_bytes=image_bytes)


@app.post("/api/form/analyze")
async def analyze_form(frame: UploadFile | None = File(default=None), equipment: str | None = Form(default=None)):
    return model_service.analyze_form(equipment=equipment)

