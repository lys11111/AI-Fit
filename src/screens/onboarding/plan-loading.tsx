import { Activity, Dumbbell, Salad, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

export function PlanLoadingScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="plan-loading" density="compact">
      <PageHeader
        backTo={routes.onboarding}
        title="正在生成训练计划"
        description="AI 正在综合你的目标、训练基础、恢复速度和可用器械，生成适合今天开始执行的计划。"
        variant="compact"
      />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="space-y-2">
          <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-primary-ink)]">AI MATCHING</p>
          <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">已锁定可识别器械动作</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
            {state.onboardingProfile.goal} · {state.onboardingProfile.preferredWindow} · {state.onboardingProfile.sessionDuration} ·{' '}
            {state.onboardingProfile.trainingPlace}
          </p>
        </div>
        <div className="grid gap-2.5">
          <InsetRow title="动作库匹配" copy={`今天优先围绕 ${state.plan.focusPreference}，并使用视觉模型支持的固定器械动作。`} icon={Dumbbell} tone="primary" />
          <InsetRow title="饮食补给提示" copy={state.plan.nutritionNudge} icon={Salad} tone="amber" />
          <InsetRow title="节奏与恢复兜底" copy={state.plan.summary} icon={Activity} tone="indigo" />
        </div>
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.planPreview}>
          查看 AI 推荐结果
          <Sparkles className="size-4" />
        </Link>
      </Button>
    </Screen>
  )
}
