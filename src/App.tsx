import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

import { routes } from '@/app/routes'
import { MobileFrame } from '@/components/app/mobile-frame'
import {
  AboutScreen,
  AddExerciseScreen,
  BasicInfoCollectScreen,
  BodyDataScreen,
  BuddyMatchScreen,
  ChatDraftScreen,
  CommunityScreen,
  EditTrainingDayScreen,
  EquipmentResultScreen,
  ExerciseDetailScreen,
  ExerciseLearningScreen,
  FitnessAnalysisScreen,
  FitnessChatScreen,
  FitnessResultScreen,
  HelpCenterScreen,
  InviteFriendsScreen,
  LiveCorrectionScreen,
  LoginSuccessScreen,
  LoginScreen,
  ManualEquipmentScreen,
  MealCaptureScreen,
  MealConfirmScreen,
  NotificationSettingsScreen,
  NotificationsScreen,
  NutritionChatScreen,
  NutritionRecommendScreen,
  NutritionScreen,
  OnboardingStartScreen,
  OnboardingScreen,
  PersonalInfoScreen,
  PlanAssessmentScreen,
  PlanBuilderScreen,
  PlanLoadingScreen,
  PlanPreviewScreen,
  PrivacyScreen,
  ProfileSummaryScreen,
  ProfileAccountScreen,
  ProfileScreen,
  ProfileSupportScreen,
  ResetPasswordScreen,
  SetFeedbackScreen,
  SupportedActionsScreen,
  SupportFeedbackScreen,
  TdeeDashboardScreen,
  TrainingPreferencesScreen,
  TrainingBaseCollectScreen,
  TrainingGoalCollectScreen,
  TrainingScreen,
  TrainingStructureScreen,
  WorkStatusCollectScreen,
  WorkoutSessionScreen,
  WorkoutSummaryScreen,
} from '@/screens'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MobileFrame />}>
          <Route path={routes.welcome} element={<LoginScreen />} />
          <Route path={routes.login} element={<LoginScreen />} />
          <Route path={routes.resetPassword} element={<ResetPasswordScreen />} />
          <Route path={routes.loginSuccess} element={<LoginSuccessScreen />} />
          <Route path={routes.onboardingStart} element={<OnboardingStartScreen />} />
          <Route path={routes.onboardingBasic} element={<BasicInfoCollectScreen />} />
          <Route path={routes.onboardingGoalCollect} element={<TrainingGoalCollectScreen />} />
          <Route path={routes.onboardingBaseCollect} element={<TrainingBaseCollectScreen />} />
          <Route path={routes.onboardingWorkStatus} element={<WorkStatusCollectScreen />} />
          <Route path={routes.onboardingSummary} element={<ProfileSummaryScreen />} />
          <Route path={routes.onboarding} element={<OnboardingScreen />} />
          <Route path={routes.planLoading} element={<PlanLoadingScreen />} />
          <Route path={routes.planPreview} element={<PlanPreviewScreen />} />
          <Route path={routes.app.home} element={<Navigate replace to={routes.app.training} />} />
          <Route path={routes.app.training} element={<TrainingScreen />} />
          <Route path={routes.app.nutrition} element={<NutritionScreen />} />
          <Route path={routes.app.profile} element={<ProfileScreen />} />
          <Route path={routes.app.community} element={<CommunityScreen />} />
          <Route path={routes.app.workout} element={<WorkoutSessionScreen />} />
          <Route path={routes.app.planNew} element={<PlanBuilderScreen />} />
          <Route path={routes.app.planStructure} element={<TrainingStructureScreen />} />
          <Route path={routes.app.planAddExercise} element={<AddExerciseScreen />} />
          <Route path={routes.app.planEditDay} element={<EditTrainingDayScreen />} />
          <Route path={routes.app.fitnessChat} element={<FitnessChatScreen />} />
          <Route path={routes.app.fitnessAnalysis} element={<FitnessAnalysisScreen />} />
          <Route path={routes.app.fitnessResult} element={<FitnessResultScreen />} />
          <Route path={routes.app.supportedActions} element={<SupportedActionsScreen />} />
          <Route path={routes.app.exerciseDetail} element={<ExerciseDetailScreen />} />
          <Route path={routes.app.exercise} element={<ExerciseLearningScreen />} />
          <Route path={routes.app.live} element={<LiveCorrectionScreen />} />
          <Route path={routes.app.equipmentResult} element={<EquipmentResultScreen />} />
          <Route path={routes.app.manualEquipment} element={<ManualEquipmentScreen />} />
          <Route path={routes.app.feedback} element={<SetFeedbackScreen />} />
          <Route path={routes.app.summary} element={<WorkoutSummaryScreen />} />
          <Route path={routes.app.assessment} element={<PlanAssessmentScreen />} />
          <Route path={routes.app.mealCapture} element={<MealCaptureScreen />} />
          <Route path={routes.app.mealConfirm} element={<MealConfirmScreen />} />
          <Route path={routes.app.nutritionChat} element={<NutritionChatScreen />} />
          <Route path={routes.app.nutritionRecommend} element={<NutritionRecommendScreen />} />
          <Route path={routes.app.notifications} element={<NotificationsScreen />} />
          <Route path={routes.app.profileAccount} element={<ProfileAccountScreen />} />
          <Route path={routes.app.profileSupport} element={<ProfileSupportScreen />} />
          <Route path={routes.app.personalInfo} element={<PersonalInfoScreen />} />
          <Route path={routes.app.bodyData} element={<BodyDataScreen />} />
          <Route path={routes.app.tdeeDashboard} element={<TdeeDashboardScreen />} />
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
