/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import {
  mealRecords,
  notificationSeed,
  nutritionTargets,
  onboardingSections,
  recognizedMeal,
  type MacroTarget,
  type MealRecord,
  type NotificationItem,
} from '@/data'
import { aiFitApi, type BackendMealAnalysis } from '@/lib/api'
import { buildGeneratedPlan, type GeneratedPlan, type PlanInput } from '@/prototype/plan'

const storageKey = 'aifit-prototype-state-v1'

type AuthState = {
  phone: string
  code: string
  status: 'idle' | 'sending' | 'sent'
  cooldownEndsAt: number | null
  lastSentAt: string | null
}

type StoredNotification = NotificationItem & {
  readAt: string | null
}

type OnboardingProfileState = {
  sections: { kicker: string; title: string; answers: string[] }[]
  goal: string
  trainingPlace: string
  weeklyFrequency: string
  preferredWindow: string
  sessionDuration: string
  equipmentPreference: string
  focusPreference: string
  experienceLevel: string
  pushupLevel: string
  squatLevel: string
  plankLevel: string
  recoveryLevel: string
  bodyStatus: string
  featurePreference: string
  lastCompletedAt: string | null
}

type PersonalInfoState = {
  name: string
  city: string
  bio: string
}

type TrainingPreferencesState = {
  goal: string
  weeklyFrequency: string
  preferredWindow: string
  sessionDuration: string
  equipmentPreference: string
  trainingTags: string[]
}

type PrivacyState = {
  camera: boolean
  notifications: boolean
  healthData: boolean
}

type NotificationSettingsState = {
  coachReminders: boolean
  nutritionReminders: boolean
  communityUpdates: boolean
  quietHours: boolean
}

type ProfileSettingsState = {
  personalInfo: PersonalInfoState
  trainingPreferences: TrainingPreferencesState
  privacy: PrivacyState
  notificationSettings: NotificationSettingsState
}

type NutritionState = {
  targets: MacroTarget[]
  mealRecords: MealRecord[]
  recognitionSaved: boolean
  lastSavedMealAt: string | null
  aiRecommendation: string | null
}

type TrainingFeedbackState = {
  tag: string
  rpe: number
  stability: string
  note: string
  savedAt: string
  modelAdvice?: {
    nextCue: string
    riskLevel: string
    adjustment: string
    source: string
  }
}

type TrainingState = {
  lastFeedback: TrainingFeedbackState | null
}

type AiCoachState = {
  lastQuestion: string
  recommendation: string
  lastUpdatedAt: string | null
}

type SupportState = {
  lastFeedbackMessage: string
  lastFeedbackSubmittedAt: string | null
  inviteRecipient: string
  inviteChannel: '微信' | '短信'
  lastInviteSentAt: string | null
}

type PlanLibraryState = {
  planCount: number
  activePlanName: string
  trainingSplit: string
  weeklyDays: number
  selectedExercises: string[]
  lastEditedAt: string | null
}

type EquipmentState = {
  lastDetectedLabel: string | null
  lastDetectedConfidence: number | null
  manualSelection: string | null
  lastUpdatedAt: string | null
}

type BodyDataState = {
  heightCm: number
  weightKg: number
  bodyFatPercent: number
  waistCm: number
  lastUpdatedAt: string | null
}

export type PrototypeState = {
  auth: AuthState
  notifications: {
    items: StoredNotification[]
  }
  onboardingProfile: OnboardingProfileState
  profileSettings: ProfileSettingsState
  plan: GeneratedPlan
  nutrition: NutritionState
  training: TrainingState
  aiCoach: AiCoachState
  support: SupportState
  planLibrary: PlanLibraryState
  equipment: EquipmentState
  bodyData: BodyDataState
}

type OnboardingSavePayload = Pick<
  OnboardingProfileState,
  | 'goal'
  | 'trainingPlace'
  | 'weeklyFrequency'
  | 'preferredWindow'
  | 'sessionDuration'
  | 'equipmentPreference'
  | 'focusPreference'
  | 'experienceLevel'
  | 'pushupLevel'
  | 'squatLevel'
  | 'plankLevel'
  | 'recoveryLevel'
  | 'bodyStatus'
  | 'featurePreference'
>

