import { CheckCircle2, PlusCircle, Search, XCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'
import { equipmentOptions } from './equipment-options'

export function AddExerciseScreen() {
  const { state, actions } = usePrototypeState()
  const [query, setQuery] = useState('')

  const filteredOptions = useMemo(() => {
    const keyword = query.trim().toLowerCase()

    if (!keyword) {
      return equipmentOptions
    }

    return equipmentOptions.filter(
      (option) =>
        option.name.toLowerCase().includes(keyword) ||
        option.machine.toLowerCase().includes(keyword) ||
        option.focus.toLowerCase().includes(keyword),
    )
  }, [query])

  return (
    <Screen dataScreen="add-exercise">
      <PageHeader backTo={routes.app.planStructure} eyebrow="Exercise Library" title="添加动作" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-32 bg-[var(--surface-subtle)] bg-[url('/figma/add-exercise.png')] bg-cover bg-top" />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="mint">
            视觉模型可识别
          </Badge>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">这里的动作都对应当前 YOLO 模型支持的器械类别，添加后会保存在本地计划草稿中。</p>
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SEARCH" title="查找动作" />
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[var(--text-tertiary)]" />
          <Input className="pl-11" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索器械或训练部位" />
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SUPPORTED" title="支持动作列表" />
        <div className="grid gap-2.5">
          {filteredOptions.map((option) => {
            const selected = state.planLibrary.selectedExercises.includes(option.name)

            return (
              <InteractiveRow
                copy={`${option.focus} · ${option.machine}`}
                icon={selected ? CheckCircle2 : PlusCircle}
                key={option.machine}
                onClick={() => {
                  if (selected) {
                    actions.removePlanExercise(option.name)
                    return
                  }

                  actions.addPlanExercise(option.name)
                }}
                title={option.name}
                tone={option.tone}
                trailing={
                  selected ? (
                    <Badge variant="mint">已添加</Badge>
                  ) : (
                    <Badge variant="outline">
                      <PlusCircle className="size-3.5" />
                      添加
                    </Badge>
                  )
                }
              />
            )
          })}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-2" variant="inset">
        <Badge className="w-fit" variant="default">
          已选 {state.planLibrary.selectedExercises.length} 个动作
        </Badge>
        {state.planLibrary.selectedExercises.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {state.planLibrary.selectedExercises.map((exercise) => (
              <button
                className="inline-flex items-center gap-1 rounded-[14px] bg-[var(--surface-raised)] px-3 py-2 text-[13px] font-semibold text-[var(--text-primary)]"
                key={exercise}
                onClick={() => actions.removePlanExercise(exercise)}
                type="button"
              >
                {exercise}
                <XCircle className="size-3.5 text-[var(--text-tertiary)]" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">先添加 1-2 个动作，就能串起识别、训练和反馈流程。</p>
        )}
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.planStructure}>完成添加</Link>
      </Button>
    </Screen>
  )
}
