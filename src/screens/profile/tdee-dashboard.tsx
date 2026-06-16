import { Activity, Flame, Target, Utensils } from 'lucide-react'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Progress } from '@/components/ui/progress'
import { usePrototypeState } from '@/prototype/state'

function calcBmr(weightKg: number, heightCm: number) {
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * 27 + 5)
}

export function TdeeDashboardScreen() {
  const { state } = usePrototypeState()
  const bmr = calcBmr(state.bodyData.weightKg, state.bodyData.heightCm)
  const tdee = Math.round(bmr * 1.55)
  const target = state.onboardingProfile.goal.includes('增肌') ? tdee + 250 : tdee - 350
  const consumed = 1380
  const progress = Math.min(100, Math.round((consumed / target) * 100))

  return (
    <Screen dataScreen="tdee-dashboard">
      <PageHeader backTo={routes.app.profile} eyebrow="Energy" title="TDEE 能量仪表盘" variant="compact" />

      <div className="grid gap-3">
        <MetricCard label="今日目标" value={`${target} kcal`} hint={`${state.onboardingProfile.goal} · ${state.onboardingProfile.weeklyFrequency}`} tone="indigo" variant="feature" />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="基础代谢" value={`${bmr}`} hint="BMR" tone="mint" variant="compact" />
          <MetricCard label="日消耗" value={`${tdee}`} hint="TDEE" tone="amber" variant="compact" />
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="TODAY" title="今日能量进度" />
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[14px] font-medium text-[var(--text-secondary)]">
            <span>已记录 {consumed} kcal</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow copy="训练日优先保证蛋白质和训练前后碳水。" icon={Utensils} title="饮食建议" tone="mint" />
        <InsetRow copy="如果今晚训练强度偏高，晚餐不要过度压低主食。" icon={Flame} title="能量提示" tone="amber" />
        <InsetRow copy={`${state.bodyData.heightCm} cm · ${state.bodyData.weightKg} kg · 体脂 ${state.bodyData.bodyFatPercent}%`} icon={Activity} title="身体数据来源" tone="primary" />
        <InsetRow copy={state.onboardingProfile.goal} icon={Target} title="目标联动" tone="indigo" />
      </GroupedSection>
    </Screen>
  )
}
