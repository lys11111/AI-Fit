from pydantic import BaseModel, Field


class PlanRequest(BaseModel):
    goal: str
    weeklyFrequency: str
    preferredWindow: str
    sessionDuration: str
    equipmentPreference: str
    focusPreference: str
    trainingTags: list[str] = Field(default_factory=list)
    trainingPlace: str | None = None
    experienceLevel: str | None = None
    pushupLevel: str | None = None
    squatLevel: str | None = None
    plankLevel: str | None = None
    recoveryLevel: str | None = None
    bodyStatus: str | None = None
    featurePreference: str | None = None


class PlanExercise(BaseModel):
    name: str
    machineClass: str
    sets: int
    reps: str
    focus: str


class PlanResponse(BaseModel):
    title: str
    summary: str
    match: str
    coachIntro: str
    nutritionNudge: str
    focusPreference: str
    exercises: list[PlanExercise]
    rationale: list[dict[str, str]]
    source: str = "backend"


class MealAnalysisResponse(BaseModel):
    name: str
    slot: str
    calories: int
    protein: int
    carbs: int
    fat: int
    confidence: float
    source: str = "backend"


class TrainingFeedbackRequest(BaseModel):
    tag: str
    rpe: int
    stability: str
    note: str


class TrainingFeedbackResponse(BaseModel):
    nextCue: str
    riskLevel: str
    adjustment: str
    source: str = "backend"


class EquipmentCandidate(BaseModel):
    label: str
    classId: int
    confidence: float
    chineseName: str
    supported: bool


class EquipmentDetectionResponse(BaseModel):
    label: str
    classId: int
    confidence: float
    chineseName: str
    supported: bool
    candidates: list[EquipmentCandidate] = Field(default_factory=list)
    source: str = "backend"


class FormAnalysisResponse(BaseModel):
    status: str
    equipment: str
    repCount: int
    cues: list[str]
    drawPoseLines: bool = False
    source: str = "backend"
