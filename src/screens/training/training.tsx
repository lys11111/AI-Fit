import { Activity, Camera, PlayCircle, ScanLine, Sparkles } from 'lucide-react'

import { routes } from '@/app/routes'
import { ActionTile, GroupedSection, HeroPanel, InsetRow, MetricCard, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { completionStats, coachCards, todayPlan } from '@/data'
import { textRoleClasses } from '@/lib/design-system'
import { usePrototypeState } from '@/prototype/state'

export function TrainingScreen() {
  const { state } = usePrototypeState()
  const [completed, sets, duration] = completionStats
  const feedback = state.training.lastFeedback

  return (
    <Screen dataScreen="training">
      <div className="space-y-2 pt-2">
        <p className={textRoleClasses.meta}>训练中心</p>
        <h1 className={textRoleClasses.pageTitlePrimary}>今天先把 {state.plan.focusPreference} 的质量练到位。</h1>
        <p className={textRoleClasses.body}>{state.plan.summary}</p>
      </div>

      <HeroPanel
        badge={state.plan.match}
        copy={`当前计划来自 ${state.onboardingProfile.goal}、${state.onboardingProfile.preferredWindow} 和 ${state.onboardingProfile.equipmentPreference}。`}
        title="今日动作顺序"
        visual={
          <div className="grid gap-2.5">
            <div className="flex items-center justify-end">
              <Badge variant="outline">{state.onboardingProfile.sessionDuration} 主线训练</Badge>
            </div>
            {todayPlan.exercises.map((exercise, index) => (
              <InsetRow
                copy={`${exercise.sets} 组 · ${exercise.reps}`}
                key={exercise.name}
                title={exercise.name}
                tone="primary"
                trailing={<span className="text-[14px] font-semibold text-[var(--accent-primary-ink)]">{index === 0 ? state.plan.focusPreference : exercise.focus}</span>}
              />
            ))}
          </div>
        }
      />

      <div className="grid gap-3">
        <MetricCard hint={duration.hint} label={duration.label} tone="amber" value={duration.value} variant="feature" />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard hint={completed.hint} label={completed.label} tone="mint" value={completed.value} variant="compact" />
          <MetricCard hint={sets.hint} label={sets.label} tone="mint" value={sets.value} variant="compact" />
        </div>
      </div>

      {feedback ? (
        <GroupedSection className="space-y-3" variant="inset">
          <SectionHeader kicker="LAST FEEDBACK" title="上次反馈已写回" tone="muted" />
          <InsetRow copy={feedback.note} icon={Sparkles} meta={`动作稳定性：${feedback.stability}`} title={`${feedback.tag} · RPE ${feedback.rpe}`} tone="indigo" />
        </GroupedSection>
      ) : null}

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="FORM FOCUS" title="今日教练建议" />
        <div className="grid gap-2.5">
          {coachCards.map((card, index) => (
            <InsetRow
              copy={index === 0 ? `${card.copy} 当前主线会优先盯住 ${state.plan.focusPreference}。` : card.copy}
              icon={index === 0 ? Activity : index === 1 ? Sparkles : ScanLine}
              key={card.title}
              meta={card.title}
              title={index === 0 ? state.plan.focusPreference : card.value}
              tone={index === 2 ? 'amber' : 'primary'}
            />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <SectionHeader kicker="SESSION TOOLS" title="进入训练流程" />
        <ActionTile helperText="这是主入口，会把动作、反馈和总结串成一条可复测的训练闭环。" icon={PlayCircle} meta="真闭环" title="开始训练 Session" to={routes.app.workout} variant="emphasized" />
        <ActionTile helperText="当前是辅助工具页，只提供动作提醒，不会直接写回评分或计划调整。" icon={Camera} meta="辅助工具页" title="打开实时动作纠正" to={routes.app.live} tone="indigo" />
        <ActionTile helperText="当前是说明页，用来承接技术理解，不会假装已经接入真实学习路径。" icon={ScanLine} meta="展示说明页" title="学习动作要点" to={routes.app.exercise} tone="amber" />
      </div>
    </Screen>
  )
}
