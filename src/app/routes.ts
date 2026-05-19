export const routes = {
  welcome: '/',
  login: '/login',
  onboarding: '/onboarding',
  planLoading: '/plan-loading',
  planPreview: '/plan-preview',
  app: {
    home: '/app/home',
    training: '/app/training',
    nutrition: '/app/nutrition',
    profile: '/app/profile',
    community: '/app/community',
    workout: '/app/workout',
    exercise: '/app/exercise',
    live: '/app/live',
    feedback: '/app/feedback',
    summary: '/app/summary',
    assessment: '/app/assessment',
    mealCapture: '/app/meal-capture',
    mealConfirm: '/app/meal-confirm',
    notifications: '/app/notifications',
    profileAccount: '/app/profile/account',
    profileSupport: '/app/profile/support',
    personalInfo: '/app/profile/personal-info',
    trainingPreferences: '/app/profile/training-preferences',
    privacy: '/app/profile/privacy',
    notificationSettings: '/app/profile/notification-settings',
    help: '/app/profile/help',
    about: '/app/profile/about',
    supportFeedback: '/app/profile/feedback',
    invite: '/app/profile/invite',
    buddyMatch: '/app/community/buddy-match',
    chatDraft: '/app/community/chat-draft',
  },
} as const

export const tabRoutes = [routes.app.home, routes.app.training, routes.app.nutrition, routes.app.profile] as const

export type AppRoute = (typeof routes)[keyof typeof routes] | (typeof routes.app)[keyof typeof routes.app]
