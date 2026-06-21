import json
import os
import subprocess
import re
import tempfile
import threading
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any

from app.schemas import (
    EquipmentDetectionResponse,
    FormAnalysisResponse,
    MealAnalysisResponse,
    PlanRequest,
    PlanResponse,
    TrainingFeedbackRequest,
    TrainingFeedbackResponse,
)


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

EQUIPMENT_NAMES_ZH = {
    "Chest Press machine": "坐姿推胸",
    "Lat Pull Down": "正握宽距高位下拉",
    "Seated Cable Rows": "坐姿绳索划船",
    "arm curl machine": "二头弯举机",
    "chest fly machine": "蝴蝶机夹胸",
    "chinning dipping": "引体双杠辅助",
    "lateral raises machine": "侧平举机",
    "leg extension": "坐姿腿屈伸",
    "leg press": "腿举机",
    "reg curl machine": "腿弯举机",
    "seated dip machine": "坐姿臂屈伸",
    "shoulder press machine": "肩推机",
    "smith machine": "史密斯机",
}

EQUIPMENT_FORM_RULES = {
    "Chest Press machine": {
        "camera": "推荐机位：前侧方 45°，距离 2.0-2.8 米，镜头在胸口到肩部。",
        "framing": "头、肩、肘、腕、髋和手柄轨迹完整入框。",
        "focus": ["耸肩推", "肘轨迹过高或过低", "弓背借力", "左右不同步"],
    },
    "Lat Pull Down": {
        "camera": "推荐机位：前侧方 30-45°，距离 2.3-3.0 米，镜头在胸口。",
        "framing": "头、肩、肘、腕、髋和下拉轨迹完整入框。",
        "focus": ["后仰借力", "耸肩", "粘滞点"],
    },
    "Seated Cable Rows": {
        "camera": "推荐机位：前侧方 45° 或正侧面 90°，距离 2.2-3.0 米。",
        "framing": "头、肩、肘、腕、髋和拉柄水平轨迹完整入框。",
        "focus": ["腰部甩动", "肘部外展", "耸肩"],
    },
    "arm curl machine": {
        "camera": "推荐机位：正侧面 90°，距离 1.8-2.4 米，镜头在肘部到肩部。",
        "framing": "肩、肘、腕、髋和肘垫完整入框。",
        "focus": ["肘离开肘垫", "肩膀前顶", "后仰借力", "半程动作"],
    },
    "chest fly machine": {
        "camera": "推荐机位：正面 0° 或前侧方 15-30°，距离 2.0-2.8 米。",
        "framing": "双肩、双肘、双腕和胸前合拢路径完整入框。",
        "focus": ["肘角变化过大", "耸肩夹胸", "过度后伸", "左右不同步"],
    },
    "chinning dipping": {
        "camera": "推荐机位：辅助引体用正面 0°；辅助臂屈伸用 45-90° 侧面，距离 2.8-3.8 米。",
        "framing": "全身、肩、肘、腕、髋、膝和辅助踏板完整入框。",
        "focus": ["身体摆动", "耸肩", "肘外翻", "踏板反弹借力"],
    },
    "lateral raises machine": {
        "camera": "推荐机位：正面 0°，距离 1.8-2.5 米，镜头在胸口到肩部。",
        "framing": "头、双肩、双肘、双腕和髋完整入框。",
        "focus": ["耸肩", "身体侧倾", "举得过高", "肘太弯或锁死"],
    },
    "leg extension": {
        "camera": "推荐机位：正侧面 90°，距离 2.0-2.6 米，镜头对准膝关节。",
        "framing": "髋、膝、踝和坐垫边缘完整入框。",
        "focus": ["臀部离垫", "踢腿惯性", "行程不足", "膝轴不对"],
    },
    "leg press": {
        "camera": "推荐机位：前侧方 45°，距离 2.6-3.5 米，镜头在膝到髋之间。",
        "framing": "髋、双膝、双踝和脚踏板完整入框。",
        "focus": ["膝内扣", "锁膝", "骨盆卷曲或腰离垫", "左右发力不均"],
    },
    "reg curl machine": {
        "camera": "推荐机位：正侧面 90°，距离 2.0-2.6 米，镜头对准膝关节。",
        "framing": "髋、膝、踝和大腿固定垫完整入框。",
        "focus": ["髋部抬起", "甩腿借惯性", "半程动作", "膝轴不对"],
    },
    "seated dip machine": {
        "camera": "推荐机位：45-90° 侧面，距离 2.0-2.6 米，镜头在肩肘之间。",
        "framing": "肩、肘、腕、髋和手柄完整入框。",
        "focus": ["耸肩下压", "身体弹动", "肘外翻", "手腕塌陷"],
    },
    "shoulder press machine": {
        "camera": "推荐机位：前侧方 45°，距离 2.0-2.8 米，镜头在胸口到肩部。",
        "framing": "头、肩、肘、腕、髋和顶部推举位置完整入框。",
        "focus": ["腰椎反弓", "耸肩推举", "左右不同步", "轨迹偏移"],
    },
    "smith machine": {
        "camera": "初代默认史密斯深蹲：正侧面 90°，距离 2.8-3.8 米，镜头在髋部。",
        "framing": "全身和杠铃固定轨迹完整入框。",
        "focus": ["膝内扣", "躯干塌陷", "深度不足或骨盆卷曲", "杠铃路径异常"],
    },
}

