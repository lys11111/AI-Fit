import { Dumbbell, Flame, MessageCircleHeart, Sparkles, Utensils } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { NotificationBell } from '@/components/app/notification-bell'
import { ActionTile, GroupedSection, HeroPanel, InsetRow, MessageBubble, MetricCard, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { completionStats, recognizedMeal, todayPlan } from '@/data'
import { textRoleClasses } from '@/lib/design-system'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

export function HomeScreen() {
  const { state } = usePrototypeState()
  const [completed, sets, duration] = completionStats
  const feedback = state.training.lastFeedback
  const lastSavedMealAt = state.nutrition.lastSavedMealAt

  const thread = feedback
    ? [
        {
          role: 'ai' as const,
          message: `已收到你上次“${feedback.tag}”的反馈，今天会继续把 ${state.plan.focusPreference} 放在优先位，同时把整体节奏压回 ${state.onboardingProfile.sessionDuration} 内。`,
          meta: '刚刚同步',
        },
        {
          role: 'user' as const,
          message: feedback.note || '这次整体还不错，但我还想继续把动作做得更稳一点。',
          meta: formatClock(feedback.savedAt),
        },
      ]
    : [
        {
          role: 'ai' as const,
          message: state.plan.coachIntro,
          meta: '今日主线',
        },
        {
          role: 'user' as const,
          message: `今晚先围绕 ${state.plan.focusPreference} 稳扎稳打，别把动作质量让给重量。`,
          meta: '准备开练',
        },
      ]

  return (
    <Screen dataScreen="home">
      <div className="flex items-start justify-between gap-4 pt-2">
        <div className="space-y-1.5">
          <p className={textRoleClasses.meta}>{state.onboardingProfile.preferredWindow}更适合把主线收紧一点</p>
          <h1 className={textRoleClasses.pageTitlePrimary}>晚安，先把这节 {state.onboardingProfile.sessionDuration} 的训练练漂亮。</h1>
        </div>
        <NotificationBell />
      </div>

      <HeroPanel
        badge={state.plan.match}
        copy={state.plan.summary}
        title={state.plan.title}
        visual={
          <div className="grid gap-2.5">
            {todayPlan.exercises.map((exercise, index) => (
              <InsetRow
                copy={`${exercise.sets} 组 · ${exercise.reps}`}
                key={exercise.name}
                title={exercise.name}
                tone="mint"
                trailing={<Badge variant="mint">{index === 0 ? state.plan.focusPreference : exercise.focus}</Badge>}
              />
            ))}
          </div>
        }
      />

      <div className="grid gap-3">
        <MetricCard hint={duration.hint} label={duration.label} tone="amber" value={duration.value} variant="feature" />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard hint={completed.hint} label={completed.label} tone="indigo" value={completed.value} variant="compact" />
          <MetricCard hint={sets.hint} label={sets.label} tone="mint" value={sets.value} variant="compact" />
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader actionLabel="去训练" actionTo={routes.app.training} kicker="COACH THREAD" title="AI 教练提醒" />
        <div className="grid gap-3">
          {thread.map((message) => (
            <MessageBubble key={`${message.meta}-${message.role}`} {...message} />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <SectionHeader kicker="TODAY FLOW" title="今天先做这些" />
        <ActionTile helperText="进入动作清单、实时纠正和组后反馈，跑完整条训练主线。" icon={Dumbbell} meta="训练主线" title="开始今日训练" to={routes.app.training} variant="emphasized" />
        <ActionTile helperText="看看今天的碳水和蛋白还差多少，再决定是否补一餐。" icon={Utensils} meta="饮食副线" title="去看饮食记录" to={routes.app.nutrition} tone="amber" />
        <ActionTile helperText="社区现在是展示页，用来说明轻社交方向，不会打断训练主线。" icon={MessageCircleHeart} meta="展示页" title="看看社区和训练搭子" to={routes.app.community} tone="indigo" />
      </div>

      <GroupedSection className="space-y-3" variant="inset">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-[var(--radius-row)] bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]">
            <Flame className="size-5" />
          </div>
          <div className="space-y-2">
            <Badge className="w-fit" variant={lastSavedMealAt ? 'mint' : 'amber'}>
              <Sparkles className="size-3.5" />
              {lastSavedMealAt ? '饮食已同步' : '今日建议'}
            </Badge>
            <p className={textRoleClasses.cardTitle}>
              {lastSavedMealAt ? `已把 ${recognizedMeal.name} 写回今日记录` : '训练前 90 分钟补一点轻碳水，今晚主线会更稳。'}
            </p>
            <p className={textRoleClasses.body}>
              {lastSavedMealAt
                ? `最近一次写回时间是 ${formatClock(lastSavedMealAt)}，现在可以直接回营养页或继续训练主线。`
                : state.plan.nutritionNudge}
            </p>
          </div>
        </div>
        <Button asChild className="w-fit" size="sm" variant="ghost">
          <Link to={routes.app.nutrition}>{lastSavedMealAt ? '回到营养页查看写回结果' : '查看营养建议'}</Link>
        </Button>
      </GroupedSection>
    </Screen>
  )
}
