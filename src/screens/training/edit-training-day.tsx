import { CalendarCheck2, GripVertical, PlusCircle, Save, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, InteractiveRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

export function EditTrainingDayScreen() {
  const { state, actions } = usePrototypeState()
  const selectedExercises = state.planLibrary.selectedExercises
  const visibleExercises =
    selectedExercises.length > 0
      ? selectedExercises
      : state.plan.exercises.map((exercise) => `${exercise.name} · ${exercise.machineClass}`)

  const saveDay = () => {
    actions.createTrainingPlan({
      name: state.planLibrary.activePlanName,
      split: state.planLibrary.trainingSplit,
      weeklyDays: state.planLibrary.weeklyDays,
    })
  }

  return (
    <Screen dataScreen="edit-training-day">
      <PageHeader backTo={routes.app.planStructure} eyebrow="Training Day" title="编辑训练日" variant="compact" />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">DAY 1</p>
            <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">主训练日</h2>
            <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{state.planLibrary.trainingSplit} · 每周 {state.planLibrary.weeklyDays} 天</p>
          </div>
          <Badge variant="mint">{visibleExercises.length} 个动作</Badge>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader actionLabel="继续添加" actionTo={routes.app.planAddExercise} kicker="EXERCISES" title="动作顺序" />
        <div className="grid gap-2.5">
          {visibleExercises.map((exercise, index) => {
            const removable = selectedExercises.includes(exercise)

            return (
              <InteractiveRow
                copy={index === 0 ? '建议作为训练日主动作，优先完成高质量组。' : '根据当天状态控制组数和休息。'}
                icon={removable ? GripVertical : CalendarCheck2}
                key={`${exercise}-${index}`}
                meta={`动作 ${index + 1}`}
                onClick={removable ? () => actions.removePlanExercise(exercise) : undefined}
                title={exercise}
                tone={index === 0 ? 'primary' : 'mint'}
                trailing={
                  removable ? (
                    <Badge variant="outline">
                      <Trash2 className="size-3.5" />
                      移除
                    </Badge>
                  ) : (
                    <Badge variant="mint">AI 推荐</Badge>
                  )
                }
              />
            )
          })}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow copy="保存后会更新本地计划的编辑时间，刷新页面仍保留。" icon={Save} title="训练日保存" tone="indigo" />
        {state.planLibrary.lastEditedAt ? (
          <Badge className="w-fit" variant="mint">
            已保存 · {formatClock(state.planLibrary.lastEditedAt)}
          </Badge>
        ) : null}
      </GroupedSection>

      <div className="grid grid-cols-[0.9fr_1.1fr] gap-3">
        <Button asChild variant="secondary">
          <Link to={routes.app.planAddExercise}>
            <PlusCircle className="size-4" />
            加动作
          </Link>
        </Button>
        <Button onClick={saveDay}>
          <Save className="size-4" />
          保存训练日
        </Button>
      </div>
    </Screen>
  )
}
