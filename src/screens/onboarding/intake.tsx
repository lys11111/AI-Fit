import { BatteryMedium, BriefcaseBusiness, CheckCircle2, Dumbbell, Ruler, Target } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

const goals = ['减脂塑形', '增肌', '体态改善', '提升力量'] as const
const bases = ['训练新手', '规律训练 3-12 个月', '有系统训练经验'] as const
const workStates = ['久坐办公', '站立走动较多', '作息不规律', '恢复状态稳定'] as const

export function BasicInfoCollectScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const [heightCm, setHeightCm] = useState(String(state.bodyData.heightCm))
  const [weightKg, setWeightKg] = useState(String(state.bodyData.weightKg))
  const [bodyFatPercent, setBodyFatPercent] = useState(String(state.bodyData.bodyFatPercent))

  return (
    <Screen dataScreen="basic-info-collect">
      <PageHeader backTo={routes.onboardingStart} eyebrow="Basic Info" title="基础信息收集" variant="compact" />
      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-36 bg-[url('/figma/basic-info-collect.png')] bg-cover bg-top" />
      </div>
      <GroupedSection className="space-y-4">
        <SectionHeader kicker="BODY" title="身体基础数据" />
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">身高 cm</span>
          <Input inputMode="decimal" value={heightCm} onChange={(event) => setHeightCm(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">体重 kg</span>
          <Input inputMode="decimal" value={weightKg} onChange={(event) => setWeightKg(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">体脂率 %</span>
          <Input inputMode="decimal" value={bodyFatPercent} onChange={(event) => setBodyFatPercent(event.target.value)} />
        </label>
      </GroupedSection>
      <Button
        className="w-full"
        onClick={() => {
          actions.updateBodyData({
            heightCm: Number(heightCm) || state.bodyData.heightCm,
            weightKg: Number(weightKg) || state.bodyData.weightKg,
            bodyFatPercent: Number(bodyFatPercent) || state.bodyData.bodyFatPercent,
          })
          navigate(routes.onboardingGoalCollect)
        }}
      >
        保存并继续
      </Button>
    </Screen>
  )
}

export function TrainingGoalCollectScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const [goal, setGoal] = useState(state.onboardingProfile.goal)

  return (
    <Screen dataScreen="training-goal-collect">
      <PageHeader backTo={routes.onboardingBasic} eyebrow="Goal" title="训练目标采集" variant="compact" />
      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-36 bg-[url('/figma/training-goal-collect.png')] bg-cover bg-top" />
      </div>
      <GroupedSection className="space-y-4">
        <SectionHeader kicker="PRIMARY" title="选择主要目标" />
        <div className="grid gap-2.5">
          {goals.map((option) => (
            <button
              className={`rounded-[var(--radius-row)] border px-4 py-4 text-left text-[16px] font-semibold transition ${goal === option ? 'border-[var(--border-selected)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]' : 'border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-primary)]'}`}
              key={option}
              onClick={() => setGoal(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </GroupedSection>
      <Button
        className="w-full"
        onClick={() => {
          actions.updateTrainingPreferences({ ...state.profileSettings.trainingPreferences, goal })
          navigate(routes.onboardingBaseCollect)
        }}
      >
        保存训练目标
      </Button>
    </Screen>
  )
}

export function TrainingBaseCollectScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const [experienceLevel, setExperienceLevel] = useState(state.onboardingProfile.experienceLevel)

  return (
    <Screen dataScreen="training-base-collect">
      <PageHeader backTo={routes.onboardingGoalCollect} eyebrow="Training Base" title="训练基础采集" variant="compact" />
      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-36 bg-[url('/figma/training-base-collect.png')] bg-cover bg-top" />
      </div>
      <GroupedSection className="space-y-4">
        <SectionHeader kicker="LEVEL" title="你的训练基础" />
        <div className="grid gap-2.5">
          {bases.map((option) => (
            <button
              className={`rounded-[var(--radius-row)] border px-4 py-4 text-left text-[16px] font-semibold transition ${experienceLevel === option ? 'border-[var(--border-selected)] bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]' : 'border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-primary)]'}`}
              key={option}
              onClick={() => setExperienceLevel(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </GroupedSection>
      <Button
        className="w-full"
        onClick={() => {
          actions.saveOnboardingProfile({ ...state.onboardingProfile, experienceLevel })
          navigate(routes.onboardingWorkStatus)
        }}
      >
        保存训练基础
      </Button>
    </Screen>
  )
}

export function WorkStatusCollectScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const [bodyStatus, setBodyStatus] = useState(state.onboardingProfile.bodyStatus)

  return (
    <Screen dataScreen="work-status-collect">
      <PageHeader backTo={routes.onboardingBaseCollect} eyebrow="Daily State" title="工作状态采集" variant="compact" />
      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-36 bg-[url('/figma/work-status-collect.png')] bg-cover bg-top" />
      </div>
      <GroupedSection className="space-y-4">
        <SectionHeader kicker="RECOVERY" title="日常状态" />
        <div className="grid gap-2.5">
          {workStates.map((option) => (
            <button
              className={`rounded-[var(--radius-row)] border px-4 py-4 text-left text-[16px] font-semibold transition ${bodyStatus === option ? 'border-[var(--border-selected)] bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]' : 'border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-primary)]'}`}
              key={option}
              onClick={() => setBodyStatus(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
      </GroupedSection>
      <Button
        className="w-full"
        onClick={() => {
          actions.saveOnboardingProfile({ ...state.onboardingProfile, bodyStatus })
          navigate(routes.onboardingSummary)
        }}
      >
        保存日常状态
      </Button>
    </Screen>
  )
}

export function ProfileSummaryScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="profile-summary">
      <PageHeader backTo={routes.onboardingWorkStatus} eyebrow="Summary" title="基础信息集成" variant="compact" />
      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-36 bg-[url('/figma/profile-summary.png')] bg-cover bg-top" />
      </div>
      <GroupedSection className="space-y-3">
        <InsetRow copy={`${state.bodyData.heightCm} cm · ${state.bodyData.weightKg} kg · 体脂 ${state.bodyData.bodyFatPercent}%`} icon={Ruler} title="身体数据" tone="primary" />
        <InsetRow copy={state.onboardingProfile.goal} icon={Target} title="训练目标" tone="indigo" />
        <InsetRow copy={state.onboardingProfile.experienceLevel} icon={Dumbbell} title="训练基础" tone="mint" />
        <InsetRow copy={state.onboardingProfile.bodyStatus} icon={BriefcaseBusiness} title="日常状态" tone="amber" />
      </GroupedSection>
      <GroupedSection className="space-y-3" variant="inset">
        <Badge className="w-fit" variant="mint">
          <CheckCircle2 className="size-3.5" />
          已整合
        </Badge>
        <InsetRow copy="下一步继续完成 10 题训练问卷，生成可识别器械优先的训练计划。" icon={BatteryMedium} title="进入训练问卷" tone="indigo" />
      </GroupedSection>
      <div className="grid gap-3">
        <Button asChild>
          <Link to={routes.onboarding}>继续 10 题问卷</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to={routes.planLoading}>直接生成方案</Link>
        </Button>
      </div>
    </Screen>
  )
}
