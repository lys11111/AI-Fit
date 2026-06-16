import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { todayPlan } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function PlanPreviewScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="plan-preview">
      <PageHeader
        backTo={routes.planLoading}
        title="计划预览"
        description="这里负责把问卷输入和训练主线接上。进入首页后，你看到的标题、教练提醒和训练总结都沿用这一份计划快照。"
        variant="secondary"
      />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Badge variant="default">{state.plan.match}</Badge>
          <Badge variant="outline">{state.onboardingProfile.sessionDuration} 内完成</Badge>
        </div>
        <div className="space-y-2">
          <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">{state.plan.title}</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{state.plan.summary}</p>
        </div>
        <div className="grid gap-2.5">
          {todayPlan.exercises.map((exercise, index) => (
            <InsetRow
              key={exercise.name}
              title={exercise.name}
              copy={`${exercise.sets} 组 · ${exercise.reps}`}
              tone={index === 0 ? 'mint' : 'primary'}
              trailing={<Badge variant={index === 0 ? 'mint' : 'outline'}>{index === 0 ? state.plan.focusPreference : exercise.focus}</Badge>}
            />
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4" variant="inset">
        <SectionHeader kicker="PLAN RATIONALE" title="这份计划为什么这样排" tone="muted" />
        <div className="grid gap-2.5">
          {state.plan.rationale.map((item) => (
            <InsetRow key={item.label} title={item.label} copy={item.value} />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <Button asChild className="w-full">
          <Link to={routes.app.home}>进入首页</Link>
        </Button>
        <Button asChild className="w-full" variant="secondary">
          <Link to={routes.onboarding}>返回修改问卷</Link>
        </Button>
      </div>
    </Screen>
  )
}
