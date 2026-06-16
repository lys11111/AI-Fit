import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { assessmentAdjustments } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function PlanAssessmentScreen() {
  const { state } = usePrototypeState()
  const feedback = state.training.lastFeedback

  return (
    <Screen dataScreen="plan-assessment">
      <PageHeader
        backTo={routes.app.summary}
        title="计划调整建议"
        description="这里负责把今天的反馈变成下一次训练的决策依据，而不是停留在一页漂亮的总结里。"
        variant="compact"
      />

      <Badge className="w-fit" variant="mint">
        计划调整 · 第 5 步 / 5 步
      </Badge>

      {feedback ? (
        <GroupedSection className="space-y-2" variant="inset">
          <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">INPUT RECEIVED</p>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
            本次建议会同时参考你的主线关注点 {state.plan.focusPreference}，以及刚才补充的 {feedback.tag} · {feedback.stability}。
          </p>
        </GroupedSection>
      ) : null}

      {feedback?.modelAdvice ? (
        <GroupedSection className="space-y-2" variant="inset">
          <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">LOCAL MODEL</p>
          <h2 className="text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]">{feedback.modelAdvice.nextCue}</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{feedback.modelAdvice.adjustment}</p>
        </GroupedSection>
      ) : null}

      <div className="grid gap-3">
        {assessmentAdjustments.map((item, index) => (
          <GroupedSection key={item.kicker} className="space-y-3">
            <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">{item.kicker}</p>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]">{item.title}</h2>
                <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
                  {item.copy}
                  {index === 0 ? ` 明天仍然优先围绕 ${state.plan.focusPreference} 去修正动作质量。` : ''}
                </p>
              </div>
              <p className="text-[24px] leading-[29px] font-semibold text-[var(--accent-primary-ink)]">{item.value}</p>
            </div>
          </GroupedSection>
        ))}
      </div>

      <Button asChild className="w-full">
        <Link to={routes.app.training}>回到训练继续使用</Link>
      </Button>
    </Screen>
  )
}