type PrototypeActions = {
  saveAuthDraft: (payload: { phone?: string; code?: string }) => void
  requestAuthCode: (phone: string) => void
  saveOnboardingProfile: (payload: OnboardingSavePayload) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: () => void
  clearNotifications: () => void
  restoreNotifications: () => void
  saveMealRecognition: () => void
  saveTrainingFeedback: (payload: { tag: string; rpe: number; stability: string; note: string }) => void
  updatePersonalInfo: (payload: PersonalInfoState) => void
  updateTrainingPreferences: (payload: TrainingPreferencesState) => void
  updatePrivacy: (payload: PrivacyState) => void
  updateNotificationSettings: (payload: NotificationSettingsState) => void
  submitSupportFeedback: (message: string) => void
  sendInvite: (payload: { recipient: string; channel: '微信' | '短信' }) => void
  createTrainingPlan: (payload: { name: string; split: string; weeklyDays: number }) => void
  addPlanExercise: (exercise: string) => void
  removePlanExercise: (exercise: string) => void
  saveEquipmentDetection: (payload: { label: string; confidence: number }) => void
  saveManualEquipmentSelection: (label: string) => void
  saveNutritionRecommendation: (recommendation: string) => void
  saveAiCoachRecommendation: (payload: { question: string; recommendation: string }) => void
  updateBodyData: (payload: Partial<BodyDataState>) => void
  resetPrototypeState: () => void
}

type PrototypeContextValue = {
  state: PrototypeState
  actions: PrototypeActions
  unreadNotifications: number
}

const PrototypeStateContext = createContext<PrototypeContextValue | null>(null)

function nowIso() {
  return new Date().toISOString()
}

function clockLabel() {
  return new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date())
}

function makeNotificationSeed(): StoredNotification[] {
  return notificationSeed.map((item, index) => ({
    ...item,
    readAt: index === notificationSeed.length - 1 ? nowIso() : null,
  }))
}

function buildTrainingTags(input: Pick<PlanInput, 'focusPreference' | 'preferredWindow' | 'equipmentPreference'>) {
  return [input.focusPreference, input.preferredWindow, input.equipmentPreference]
}

function buildPlanInput(
  onboardingProfile: Pick<
    OnboardingProfileState,
    | 'goal'
    | 'trainingPlace'
    | 'weeklyFrequency'
    | 'preferredWindow'
    | 'sessionDuration'
    | 'equipmentPreference'
    | 'focusPreference'
    | 'experienceLevel'
    | 'pushupLevel'
    | 'squatLevel'
    | 'plankLevel'
    | 'recoveryLevel'
    | 'bodyStatus'
    | 'featurePreference'
  >,
  trainingPreferences: Pick<TrainingPreferencesState, 'trainingTags'>,
): PlanInput {
  return {
    goal: onboardingProfile.goal,
    trainingPlace: onboardingProfile.trainingPlace,
    weeklyFrequency: onboardingProfile.weeklyFrequency,
    preferredWindow: onboardingProfile.preferredWindow,
    sessionDuration: onboardingProfile.sessionDuration,
    equipmentPreference: onboardingProfile.equipmentPreference,
    focusPreference: onboardingProfile.focusPreference,
    experienceLevel: onboardingProfile.experienceLevel,
    pushupLevel: onboardingProfile.pushupLevel,
    squatLevel: onboardingProfile.squatLevel,
    plankLevel: onboardingProfile.plankLevel,
    recoveryLevel: onboardingProfile.recoveryLevel,
    bodyStatus: onboardingProfile.bodyStatus,
    featurePreference: onboardingProfile.featurePreference,
    trainingTags:
      trainingPreferences.trainingTags.length > 0
        ? trainingPreferences.trainingTags
        : buildTrainingTags(onboardingProfile),
  }
}

function applyMealRecognitionState(current: PrototypeState, meal: typeof recognizedMeal | BackendMealAnalysis): PrototypeState {
  if (current.nutrition.recognitionSaved) {
    return current
  }

  return {
    ...current,
    nutrition: {
      ...current.nutrition,
      targets: current.nutrition.targets.map((target) => {
        if (target.key === 'carb') {
          return { ...target, current: Math.min(target.goal, target.current + meal.carbs) }
        }
        if (target.key === 'protein') {
          return { ...target, current: Math.min(target.goal, target.current + meal.protein) }
        }
        if (target.key === 'fat') {
          return { ...target, current: Math.min(target.goal, target.current + meal.fat) }
        }
        return target
      }),
      mealRecords: [
        {
          name: meal.name,
          slot: meal.slot,
          time: clockLabel(),
          kcal: meal.calories,
          protein: meal.protein,
        },
        ...current.nutrition.mealRecords,
      ],
      recognitionSaved: true,
      lastSavedMealAt: nowIso(),
    },
  }
}

