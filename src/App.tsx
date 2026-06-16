import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { routes } from '@/app/routes'
import { MobileFrame } from '@/components/app/mobile-frame'
import {
  AboutScreen,
  BuddyMatchScreen,
  ChatDraftScreen,
  CommunityScreen,
  ExerciseLearningScreen,
  HelpCenterScreen,
  HomeScreen,
  InviteFriendsScreen,
  LiveCorrectionScreen,
  LoginScreen,
  MealCaptureScreen,
  MealConfirmScreen,
  NotificationSettingsScreen,
  NotificationsScreen,
  NutritionScreen,
  OnboardingScreen,
  PersonalInfoScreen,
  PlanAssessmentScreen,
  PlanLoadingScreen,
  PlanPreviewScreen,
  PrivacyScreen,
  ProfileAccountScreen,
  ProfileScreen,
  ProfileSupportScreen,
  SetFeedbackScreen,
  SupportFeedbackScreen,
  TrainingPreferencesScreen,
  TrainingScreen,
  WelcomeScreen,
  WorkoutSessionScreen,
  WorkoutSummaryScreen,
} from '@/screens'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileFrame />}>
          <Route path={routes.welcome} element={<WelcomeScreen />} />
          <Route path={routes.login} element={<LoginScreen />} />
          <Route path={routes.onboarding} element={<OnboardingScreen />} />
          <Route path={routes.planLoading} element={<PlanLoadingScreen />} />
          <Route path={routes.planPreview} element={<PlanPreviewScreen />} />
          <Route path={routes.app.home} element={<HomeScreen />} />
          <Route path={routes.app.training} element={<TrainingScreen />} />
          <Route path={routes.app.nutrition} element={<NutritionScreen />} />
          <Route path={routes.app.profile} element={<ProfileScreen />} />
          <Route path={routes.app.community} element={<CommunityScreen />} />
          <Route path={routes.app.workout} element={<WorkoutSessionScreen />} />
          <Route path={routes.app.exercise} element={<ExerciseLearningScreen />} />
          <Route path={routes.app.live} element={<LiveCorrectionScreen />} />
          <Route path={routes.app.feedback} element={<SetFeedbackScreen />} />
          <Route path={routes.app.summary} element={<WorkoutSummaryScreen />} />
          <Route path={routes.app.assessment} element={<PlanAssessmentScreen />} />
          <Route path={routes.app.mealCapture} element={<MealCaptureScreen />} />
          <Route path={routes.app.mealConfirm} element={<MealConfirmScreen />} />
          <Route path={routes.app.notifications} element={<NotificationsScreen />} />
          <Route path={routes.app.profileAccount} element={<ProfileAccountScreen />} />
          <Route path={routes.app.profileSupport} element={<ProfileSupportScreen />} />
          <Route path={routes.app.personalInfo} element={<PersonalInfoScreen />} />
          <Route path={routes.app.trainingPreferences} element={<TrainingPreferencesScreen />} />
          <Route path={routes.app.privacy} element={<PrivacyScreen />} />
          <Route path={routes.app.notificationSettings} element={<NotificationSettingsScreen />} />
          <Route path={routes.app.help} element={<HelpCenterScreen />} />
          <Route path={routes.app.about} element={<AboutScreen />} />
          <Route path={routes.app.supportFeedback} element={<SupportFeedbackScreen />} />
          <Route path={routes.app.invite} element={<InviteFriendsScreen />} />
          <Route path={routes.app.buddyMatch} element={<BuddyMatchScreen />} />
          <Route path={routes.app.chatDraft} element={<ChatDraftScreen />} />
          <Route path="*" element={<Navigate replace to={routes.welcome} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
