const localHostnames = new Set(['localhost', '127.0.0.1', '::1'])

function defaultApiBaseUrl() {
  if (typeof window === 'undefined') {
    return 'http://localhost:8000'
  }

  if (window.location.hostname.endsWith('.trycloudflare.com')) {
    return ''
  }

  return `${window.location.protocol}//${window.location.hostname}:8000`
}

function resolveApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL?.trim()

  if (configured === '' || configured === 'relative') {
    return ''
  }

  if (typeof window !== 'undefined' && window.location.hostname.endsWith('.trycloudflare.com')) {
    return ''
  }

  if (configured) {
    const configuredLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(configured)
    const pageIsLocalhost = typeof window === 'undefined' || localHostnames.has(window.location.hostname)

    if (!configuredLocalhost || pageIsLocalhost) {
      return configured
    }
  }

  return defaultApiBaseUrl()
}

const apiBaseUrl = resolveApiBaseUrl()

async function requestJson<TResponse>(path: string, init?: RequestInit): Promise<TResponse> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<TResponse>
}

export type BackendPlanInput = {
  goal: string
  weeklyFrequency: string
  preferredWindow: string
  sessionDuration: string
  equipmentPreference: string
  focusPreference: string
  trainingTags: string[]
  trainingPlace?: string
  experienceLevel?: string
  pushupLevel?: string
  squatLevel?: string
  plankLevel?: string
  recoveryLevel?: string
  bodyStatus?: string
  featurePreference?: string
}

export type BackendGeneratedPlan = {
  title: string
  summary: string
  match: string
  coachIntro: string
  nutritionNudge: string
  focusPreference: string
  exercises: Array<{
    name: string
    machineClass: string
    sets: number
    reps: string
    focus: string
  }>
  rationale: Array<{ label: string; value: string }>
  source: string
}

export type BackendTrainingFeedback = {
  nextCue: string
  riskLevel: string
  adjustment: string
  source: string
}

export type BackendMealAnalysis = {
  name: string
  slot: string
  calories: number
  protein: number
  carbs: number
  fat: number
  confidence: number
  source: string
}

export type BackendEquipmentDetection = {
  label: string
  classId: number
  confidence: number
  chineseName: string
  supported: boolean
  candidates: Array<{
    label: string
    classId: number
    confidence: number
    chineseName: string
    supported: boolean
  }>
  source: string
}

export type BackendFormAnalysis = {
  status: string
  equipment: string
  repCount: number
  cues: string[]
  drawPoseLines: boolean
  source: string
}

export const aiFitApi = {
  health() {
    return requestJson<{ ok: boolean; modelLoaded: boolean; loadError: string | null }>('/health')
  },
  generatePlan(payload: BackendPlanInput) {
    return requestJson<BackendGeneratedPlan>('/api/plan/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  analyzeMeal() {
    return requestJson<BackendMealAnalysis>('/api/meal/analyze', { method: 'POST' })
  },
  analyzeTrainingFeedback(payload: { tag: string; rpe: number; stability: string; note: string }) {
    return requestJson<BackendTrainingFeedback>('/api/training/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  detectEquipment(image?: Blob) {
    if (!image) {
      return requestJson<BackendEquipmentDetection>('/api/equipment/detect', { method: 'POST' })
    }

    const form = new FormData()
    form.append('image', image)
    return fetch(`${apiBaseUrl}/api/equipment/detect`, {
      method: 'POST',
      body: form,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response.json() as Promise<BackendEquipmentDetection>
    })
  },
  analyzeForm(frame?: Blob, equipment?: string) {
    const form = new FormData()
    if (frame) {
      form.append('frame', frame)
    }
    if (equipment) {
      form.append('equipment', equipment)
    }
    return fetch(`${apiBaseUrl}/api/form/analyze`, {
      method: 'POST',
      body: form,
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`)
      }

      return response.json() as Promise<BackendFormAnalysis>
    })
  },
}