function defaultOnboardingProfile(): OnboardingProfileState {
  return {
    sections: onboardingSections.map((section) => ({ ...section, answers: [...section.answers] })),
    goal: '减脂塑形',
    trainingPlace: '健身房固定器械区',
    weeklyFrequency: '每周 4 次',
    preferredWindow: '晚间训练',
    sessionDuration: '45 分钟',
    equipmentPreference: '固定器械优先',
    focusPreference: '背部发力',
    experienceLevel: '规律训练 3-12 个月',
    pushupLevel: '标准俯卧撑 6-15 个',
    squatLevel: '徒手深蹲动作稳定',
    plankLevel: '平板支撑 45-90 秒',
    recoveryLevel: '训练后 1-2 天恢复',
    bodyStatus: '无明显疼痛或伤病',
    featurePreference: 'AI 动作纠偏',
    lastCompletedAt: null,
  }
}

function defaultTrainingPreferences(): TrainingPreferencesState {
  return {
    goal: '减脂塑形',
    weeklyFrequency: '每周 4 次',
    preferredWindow: '晚间训练',
    sessionDuration: '45 分钟',
    equipmentPreference: '固定器械优先',
    trainingTags: ['背部发力', '晚间训练', '固定器械优先'],
  }
}

function defaultState(): PrototypeState {
  const onboardingProfile = defaultOnboardingProfile()
  const trainingPreferences = defaultTrainingPreferences()

  return {
    auth: {
      phone: '138 0000 6688',
      code: '2946',
      status: 'idle',
      cooldownEndsAt: null,
      lastSentAt: null,
    },
    notifications: {
      items: makeNotificationSeed(),
    },
    onboardingProfile,
    profileSettings: {
      personalInfo: {
        name: '林晓雅',
        city: '上海',
        bio: '正在通过 AI 优化营养摄入，最近也把训练和饮食都记得清楚一点。',
      },
      trainingPreferences,
      privacy: {
        camera: true,
        notifications: true,
        healthData: false,
      },
      notificationSettings: {
        coachReminders: true,
        nutritionReminders: true,
        communityUpdates: false,
        quietHours: true,
      },
    },
    plan: buildGeneratedPlan(buildPlanInput(onboardingProfile, trainingPreferences)),
    nutrition: {
      targets: nutritionTargets.map((target) => ({ ...target })),
      mealRecords: mealRecords.map((record) => ({ ...record })),
      recognitionSaved: false,
      lastSavedMealAt: null,
      aiRecommendation: null,
    },
    training: {
      lastFeedback: null,
    },
    aiCoach: {
      lastQuestion: '今天高位下拉总感觉手臂先酸，应该怎么调整？',
      recommendation: '先降低一档重量，把动作起点放在肩胛下沉。下拉时想象手肘向身体两侧口袋靠近，手只是钩住握把。',
      lastUpdatedAt: null,
    },
    support: {
      lastFeedbackMessage: '',
      lastFeedbackSubmittedAt: null,
      inviteRecipient: '',
      inviteChannel: '微信',
      lastInviteSentAt: null,
    },
    planLibrary: {
      planCount: 3,
      activePlanName: '4周背部训练计划',
      trainingSplit: '胸 / 背 / 腿 / 肩',
      weeklyDays: 4,
      selectedExercises: ['正握宽距高位下拉', '坐姿绳索划船', '腿举机'],
      lastEditedAt: null,
    },
    equipment: {
      lastDetectedLabel: null,
      lastDetectedConfidence: null,
      manualSelection: null,
      lastUpdatedAt: null,
    },
    bodyData: {
      heightCm: 168,
      weightKg: 58.6,
      bodyFatPercent: 22.4,
      waistCm: 68,
      lastUpdatedAt: null,
    },
  }
}

