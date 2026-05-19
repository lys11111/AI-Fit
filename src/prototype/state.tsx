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
  weeklyFrequency: string
  preferredWindow: string
  sessionDuration: string
  equipmentPreference: string
  focusPreference: string
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
}

type TrainingFeedbackState = {
  tag: string
  rpe: number
  stability: string
  note: string
  savedAt: string
}

type TrainingState = {
  lastFeedback: TrainingFeedbackState | null
}

type SupportState = {
  lastFeedbackMessage: string
  lastFeedbackSubmittedAt: string | null
  inviteRecipient: string
  inviteChannel: '微信' | '短信'
  lastInviteSentAt: string | null
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
  support: SupportState
}

type OnboardingSavePayload = Pick<
  OnboardingProfileState,
  'goal' | 'weeklyFrequency' | 'preferredWindow' | 'sessionDuration' | 'equipmentPreference' | 'focusPreference'
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
    'goal' | 'weeklyFrequency' | 'preferredWindow' | 'sessionDuration' | 'equipmentPreference' | 'focusPreference'
  >,
  trainingPreferences: Pick<TrainingPreferencesState, 'trainingTags'>,
): PlanInput {
  return {
    goal: onboardingProfile.goal,
    weeklyFrequency: onboardingProfile.weeklyFrequency,
    preferredWindow: onboardingProfile.preferredWindow,
    sessionDuration: onboardingProfile.sessionDuration,
    equipmentPreference: onboardingProfile.equipmentPreference,
    focusPreference: onboardingProfile.focusPreference,
    trainingTags:
      trainingPreferences.trainingTags.length > 0
        ? trainingPreferences.trainingTags
        : buildTrainingTags(onboardingProfile),
  }
}

function defaultOnboardingProfile(): OnboardingProfileState {
  return {
    sections: onboardingSections.map((section) => ({ ...section, answers: [...section.answers] })),
    goal: '减脂塑形',
    weeklyFrequency: '每周 4 次',
    preferredWindow: '晚间训练',
    sessionDuration: '45 分钟',
    equipmentPreference: '固定器械优先',
    focusPreference: '背部发力',
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
        name: '林予',
        city: '上海',
        bio: '最近在做背部塑形，喜欢把训练和饮食都记得清楚一点。',
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
    },
    training: {
      lastFeedback: null,
    },
    support: {
      lastFeedbackMessage: '',
      lastFeedbackSubmittedAt: null,
      inviteRecipient: '',
      inviteChannel: '微信',
      lastInviteSentAt: null,
    },
  }
}

function mergeState(base: PrototypeState, parsed: Partial<PrototypeState>): PrototypeState {
  const mergedOnboardingProfile = { ...base.onboardingProfile, ...parsed.onboardingProfile }
  const mergedTrainingPreferences = {
    ...base.profileSettings.trainingPreferences,
    ...parsed.profileSettings?.trainingPreferences,
  }

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
    plan: parsed.plan ?? buildGeneratedPlan(buildPlanInput(mergedOnboardingProfile, mergedTrainingPreferences)),
    nutrition: {
      ...base.nutrition,
      ...parsed.nutrition,
      targets: parsed.nutrition?.targets ?? base.nutrition.targets,
      mealRecords: parsed.nutrition?.mealRecords ?? base.nutrition.mealRecords,
    },
    training: { ...base.training, ...parsed.training },
    support: { ...base.support, ...parsed.support },
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

      return {
        ...current,
        onboardingProfile: nextOnboardingProfile,
        profileSettings: {
          ...current.profileSettings,
          trainingPreferences: nextTrainingPreferences,
        },
        plan: buildGeneratedPlan(buildPlanInput(nextOnboardingProfile, nextTrainingPreferences)),
      }
    })
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
    setState((current) => {
      if (current.nutrition.recognitionSaved) {
        return current
      }

      return {
        ...current,
        nutrition: {
          ...current.nutrition,
          targets: current.nutrition.targets.map((target) => {
            if (target.key === 'carb') {
              return { ...target, current: Math.min(target.goal, target.current + recognizedMeal.carbs) }
            }
            if (target.key === 'protein') {
              return { ...target, current: Math.min(target.goal, target.current + recognizedMeal.protein) }
            }
            if (target.key === 'fat') {
              return { ...target, current: Math.min(target.goal, target.current + recognizedMeal.fat) }
            }
            return target
          }),
          mealRecords: [
            {
              name: recognizedMeal.name,
              slot: recognizedMeal.slot,
              time: clockLabel(),
              kcal: recognizedMeal.calories,
              protein: recognizedMeal.protein,
            },
            ...current.nutrition.mealRecords,
          ],
          recognitionSaved: true,
          lastSavedMealAt: nowIso(),
        },
      }
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
        resetPrototypeState,
      },
      unreadNotifications,
    }),
    [
      clearNotifications,
      markAllNotificationsRead,
      markNotificationRead,
      requestAuthCode,
      resetPrototypeState,
      restoreNotifications,
      saveAuthDraft,
      saveMealRecognition,
      saveOnboardingProfile,
      saveTrainingFeedback,
      sendInvite,
      state,
      submitSupportFeedback,
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
