import { CheckCircle2, Dumbbell, Layers3 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { textRoleClasses } from '@/lib/design-system'
import { usePrototypeState } from '@/prototype/state'

const splitOptions = ['全身循环', '胸背腿肩分化', '上肢 / 下肢', '推 / 拉 / 腿'] as const
const dayOptions = [2, 3, 4, 5, 6] as const

export function PlanBuilderScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const [name, setName] = useState(state.planLibrary.activePlanName || 'AI-FIT 新训练计划')
  const [split, setSplit] = useState(state.planLibrary.trainingSplit || splitOptions[1])
  const [weeklyDays, setWeeklyDays] = useState(state.planLibrary.weeklyDays || 4)

  const savePlan = () => {
    actions.createTrainingPlan({ name: name.trim() || 'AI-FIT 新训练计划', split, weeklyDays })
    navigate(routes.app.planStructure)
  }

  return (
    <Screen dataScreen="plan-builder">
      <PageHeader backTo={routes.app.training} eyebrow="Plan" title="新建训练计划" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-36 bg-[var(--surface-subtle)] bg-[url('/figma/new-plan.png')] bg-cover bg-top" />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="mint">
            <CheckCircle2 className="size-3.5" />
            保存到本地
          </Badge>
          <h2 className={textRoleClasses.sectionTitle}>把目标拆成可执行的每周结构</h2>
          <p className={textRoleClasses.body}>先确定计划名称、训练分化和每周训练天数，下一步再细化每天动作。</p>
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="BASIC" title="计划基础信息" />
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">计划名称</span>
          <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="例如：四天胸背腿肩计划" />
        </label>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SPLIT" title="训练结构" />
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
        <SectionHeader kicker="WEEKLY" title="每周训练天数" />
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

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow
          copy={`${split} · 每周 ${weeklyDays} 天 · 当前已有 ${state.planLibrary.selectedExercises.length} 个自选动作`}
          icon={Layers3}
          meta="当前草稿"
          title={name || 'AI-FIT 新训练计划'}
          tone="indigo"
        />
        <InsetRow copy="下一步可以添加当前视觉模型可识别的固定器械动作。" icon={Dumbbell} title="动作范围已限定到可识别器械" tone="mint" />
      </GroupedSection>

      <Button className="w-full" onClick={savePlan}>
        保存并设置训练结构
      </Button>
    </Screen>
  )
}
