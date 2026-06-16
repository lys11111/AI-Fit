import { ArrowDownToLine, ScanLine, Sparkles } from 'lucide-react'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { exerciseLearningCards } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function ExerciseLearningScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="exercise-learning">
      <PageHeader
        backTo={routes.app.training}
        title="动作学习"
        description="这一页先承担说明作用：把技术要点讲清楚，帮助你带着同一条主线回到训练 Session，而不是伪装成完整课程。"
        variant="compact"
      />

      <Badge className="w-fit" variant="amber">
        展示说明页 · 服务训练主线
      </Badge>

      <GroupedSection className="space-y-4">
        <SectionHeader title={`高位下拉怎么围绕 ${state.plan.focusPreference} 做得更稳`} kicker="MOVEMENT NOTES" />
        <div className="grid gap-2.5">
          {exerciseLearningCards.map((card, index) => (
            <InsetRow
              key={card.title}
              title={card.title}
              copy={index === 1 ? `${card.copy} 今天先把 ${state.plan.focusPreference} 当成优先检查项。` : card.copy}
              icon={index === 0 ? ArrowDownToLine : index === 1 ? Sparkles : ScanLine}
              tone={index === 2 ? 'amber' : 'indigo'}
            />
          ))}
        </div>
      </GroupedSection>
    </Screen>
  )
}
