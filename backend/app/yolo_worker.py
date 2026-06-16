import json
import os
import sys
from pathlib import Path
from typing import Any


SUPPORTED_EQUIPMENT = [
    "Chest Press machine",
    "Lat Pull Down",
    "Seated Cable Rows",
    "arm curl machine",
    "chest fly machine",
    "chinning dipping",
    "lateral raises machine",
    "leg extension",
    "leg press",
    "reg curl machine",
    "seated dip machine",
    "shoulder press machine",
    "smith machine",
]


def write_message(payload: dict[str, Any]) -> None:
    sys.stdout.write(json.dumps(payload, ensure_ascii=False) + "\n")
    sys.stdout.flush()


def detect(model: Any, names: dict[int, str], image_path: str) -> list[dict[str, Any]]:
    results = model(image_path, verbose=False)
    class_confidence: dict[str, float] = {}

    for result in results:
        boxes = getattr(result, "boxes", None)
        if boxes is None:
            continue

        class_values = boxes.cls.tolist() if boxes.cls is not None else []
        confidence_values = boxes.conf.tolist() if boxes.conf is not None else []

        for class_value, confidence_value in zip(class_values, confidence_values, strict=False):
            label = names.get(int(class_value), str(int(class_value)))
            if label not in SUPPORTED_EQUIPMENT:
                continue
            confidence = float(confidence_value)
            class_confidence[label] = max(confidence, class_confidence.get(label, 0.0))

    return [
        {"label": label, "confidence": confidence}
        for label, confidence in sorted(class_confidence.items(), key=lambda item: item[1], reverse=True)
    ]


def main() -> int:
    if len(sys.argv) < 2:
        write_message({"ok": False, "error": "model path argument is required"})
        return 2

    model_path = Path(sys.argv[1])
    if not model_path.exists():
        write_message({"ok": False, "error": f"model file not found: {model_path}"})
        return 2

    config_dir = os.environ.get("YOLO_CONFIG_DIR")
    if config_dir:
        Path(config_dir).mkdir(parents=True, exist_ok=True)

    from ultralytics import YOLO

    model = YOLO(str(model_path))
    names = {int(index): str(name) for index, name in model.names.items()}
    write_message({"ok": True, "ready": True, "names": names})

    for line in sys.stdin:
        try:
            request = json.loads(line)
            image_path = request["imagePath"]
            candidates = detect(model, names, image_path)
            write_message({"ok": True, "candidates": candidates})
        except Exception as exc:
            write_message({"ok": False, "error": str(exc)})

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
