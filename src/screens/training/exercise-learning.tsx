import { ArrowDownToLine, ListChecks, ScanLine, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { exerciseLearningCards } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function ExerciseLearningScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="exercise-learning">
      <PageHeader
        backTo={routes.app.training}
        title="动作学习"
        description="把动作要点、常见错误和训练提示放在一起，训练前快速确认发力重点。"
        variant="compact"
      />

      <Badge className="w-fit" variant="amber">
        训练前快速学习
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

      <div className="grid gap-3">
        <Button asChild className="w-full">
          <Link to={routes.app.exerciseDetailLat}>
            查看高位下拉动作详情
          </Link>
        </Button>
      </div>

      <Button asChild className="w-full" variant="secondary">
        <Link to={routes.app.supportedActions}>
          <ListChecks className="size-4" />
          查看支持动作列表
        </Link>
      </Button>
    </Screen>
  )
}
