import { ChevronRight, TimerReset, Waves } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { workoutCues } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function WorkoutSessionScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="workout-session">
      <PageHeader
        backTo={routes.app.training}
        title="训练 Session"
        description="这是训练闭环里的执行页。它负责把今天的主线关注点、组间提醒和后续反馈入口放到同一条流程里。"
        variant="compact"
      />

      <Badge className="w-fit" variant="mint">
        真闭环 · 第 2 步 / 5 步
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[var(--radius-row)] bg-[var(--surface-subtle)] px-4 py-4">
            <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">CURRENT SET</p>
            <p className="mt-2 text-[26px] leading-[28px] font-semibold text-[var(--text-primary)]">高位下拉</p>
            <p className="mt-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">第 3 / 4 组 · 12 次目标</p>
          </div>
          <div className="rounded-[var(--radius-row)] bg-[var(--surface-subtle)] px-4 py-4">
            <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">REST TIMER</p>
            <p className="mt-2 text-[26px] leading-[28px] font-semibold text-[var(--text-primary)]">01:20</p>
            <p className="mt-1 text-[14px] leading-[21px] text-[var(--text-secondary)]">下一组前先把呼吸和肩位收稳。</p>
          </div>
        </div>
        <SectionHeader title="本组提示" kicker="IN-SET CUES" />
        <div className="grid gap-2.5">
          {workoutCues.map((cue, index) => (
            <InsetRow key={cue} title={index === 0 ? `${cue} · 今日主线 ${state.plan.focusPreference}` : cue} icon={Waves} tone="primary" />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <Button asChild className="w-full">
          <Link to={routes.app.live}>
            打开实时动作纠正
            <ChevronRight className="size-4" />
          </Link>
        </Button>
        <Button asChild className="w-full" variant="secondary">
          <Link to={routes.app.feedback}>
            去做组后反馈
            <TimerReset className="size-4" />
          </Link>
        </Button>
      </div>
    </Screen>
  )
}
