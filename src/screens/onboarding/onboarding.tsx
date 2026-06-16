import { Check, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

const goalOptions = ['减脂塑形', '增肌推进', '维持体能'] as const
const frequencyOptions = ['每周 3 次', '每周 4 次', '每周 5 次'] as const
const windowOptions = ['晨间训练', '午间训练', '晚间训练'] as const
const durationOptions = ['30 分钟', '45 分钟', '60 分钟'] as const
const equipmentOptions = ['固定器械优先', '哑铃自由重量', '居家轻器械'] as const
const focusOptions = ['背部发力', '肩胛控制', '回程速度'] as const

function OptionButtons({
  options,
  selected,
  onSelect,
}: {
  options: readonly string[]
  selected: string
  onSelect: (value: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <Button key={option} onClick={() => onSelect(option)} type="button" variant={selected === option ? 'default' : 'secondary'}>
          {option}
        </Button>
      ))}
    </div>
  )
}

export function OnboardingScreen() {
  const { state, actions } = usePrototypeState()
  const [form, setForm] = useState({
    goal: state.onboardingProfile.goal,
    weeklyFrequency: state.onboardingProfile.weeklyFrequency,
    preferredWindow: state.onboardingProfile.preferredWindow,
    sessionDuration: state.onboardingProfile.sessionDuration,
    equipmentPreference: state.onboardingProfile.equipmentPreference,
    focusPreference: state.onboardingProfile.focusPreference,
  })

  return (
    <Screen dataScreen="onboarding">
      <PageHeader
        backTo={routes.login}
        title="训练偏好问卷"
        description="这一步不再只是展示默认答案。你现在改的目标、时间、器械和主线关注点，会直接影响下一页的计划预览和进入首页后的训练文案。"
        variant="secondary"
      />

      {state.onboardingProfile.lastCompletedAt ? (
        <Badge className="w-fit" variant="mint">
          上一次问卷结果已保存，这次改动会覆盖后续计划
        </Badge>
      ) : null}

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="GOAL" title="这次先锁定主线" />
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">训练目标</span>
            <OptionButtons options={goalOptions} onSelect={(value) => setForm((current) => ({ ...current, goal: value }))} selected={form.goal} />
          </div>
          <div className="space-y-2">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">每周频率</span>
            <OptionButtons
              options={frequencyOptions}
              onSelect={(value) => setForm((current) => ({ ...current, weeklyFrequency: value }))}
              selected={form.weeklyFrequency}
            />
          </div>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SCHEDULE" title="把训练节奏说清楚" />
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">训练时间</span>
            <OptionButtons
              options={windowOptions}
              onSelect={(value) => setForm((current) => ({ ...current, preferredWindow: value }))}
              selected={form.preferredWindow}
            />
          </div>
          <div className="space-y-2">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">单次时长</span>
            <OptionButtons
              options={durationOptions}
              onSelect={(value) => setForm((current) => ({ ...current, sessionDuration: value }))}
              selected={form.sessionDuration}
            />
          </div>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SETUP" title="让计划更像你的训练场景" />
        <div className="space-y-4">
          <div className="space-y-2">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">器械偏好</span>
            <OptionButtons
              options={equipmentOptions}
              onSelect={(value) => setForm((current) => ({ ...current, equipmentPreference: value }))}
              selected={form.equipmentPreference}
            />
          </div>
          <div className="space-y-2">
            <span className="text-[14px] font-medium text-[var(--text-primary)]">今天优先关注</span>
            <OptionButtons
              options={focusOptions}
              onSelect={(value) => setForm((current) => ({ ...current, focusPreference: value }))}
              selected={form.focusPreference}
            />
          </div>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4" variant="inset">
        <SectionHeader kicker="WHAT CHANGES NEXT" title="下一页会用这些输入做什么" tone="muted" />
        <div className="grid gap-2.5">
          <InsetRow icon={Check} title="计划标题与摘要" copy={`${form.goal} · ${form.preferredWindow} · ${form.sessionDuration}`} tone="mint" />
          <InsetRow icon={Check} title="首页教练提醒" copy={`围绕 ${form.focusPreference} 和 ${form.equipmentPreference} 给出当天主线。`} tone="primary" />
          <InsetRow icon={Check} title="训练中心与总结页" copy="会延续同一套主线词汇，不再各讲各的。" tone="indigo" />
        </div>
      </GroupedSection>

      <Button asChild className="w-full">
        <Link
          to={routes.planLoading}
          onClick={() =>
            actions.saveOnboardingProfile({
              goal: form.goal,
              weeklyFrequency: form.weeklyFrequency,
              preferredWindow: form.preferredWindow,
              sessionDuration: form.sessionDuration,
              equipmentPreference: form.equipmentPreference,
              focusPreference: form.focusPreference,
            })
          }
        >
          继续生成训练计划
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </Screen>
  )
}
