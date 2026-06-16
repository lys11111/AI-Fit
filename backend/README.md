# AI-FIT Backend Integration Kit

This backend is designed for local preview before merging anything into the
GitHub repository.

## What it does

- Runs a FastAPI server on `http://localhost:8000`
- Loads your local model through `MODEL_PATH`
- Exposes `/health`, `/api/plan/generate`, `/api/meal/analyze`, and
  `/api/training/feedback`
- Calls DeepSeek for questionnaire-driven training plans when `DEEPSEEK_API_KEY`
  is configured, with a local fallback when the API is unavailable
- Validates generated exercises against the 13 equipment classes supported by
  the current demo recognition model
- Keeps the model file out of Git by default

## Local setup

```powershell
cd backend
py -3.10 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env`:

```text
MODEL_PATH=E:\path\to\your\model.pt
MODEL_KIND=torch
DEEPSEEK_API_KEY=sk-your-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-v4-flash
YOLO_PYTHON_PATH=E:\miniconda\envs\yolo\python.exe
YOLO_CONFIG_DIR=E:\AI-Fit\AI-Fit\.yolo-config
```

Then start:

```powershell
uvicorn app.main:app --reload --port 8000
```

If Ultralytics is installed only in the dedicated YOLO conda environment,
keep running the FastAPI backend from `backend\.venv`; it will start a
persistent YOLO worker through `YOLO_PYTHON_PATH` and load `MODEL_PATH` once.
For another demo computer, update only `MODEL_PATH`, `YOLO_PYTHON_PATH`, and
`YOLO_CONFIG_DIR` in `backend\.env`.

## Model adapter

Edit `app/model_service.py` to match your real trained model input and output.
The current implementation is intentionally conservative: it returns useful
fallback results until the actual model loading code is filled in.
