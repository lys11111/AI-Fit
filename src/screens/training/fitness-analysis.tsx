import { Loader2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

export function FitnessAnalysisScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="fitness-analysis">
      <PageHeader backTo={routes.app.fitnessChat} eyebrow="Analyzing" title="AI 分析中" variant="compact" />

      <GroupedSection className="space-y-5 border-[var(--border-strong)] bg-[var(--surface-raised)] text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-[28px] bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]">
          <Loader2 className="size-9 animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">正在整理训练建议</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">已结合你的问题、今日计划、训练重点和已识别器械。</p>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow copy={state.aiCoach.lastQuestion} icon={Sparkles} title="当前问题" tone="indigo" />
        <InsetRow copy={`${state.plan.focusPreference} · ${state.equipment.lastDetectedLabel ?? state.plan.exercises[0]?.machineClass ?? 'Lat Pull Down'}`} title="参考信息" tone="mint" />
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.fitnessResult}>查看分析结果</Link>
      </Button>
    </Screen>
  )
}
