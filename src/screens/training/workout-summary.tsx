import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, MetricCard, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { completionStats, workoutSummary } from '@/data'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

export function WorkoutSummaryScreen() {
  const { state } = usePrototypeState()
  const feedback = state.training.lastFeedback
  const [completed, sets, duration] = completionStats

  return (
    <Screen dataScreen="workout-summary">
      <PageHeader
        backTo={routes.app.live}
        title="训练总结"
        description="这一页开始把刚才的反馈真正写回训练闭环：先告诉你今天练得怎么样，再把下一次该怎么调讲清楚。"
        variant="compact"
      />

      <Badge className="w-fit" variant="mint">
        真闭环 · 第 4 步 / 5 步
      </Badge>

      {feedback ? (
        <GroupedSection className="space-y-3" variant="inset">
          <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">FEEDBACK SAVED</p>
          <p className="text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]">本次组后反馈已写回</p>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
            {feedback.tag} · RPE {feedback.rpe} · {feedback.stability} · {formatClock(feedback.savedAt)}
          </p>
        </GroupedSection>
      ) : null}

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">SESSION SCORE</p>
        <div className="grid gap-3">
          {workoutSummary.scores.map((score, index) => (
            <div key={score.name} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[14px] font-medium text-[var(--text-primary)]">{score.name}</span>
                <span className="text-[14px] text-[var(--text-secondary)]">{score.score} / 100</span>
              </div>
              <div className="h-2.5 rounded-full bg-[var(--surface-subtle)]">
                <div
                  className={`h-full rounded-full ${index === 1 ? 'bg-[var(--accent-indigo-solid)]' : index === 2 ? 'bg-[var(--accent-amber-solid)]' : 'bg-[var(--accent-primary-solid)]'}`}
                  style={{ width: `${score.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <MetricCard label={completed.label} value={completed.value} hint={completed.hint} tone="indigo" variant="inline" />
        <MetricCard label={sets.label} value={sets.value} hint={sets.hint} tone="mint" variant="inline" />
        <MetricCard label={duration.label} value={duration.value} hint={duration.hint} tone="amber" variant="inline" />
      </div>

      <GroupedSection className="space-y-2">
        <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">BEST MOMENT</p>
        <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">今天练得最顺的地方</h2>
        <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{workoutSummary.best}</p>
      </GroupedSection>

      <GroupedSection className="space-y-2">
        <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">NEXT FIX</p>
        <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">下次先修这里</h2>
        <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
          {workoutSummary.improve} 今天这条主线仍然围绕 {state.plan.focusPreference} 来看。
        </p>
        {feedback ? <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">你补充的主观反馈：{feedback.note}</p> : null}
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.assessment}>查看明日调整建议</Link>
      </Button>
    </Screen>
  )
}
