import { CheckCircle2, Dumbbell, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

export function FitnessResultScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="fitness-result">
      <PageHeader backTo={routes.app.fitnessChat} eyebrow="Result" title="AI 推荐结果" variant="compact" />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <Badge className="w-fit" variant="mint">
          <CheckCircle2 className="size-3.5" />
          已生成
        </Badge>
        <div className="space-y-2">
          <h2 className="text-[22px] leading-[27px] font-semibold text-[var(--text-primary)]">训练调整建议</h2>
          <p className="text-[14px] leading-[22px] text-[var(--text-secondary)]">{state.aiCoach.recommendation}</p>
        </div>
        {state.aiCoach.lastUpdatedAt ? (
          <Badge className="w-fit" variant="outline">
            {formatClock(state.aiCoach.lastUpdatedAt)}
          </Badge>
        ) : null}
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="NEXT" title="下一步执行" />
        <InsetRow copy="先做一组低负荷试做，把建议中的发力顺序对齐。" icon={Dumbbell} title="低负荷校准" tone="mint" />
        <InsetRow copy="再进入器械识别和动作纠偏，按标准力线检查当前动作。" icon={Sparkles} title="摄像头纠偏" tone="indigo" />
      </GroupedSection>

      <div className="grid gap-3">
        <Button asChild>
          <Link to={routes.app.equipmentResult}>识别器械并纠偏</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to={routes.app.fitnessChat}>继续提问</Link>
        </Button>
      </div>
    </Screen>
  )
}
