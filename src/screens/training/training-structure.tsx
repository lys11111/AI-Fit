import { CalendarDays, CheckCircle2, Dumbbell, PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, InteractiveRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

const splitOptions = ['全身循环', '胸背腿肩分化', '上肢 / 下肢', '推 / 拉 / 腿'] as const
const dayOptions = [2, 3, 4, 5, 6] as const

export function TrainingStructureScreen() {
  const { state, actions } = usePrototypeState()
  const [split, setSplit] = useState(state.planLibrary.trainingSplit)
  const [weeklyDays, setWeeklyDays] = useState(state.planLibrary.weeklyDays)
  const planName = state.planLibrary.activePlanName

  const saveStructure = () => {
    actions.createTrainingPlan({ name: planName, split, weeklyDays })
  }

  return (
    <Screen dataScreen="training-structure">
      <PageHeader backTo={routes.app.training} eyebrow="Plan Structure" title="训练结构设置" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-32 bg-[var(--surface-subtle)] bg-[url('/figma/training-structure.png')] bg-cover bg-top" />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="default">
            {planName}
          </Badge>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">训练结构会影响每周日程、动作组合和后续训练日编辑。</p>
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SPLIT" title="选择训练分化" />
        <div className="grid gap-2.5">
          {splitOptions.map((option) => (
            <button
              className={`rounded-[var(--radius-row)] border px-4 py-3 text-left transition ${
                split === option
                  ? 'border-[var(--border-selected)] bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-primary)]'
              }`}
              key={option}
              onClick={() => setSplit(option)}
              type="button"
            >
              <span className="text-[15px] font-semibold">{option}</span>
            </button>
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="DAYS" title="每周训练天数" />
        <div className="grid grid-cols-5 gap-2">
          {dayOptions.map((day) => (
            <button
              className={`h-12 rounded-[16px] border text-[15px] font-semibold transition ${
                weeklyDays === day
                  ? 'border-[var(--border-selected)] bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]'
                  : 'border-[var(--border-subtle)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]'
              }`}
              key={day}
              onClick={() => setWeeklyDays(day)}
              type="button"
            >
              {day} 天
            </button>
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader actionLabel="添加动作" actionTo={routes.app.planAddExercise} kicker="WEEK" title="训练日安排" />
        <div className="grid gap-2.5">
          {Array.from({ length: weeklyDays }, (_, index) => (
            <InteractiveRow
              copy={index === 0 ? `${state.plan.focusPreference} · ${state.plan.exercises[0]?.name ?? '主线动作'}` : `${split} · 可继续添加动作`}
              icon={index === 0 ? Dumbbell : CalendarDays}
              key={index}
              meta={`DAY ${index + 1}`}
              title={index === 0 ? '主训练日' : `训练日 ${index + 1}`}
              tone={index === 0 ? 'primary' : 'mint'}
              to={routes.app.planEditDay}
            />
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow
          copy={`已选择 ${state.planLibrary.selectedExercises.length} 个自选动作，AI 推荐动作仍会保留在今日计划中。`}
          icon={PlusCircle}
          title="动作库"
          tone="indigo"
          trailing={
            <Button asChild size="sm" variant="secondary">
              <Link to={routes.app.planAddExercise}>添加</Link>
            </Button>
          }
        />
        {state.planLibrary.lastEditedAt ? (
          <Badge className="w-fit" variant="mint">
            <CheckCircle2 className="size-3.5" />
            已保存 · {formatClock(state.planLibrary.lastEditedAt)}
          </Badge>
        ) : null}
      </GroupedSection>

      <Button className="w-full" onClick={saveStructure}>
        保存训练结构
      </Button>
    </Screen>
  )
}