function mergeState(base: PrototypeState, parsed: Partial<PrototypeState>): PrototypeState {
  const mergedOnboardingProfile = { ...base.onboardingProfile, ...parsed.onboardingProfile }
  const mergedTrainingPreferences = {
    ...base.profileSettings.trainingPreferences,
    ...parsed.profileSettings?.trainingPreferences,
  }
  const generatedPlan = buildGeneratedPlan(buildPlanInput(mergedOnboardingProfile, mergedTrainingPreferences))
  const mergedPlan = parsed.plan ? { ...generatedPlan, ...parsed.plan, exercises: parsed.plan.exercises ?? generatedPlan.exercises } : generatedPlan

  return {
    ...base,
    ...parsed,
    auth: { ...base.auth, ...parsed.auth },
    notifications: {
      ...base.notifications,
      ...parsed.notifications,
      items: parsed.notifications?.items ?? base.notifications.items,
    },
    onboardingProfile: mergedOnboardingProfile,
    profileSettings: {
      ...base.profileSettings,
      ...parsed.profileSettings,
      personalInfo: { ...base.profileSettings.personalInfo, ...parsed.profileSettings?.personalInfo },
      trainingPreferences: mergedTrainingPreferences,
      privacy: { ...base.profileSettings.privacy, ...parsed.profileSettings?.privacy },
      notificationSettings: {
        ...base.profileSettings.notificationSettings,
        ...parsed.profileSettings?.notificationSettings,
      },
    },
    plan: mergedPlan,
    nutrition: {
      ...base.nutrition,
      ...parsed.nutrition,
      targets: parsed.nutrition?.targets ?? base.nutrition.targets,
      mealRecords: parsed.nutrition?.mealRecords ?? base.nutrition.mealRecords,
    },
    training: { ...base.training, ...parsed.training },
    aiCoach: { ...base.aiCoach, ...parsed.aiCoach },
    support: { ...base.support, ...parsed.support },
    planLibrary: { ...base.planLibrary, ...parsed.planLibrary },
    equipment: { ...base.equipment, ...parsed.equipment },
    bodyData: { ...base.bodyData, ...parsed.bodyData },
  }
}

function loadState(): PrototypeState {
  const base = defaultState()

  if (typeof window === 'undefined') {
    return base
  }

  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      return base
    }

    const parsed = JSON.parse(raw) as Partial<PrototypeState>
    return mergeState(base, parsed)
  } catch {
    return base
  }
}