class ModelService:
    def __init__(
        self,
        model_path: str,
        model_kind: str,
        *,
        deepseek_api_key: str = "",
        deepseek_base_url: str = "https://api.deepseek.com",
        deepseek_model: str = "deepseek-v4-flash",
        deepseek_timeout_seconds: int = 45,
        yolo_config_dir: str = ".yolo-config",
        yolo_python_path: str = "",
    ) -> None:
        self.model_path = model_path
        self.model_kind = model_kind
        self.yolo_config_dir = yolo_config_dir
        self.yolo_python_path = yolo_python_path
        self.deepseek_api_key = deepseek_api_key
        self.deepseek_base_url = deepseek_base_url.rstrip("/")
        self.deepseek_model = deepseek_model
        self.deepseek_timeout_seconds = deepseek_timeout_seconds
        self.model: Any | None = None
        self.model_names: dict[int, str] = {}
        self.yolo_worker: subprocess.Popen[str] | None = None
        self.yolo_worker_lock = threading.Lock()
        self.loaded = False
        self.load_error: str | None = None
        self.deepseek_error: str | None = None

    def _read_worker_json(self) -> dict[str, Any]:
        if not self.yolo_worker or not self.yolo_worker.stdout:
            raise RuntimeError("YOLO worker stdout is unavailable")

        ignored_lines: list[str] = []
        for _ in range(20):
            line = self.yolo_worker.stdout.readline()
            if not line:
                break
            try:
                return json.loads(line)
            except json.JSONDecodeError:
                ignored_lines.append(line.strip())

        raise RuntimeError(f"YOLO worker did not return JSON. Ignored output: {' | '.join(ignored_lines)}")

    def load(self) -> None:
        if not self.model_path:
            self.load_error = "MODEL_PATH is empty; using fallback responses."
            return

        path = Path(self.model_path)
        if not path.exists():
            self.load_error = f"Model file not found: {path}"
            return

        try:
            if self.model_kind == "ultralytics-yolo":
                config_dir = Path(self.yolo_config_dir)
                config_dir.mkdir(parents=True, exist_ok=True)
                os.environ.setdefault("YOLO_CONFIG_DIR", str(config_dir.resolve()))

                try:
                    from ultralytics import YOLO

                    self.model = YOLO(str(path))
                    self.model_names = {int(index): str(name) for index, name in self.model.names.items()}
                except Exception as exc:
                    if not self._start_yolo_worker(path, config_dir):
                        if self.load_error:
                            raise RuntimeError(self.load_error) from exc
                        raise exc
            elif self.model_kind == "torch":
                # Fill this in once you confirm the exact model format.
                # Example:
                # import torch
                # self.model = torch.load(path, map_location="cpu")
                # self.model.eval()
                self.model = path
            elif self.model_kind == "onnx":
                # Example:
                # import onnxruntime as ort
                # self.model = ort.InferenceSession(str(path))
                self.model = path
            else:
                self.model = path
            self.loaded = True
            self.load_error = None
        except Exception as exc:
            self.load_error = str(exc)
            self.loaded = False

    def _start_yolo_worker(self, model_path: Path, config_dir: Path) -> bool:
        if not self.yolo_python_path:
            self.load_error = "Ultralytics is not available in backend env and YOLO_PYTHON_PATH is empty."
            return False

        python_path = Path(self.yolo_python_path)
        if not python_path.exists():
            self.load_error = f"YOLO python not found: {python_path}"
            return False

        worker_path = Path(__file__).with_name("yolo_worker.py")
        env = {**os.environ, "YOLO_CONFIG_DIR": str(config_dir.resolve())}
        self.yolo_worker = subprocess.Popen(
            [str(python_path), str(worker_path), str(model_path)],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            env=env,
        )

        try:
            ready_payload = self._read_worker_json()
        except RuntimeError as exc:
            self.load_error = str(exc)
            return False

        if not ready_payload.get("ok"):
            self.load_error = str(ready_payload.get("error", "YOLO worker failed to start"))
            return False

        self.model_names = {int(index): str(name) for index, name in ready_payload.get("names", {}).items()}
        return True

    def health(self) -> dict[str, Any]:
        return {
            "ok": True,
            "modelLoaded": self.loaded,
            "modelKind": self.model_kind,
            "modelPathConfigured": bool(self.model_path),
            "deepseekConfigured": bool(self.deepseek_api_key),
            "deepseekModel": self.deepseek_model,
            "deepseekError": self.deepseek_error,
            "supportedEquipment": SUPPORTED_EQUIPMENT,
            "supportedEquipmentZh": EQUIPMENT_NAMES_ZH,
            "loadError": self.load_error,
        }

    def generate_plan(self, payload: PlanRequest) -> PlanResponse:
        if self.deepseek_api_key:
            try:
                plan = self._generate_plan_with_deepseek(payload)
                self.deepseek_error = None
                return plan
            except Exception as exc:
                self.deepseek_error = str(exc)

        return self._generate_fallback_plan(payload)

    def _generate_fallback_plan(self, payload: PlanRequest) -> PlanResponse:
        focus = payload.focusPreference or "背部发力"
        if "腿" in focus or payload.goal == "提升力量":
            exercises = [
                {"name": "腿举机", "machineClass": "leg press", "sets": 4, "reps": "10-12 次", "focus": "膝髋同步"},
                {"name": "腿屈伸", "machineClass": "leg extension", "sets": 3, "reps": "12-15 次", "focus": "股四头肌控制"},
            ]
        elif "肩" in focus or payload.featurePreference == "AI 动作纠偏":
            exercises = [
                {"name": "肩推机", "machineClass": "shoulder press machine", "sets": 4, "reps": "8-10 次", "focus": "推举轨迹"},
                {"name": "侧平举机", "machineClass": "lateral raises machine", "sets": 3, "reps": "12-15 次", "focus": "中束控制"},
            ]
        else:
            exercises = [
                {"name": "正握宽距高位下拉", "machineClass": "Lat Pull Down", "sets": 4, "reps": "10-12 次", "focus": "肩胛下沉"},
                {"name": "坐姿绳索划船", "machineClass": "Seated Cable Rows", "sets": 3, "reps": "10-12 次", "focus": "躯干稳定"},
            ]

        return PlanResponse(
            title=f"{focus} · 本地模型训练计划",
            summary=(
                f"已根据 {payload.preferredWindow}、{payload.sessionDuration} 和 {payload.equipmentPreference} "
                f"生成计划，今天优先稳定 {focus}。"
            ),
            match="本地模型匹配 92%",
            coachIntro=(
                f"本地模型已读取目标 {payload.goal}、频率 {payload.weeklyFrequency}，"
                f"并把 {focus} 作为训练主线。"
            ),
            nutritionNudge="训练前后保持蛋白补给稳定，再按训练强度微调碳水。",
            focusPreference=focus,
            exercises=exercises,
            rationale=[
                {"label": "训练目标", "value": payload.goal},
                {"label": "训练地点", "value": payload.trainingPlace or "健身房固定器械区"},
                {"label": "训练时间", "value": f"{payload.preferredWindow} · {payload.sessionDuration}"},
                {"label": "器械偏好", "value": payload.equipmentPreference},
                {"label": "训练基础", "value": payload.experienceLevel or "需要先从稳定动作开始"},
                {"label": "主线关注", "value": " · ".join([focus, *payload.trainingTags])},
                {"label": "视觉识别覆盖", "value": " · ".join([exercise["machineClass"] for exercise in exercises])},
            ],
        )

    def _generate_plan_with_deepseek(self, payload: PlanRequest) -> PlanResponse:
        system_prompt = (
            "你是 AI-FIT 的健身计划生成引擎。"
            "你必须只输出 JSON，不要输出 Markdown。"
            "训练计划必须只包含 supportedEquipment 中的器械动作。"
            "exercises 里至少 2 个动作，每个动作必须有 name, machineClass, sets, reps, focus。"
            "machineClass 必须与 supportedEquipment 中的英文字符串完全一致。"
        )
        user_prompt = {
            "userProfile": payload.model_dump(),
            "supportedEquipment": SUPPORTED_EQUIPMENT,
            "requiredJsonShape": {
                "title": "string",
                "summary": "string",
                "match": "string",
                "coachIntro": "string",
                "nutritionNudge": "string",
                "focusPreference": "string",
                "exercises": [
                    {
                        "name": "string",
                        "machineClass": "one supportedEquipment item",
                        "sets": 3,
                        "reps": "string",
                        "focus": "string",
                    }
                ],
                "rationale": [{"label": "string", "value": "string"}],
            },
        }
        request_body = {
            "model": self.deepseek_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(user_prompt, ensure_ascii=False)},
            ],
            "thinking": {"type": "disabled"},
            "response_format": {"type": "json_object"},
        }
        response = self._post_deepseek_chat(request_body)
        content = response["choices"][0]["message"]["content"]
        data = self._extract_json_object(content)
        data["source"] = "deepseek"
        plan = PlanResponse.model_validate(data)

        supported = set(SUPPORTED_EQUIPMENT)
        plan.exercises = [exercise for exercise in plan.exercises if exercise.machineClass in supported]
        if len(plan.exercises) < 2:
            fallback = self._generate_fallback_plan(payload)
            plan.exercises = fallback.exercises
            plan.rationale.append({"label": "动作库校验", "value": "已自动补足视觉模型可识别器械动作"})

        return plan

    def _post_deepseek_chat(self, request_body: dict[str, Any]) -> dict[str, Any]:
        request = urllib.request.Request(
            f"{self.deepseek_base_url}/chat/completions",
            data=json.dumps(request_body).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {self.deepseek_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with urllib.request.urlopen(request, timeout=self.deepseek_timeout_seconds) as response:
                return json.loads(response.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            body = exc.read().decode("utf-8", errors="replace")
            raise RuntimeError(f"DeepSeek API error {exc.code}: {body}") from exc

    def _extract_json_object(self, content: str) -> dict[str, Any]:
        stripped = content.strip()
        if stripped.startswith("```"):
            stripped = re.sub(r"^```(?:json)?", "", stripped)
            stripped = re.sub(r"```$", "", stripped).strip()

        try:
            return json.loads(stripped)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", stripped, flags=re.DOTALL)
            if not match:
                raise
            return json.loads(match.group(0))

    def analyze_meal(self) -> MealAnalysisResponse:
        return MealAnalysisResponse(
            name="本地模型识别餐食",
            slot="午餐",
            calories=520,
            protein=34,
            carbs=58,
            fat=16,
            confidence=0.86,
        )

    def analyze_training_feedback(self, payload: TrainingFeedbackRequest) -> TrainingFeedbackResponse:
        risk_level = "medium" if payload.rpe >= 8 else "low"
        return TrainingFeedbackResponse(
            nextCue=f"下一组先把「{payload.tag}」控制住，减少后半程代偿。",
            riskLevel=risk_level,
            adjustment=f"当前 RPE {payload.rpe}，如果稳定性仍是「{payload.stability}」，下一段建议缩短训练块或降低一档负荷。",
        )

    def _equipment_candidate(self, label: str, confidence: float) -> dict[str, Any]:
        class_id = SUPPORTED_EQUIPMENT.index(label) if label in SUPPORTED_EQUIPMENT else -1
        return {
            "label": label,
            "classId": class_id,
            "confidence": confidence,
            "chineseName": EQUIPMENT_NAMES_ZH.get(label, label),
            "supported": label in SUPPORTED_EQUIPMENT,
        }

    def _fallback_equipment_detection(self, source: str = "backend-fallback") -> EquipmentDetectionResponse:
        candidates = [
            self._equipment_candidate("Lat Pull Down", 0.88),
            self._equipment_candidate("Seated Cable Rows", 0.72),
            self._equipment_candidate("leg press", 0.64),
        ]
        return EquipmentDetectionResponse(**candidates[0], candidates=candidates, source=source)

    def detect_equipment(self, image_bytes: bytes | None = None) -> EquipmentDetectionResponse:
        if self.model_kind == "ultralytics-yolo" and self.loaded and self.model and image_bytes:
            try:
                return self._detect_equipment_with_yolo(image_bytes)
            except Exception as exc:
                self.load_error = f"YOLO inference failed: {exc}"

        if self.model_kind == "ultralytics-yolo" and self.loaded and self.yolo_worker and image_bytes:
            try:
                return self._detect_equipment_with_yolo_worker(image_bytes)
            except Exception as exc:
                self.load_error = f"YOLO worker inference failed: {exc}"

        return self._fallback_equipment_detection()

    def _detect_equipment_with_yolo(self, image_bytes: bytes) -> EquipmentDetectionResponse:
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                temp_file.write(image_bytes)
                temp_path = temp_file.name

            results = self.model(temp_path, verbose=False)
            class_confidence: dict[str, float] = {}

            for result in results:
                boxes = getattr(result, "boxes", None)
                if boxes is None:
                    continue

                class_values = boxes.cls.tolist() if boxes.cls is not None else []
                confidence_values = boxes.conf.tolist() if boxes.conf is not None else []

                for class_value, confidence_value in zip(class_values, confidence_values, strict=False):
                    class_id = int(class_value)
                    label = self.model_names.get(class_id, str(class_id))
                    if label not in SUPPORTED_EQUIPMENT:
                        continue

                    confidence = float(confidence_value)
                    class_confidence[label] = max(confidence, class_confidence.get(label, 0.0))

            candidates = [
                self._equipment_candidate(label, confidence)
                for label, confidence in sorted(class_confidence.items(), key=lambda item: item[1], reverse=True)
            ]

            if not candidates:
                return self._fallback_equipment_detection(source="yolo-empty")

            return EquipmentDetectionResponse(**candidates[0], candidates=candidates, source="ultralytics-yolo")
        finally:
            if temp_path:
                try:
                    Path(temp_path).unlink(missing_ok=True)
                except OSError:
                    pass

    def _detect_equipment_with_yolo_worker(self, image_bytes: bytes) -> EquipmentDetectionResponse:
        temp_path = None
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
                temp_file.write(image_bytes)
                temp_path = temp_file.name

            if not self.yolo_worker or not self.yolo_worker.stdin or not self.yolo_worker.stdout:
                raise RuntimeError("YOLO worker is not running")

            with self.yolo_worker_lock:
                self.yolo_worker.stdin.write(json.dumps({"imagePath": temp_path}) + "\n")
                self.yolo_worker.stdin.flush()
                response = self._read_worker_json()
            if not response.get("ok"):
                raise RuntimeError(str(response.get("error", "YOLO worker inference failed")))

            candidates = [
                self._equipment_candidate(item["label"], float(item["confidence"]))
                for item in response.get("candidates", [])
                if item.get("label") in SUPPORTED_EQUIPMENT
            ]

            if not candidates:
                return self._fallback_equipment_detection(source="yolo-empty")

            return EquipmentDetectionResponse(**candidates[0], candidates=candidates, source="ultralytics-yolo-worker")
        finally:
            if temp_path:
                try:
                    Path(temp_path).unlink(missing_ok=True)
                except OSError:
                    pass

    def detect_equipment_old(self) -> EquipmentDetectionResponse:
        return EquipmentDetectionResponse(
            label="Lat Pull Down",
            classId=1,
            confidence=0.88,
            chineseName=EQUIPMENT_NAMES_ZH["Lat Pull Down"],
            supported=True,
            candidates=[
                self._equipment_candidate("Lat Pull Down", 0.88),
                self._equipment_candidate("Seated Cable Rows", 0.72),
            ],
        )

    def analyze_form(self, equipment: str | None = None) -> FormAnalysisResponse:
        selected_equipment = equipment if equipment in SUPPORTED_EQUIPMENT else "Lat Pull Down"
        rule = EQUIPMENT_FORM_RULES.get(selected_equipment, EQUIPMENT_FORM_RULES["Lat Pull Down"])
        return FormAnalysisResponse(
            status="camera-ready",
            equipment=selected_equipment,
            repCount=0,
            cues=[
                rule["camera"],
                rule["framing"],
                "重点纠偏：" + "、".join(rule["focus"]),
            ],
            drawPoseLines=False,
        )
