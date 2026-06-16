import { Activity, Dumbbell, Salad } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

export function PlanLoadingScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="plan-loading" density="compact">
      <PageHeader
        backTo={routes.onboarding}
        title="正在整理你的训练计划"
        description="这一页不只是过场。它会把刚才问卷里的目标、时间和器械偏好明确地映射到后面的训练计划里。"
        variant="compact"
      />

      <Badge className="w-fit" variant="indigo">
        辅助闭环 · 会承接问卷输入
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="space-y-2">
          <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">MATCHING INPUTS</p>
          <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">先把训练条件讲清楚，再进入计划预览</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
            {state.onboardingProfile.goal} · {state.onboardingProfile.preferredWindow} · {state.onboardingProfile.sessionDuration} ·{' '}
            {state.onboardingProfile.equipmentPreference}
          </p>
        </div>
        <div className="grid gap-2.5">
          <InsetRow title="训练主线对齐" copy={`今天优先围绕 ${state.plan.focusPreference} 来组织动作和提醒。`} icon={Dumbbell} tone="primary" />
          <InsetRow title="饮食补给提示" copy={state.plan.nutritionNudge} icon={Salad} tone="amber" />
          <InsetRow title="节奏与恢复兜底" copy={state.plan.summary} icon={Activity} tone="indigo" />
        </div>
      </GroupedSection>

      <Button asChild className="w-full" variant="secondary">
        <Link to={routes.planPreview}>查看计划预览</Link>
      </Button>
    </Screen>
  )
}