export function PrototypeStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PrototypeState>(loadState)

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state))
  }, [state])

  const saveAuthDraft = useCallback((payload: { phone?: string; code?: string }) => {
    setState((current) => ({
      ...current,
      auth: {
        ...current.auth,
        phone: payload.phone ?? current.auth.phone,
        code: payload.code ?? current.auth.code,
      },
    }))
  }, [])

  const requestAuthCode = useCallback((phone: string) => {
    setState((current) => ({
      ...current,
      auth: {
        ...current.auth,
        phone,
        status: 'sending',
      },
    }))

    window.setTimeout(() => {
      setState((current) => ({
        ...current,
        auth: {
          ...current.auth,
          phone,
          status: 'sent',
          cooldownEndsAt: Date.now() + 60_000,
          lastSentAt: nowIso(),
        },
      }))
    }, 700)
  }, [])

  const saveOnboardingProfile = useCallback((payload: OnboardingSavePayload) => {
    let backendPlanInput: PlanInput | null = null

    setState((current) => {
      const nextOnboardingProfile = {
        ...current.onboardingProfile,
        ...payload,
        lastCompletedAt: nowIso(),
      }

      const nextTrainingTags = buildTrainingTags(payload)
      const nextTrainingPreferences = {
        ...current.profileSettings.trainingPreferences,
        goal: payload.goal,
        weeklyFrequency: payload.weeklyFrequency,
        preferredWindow: payload.preferredWindow,
        sessionDuration: payload.sessionDuration,
        equipmentPreference: payload.equipmentPreference,
        trainingTags: nextTrainingTags,
      }
      backendPlanInput = buildPlanInput(nextOnboardingProfile, nextTrainingPreferences)

      return {
        ...current,
        onboardingProfile: nextOnboardingProfile,
        profileSettings: {
          ...current.profileSettings,
          trainingPreferences: nextTrainingPreferences,
        },
        plan: buildGeneratedPlan(backendPlanInput),
      }
    })

    window.setTimeout(() => {
      if (!backendPlanInput) {
        return
      }

      void aiFitApi
        .generatePlan(backendPlanInput)
        .then((plan) => {
          setState((current) => ({ ...current, plan }))
        })
        .catch(() => undefined)
    }, 0)
  }, [])

  const markNotificationRead = useCallback((id: string) => {
    setState((current) => ({
      ...current,
      notifications: {
        items: current.notifications.items.map((item) => (item.id === id ? { ...item, readAt: item.readAt ?? nowIso() } : item)),
      },
    }))
  }, [])

  const markAllNotificationsRead = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: {
        items: current.notifications.items.map((item) => ({ ...item, readAt: item.readAt ?? nowIso() })),
      },
    }))
  }, [])

  const clearNotifications = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: {
        items: [],
      },
    }))
  }, [])

  const restoreNotifications = useCallback(() => {
    setState((current) => ({
      ...current,
      notifications: {
        items: makeNotificationSeed(),
      },
    }))
  }, [])

  const saveMealRecognition = useCallback(() => {
    void aiFitApi
      .analyzeMeal()
      .then((meal) => {
        setState((current) => applyMealRecognitionState(current, meal))
      })
      .catch(() => {
        setState((current) => applyMealRecognitionState(current, recognizedMeal))
      })
  }, [])

  const saveTrainingFeedback = useCallback((payload: { tag: string; rpe: number; stability: string; note: string }) => {
    setState((current) => ({
      ...current,
      training: {
        lastFeedback: {
          ...payload,
          savedAt: nowIso(),
        },
      },
    }))

    void aiFitApi
      .analyzeTrainingFeedback(payload)
      .then((modelAdvice) => {
        setState((current) => ({
          ...current,
          training: {
            lastFeedback: current.training.lastFeedback
              ? {
                  ...current.training.lastFeedback,
                  modelAdvice,
                }
              : current.training.lastFeedback,
          },
        }))
      })
      .catch(() => undefined)
  }, [])

  const updatePersonalInfo = useCallback((payload: PersonalInfoState) => {
    setState((current) => ({
      ...current,
      profileSettings: {
        ...current.profileSettings,
        personalInfo: payload,
      },
    }))
  }, [])

  const updateTrainingPreferences = useCallback((payload: TrainingPreferencesState) => {
    setState((current) => {
      const nextOnboardingProfile = {
        ...current.onboardingProfile,
        goal: payload.goal,
        weeklyFrequency: payload.weeklyFrequency,
        preferredWindow: payload.preferredWindow,
        sessionDuration: payload.sessionDuration,
        equipmentPreference: payload.equipmentPreference,
      }

      return {
        ...current,
        onboardingProfile: nextOnboardingProfile,
        profileSettings: {
          ...current.profileSettings,
          trainingPreferences: payload,
        },
        plan: buildGeneratedPlan(buildPlanInput(nextOnboardingProfile, payload)),
      }
    })
  }, [])

  const updatePrivacy = useCallback((payload: PrivacyState) => {
    setState((current) => ({
      ...current,
      profileSettings: {
        ...current.profileSettings,
        privacy: payload,
      },
    }))
  }, [])

  const updateNotificationSettings = useCallback((payload: NotificationSettingsState) => {
    setState((current) => ({
      ...current,
      profileSettings: {
        ...current.profileSettings,
        notificationSettings: payload,
      },
    }))
  }, [])

  const submitSupportFeedback = useCallback((message: string) => {
    setState((current) => ({
      ...current,
      support: {
        ...current.support,
        lastFeedbackMessage: message,
        lastFeedbackSubmittedAt: nowIso(),
      },
    }))
  }, [])

  const sendInvite = useCallback((payload: { recipient: string; channel: '微信' | '短信' }) => {
    setState((current) => ({
      ...current,
      support: {
        ...current.support,
        inviteRecipient: payload.recipient,
        inviteChannel: payload.channel,
        lastInviteSentAt: nowIso(),
      },
    }))
  }, [])

  const createTrainingPlan = useCallback((payload: { name: string; split: string; weeklyDays: number }) => {
    setState((current) => {
      const isExistingPlan = current.planLibrary.activePlanName === payload.name

      return {
        ...current,
        planLibrary: {
          ...current.planLibrary,
          planCount: isExistingPlan ? current.planLibrary.planCount : current.planLibrary.planCount + 1,
          activePlanName: payload.name,
          trainingSplit: payload.split,
          weeklyDays: payload.weeklyDays,
          lastEditedAt: nowIso(),
        },
      }
    })
  }, [])

  const addPlanExercise = useCallback((exercise: string) => {
    setState((current) => ({
      ...current,
      planLibrary: {
        ...current.planLibrary,
        selectedExercises: current.planLibrary.selectedExercises.includes(exercise)
          ? current.planLibrary.selectedExercises
          : [...current.planLibrary.selectedExercises, exercise],
        lastEditedAt: nowIso(),
      },
    }))
  }, [])

  const removePlanExercise = useCallback((exercise: string) => {
    setState((current) => ({
      ...current,
      planLibrary: {
        ...current.planLibrary,
        selectedExercises: current.planLibrary.selectedExercises.filter((item) => item !== exercise),
        lastEditedAt: nowIso(),
      },
    }))
  }, [])

  const saveEquipmentDetection = useCallback((payload: { label: string; confidence: number }) => {
    setState((current) => ({
      ...current,
      equipment: {
        ...current.equipment,
        lastDetectedLabel: payload.label,
        lastDetectedConfidence: payload.confidence,
        lastUpdatedAt: nowIso(),
      },
    }))
  }, [])

  const saveManualEquipmentSelection = useCallback((label: string) => {
    setState((current) => ({
      ...current,
      equipment: {
        ...current.equipment,
        manualSelection: label,
        lastUpdatedAt: nowIso(),
      },
    }))
  }, [])

  const saveNutritionRecommendation = useCallback((recommendation: string) => {
    setState((current) => ({
      ...current,
      nutrition: {
        ...current.nutrition,
        aiRecommendation: recommendation,
      },
    }))
  }, [])

  const saveAiCoachRecommendation = useCallback((payload: { question: string; recommendation: string }) => {
    setState((current) => ({
      ...current,
      aiCoach: {
        lastQuestion: payload.question,
        recommendation: payload.recommendation,
        lastUpdatedAt: nowIso(),
      },
    }))
  }, [])

  const updateBodyData = useCallback((payload: Partial<BodyDataState>) => {
    setState((current) => ({
      ...current,
      bodyData: {
        ...current.bodyData,
        ...payload,
        lastUpdatedAt: nowIso(),
      },
    }))
  }, [])

  const resetPrototypeState = useCallback(() => {
    setState(defaultState())
  }, [])

  const unreadNotifications = state.notifications.items.filter((item) => !item.readAt).length

  const value = useMemo<PrototypeContextValue>(
    () => ({
      state,
      actions: {
        saveAuthDraft,
        requestAuthCode,
        saveOnboardingProfile,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        restoreNotifications,
        saveMealRecognition,
        saveTrainingFeedback,
        updatePersonalInfo,
        updateTrainingPreferences,
        updatePrivacy,
        updateNotificationSettings,
        submitSupportFeedback,
        sendInvite,
        createTrainingPlan,
        addPlanExercise,
        removePlanExercise,
        saveEquipmentDetection,
        saveManualEquipmentSelection,
        saveNutritionRecommendation,
        saveAiCoachRecommendation,
        updateBodyData,
        resetPrototypeState,
      },
      unreadNotifications,
    }),
    [
      addPlanExercise,
      clearNotifications,
      createTrainingPlan,
      markAllNotificationsRead,
      markNotificationRead,
      requestAuthCode,
      resetPrototypeState,
      removePlanExercise,
      restoreNotifications,
      saveAuthDraft,
      saveEquipmentDetection,
      saveMealRecognition,
      saveManualEquipmentSelection,
      saveAiCoachRecommendation,
      saveNutritionRecommendation,
      saveOnboardingProfile,
      saveTrainingFeedback,
      sendInvite,
      state,
      submitSupportFeedback,
      updateBodyData,
      unreadNotifications,
      updateNotificationSettings,
      updatePersonalInfo,
      updatePrivacy,
      updateTrainingPreferences,
    ],
  )

  return <PrototypeStateContext.Provider value={value}>{children}</PrototypeStateContext.Provider>
}

export function usePrototypeState() {
  const context = useContext(PrototypeStateContext)

  if (!context) {
    throw new Error('usePrototypeState must be used within PrototypeStateProvider')
  }

  return context
}
