import { Camera, Salad, UtensilsCrossed } from 'lucide-react'

import { routes } from '@/app/routes'
import { ActionTile, GroupedSection, InsetRow, MessageBubble, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { nutritionMessages } from '@/data'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

export function NutritionScreen() {
  const { state } = usePrototypeState()
  const lastSavedMealAt = state.nutrition.lastSavedMealAt

  return (
    <Screen dataScreen="nutrition">
      <PageHeader
        description="饮食页现在是一条稳定副线：拍照、识别确认、写回营养进度，再回到首页看状态变化。"
        eyebrow="Nutrition"
        title="饮食管理"
        variant="secondary"
      />

      <Badge className="w-fit" variant="mint">
        真闭环 · 可写回营养状态
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-[14px] leading-[20px] font-medium text-[var(--text-secondary)]">今日营养目标</p>
            <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">把训练日补给收进同一套记录里</h2>
          </div>
          <Badge variant="amber">{state.onboardingProfile.preferredWindow}训练日</Badge>
        </div>
        {lastSavedMealAt ? (
          <Badge className="w-fit" variant="mint">
            已写回记录 · {formatClock(lastSavedMealAt)}
          </Badge>
        ) : null}
        <div className="grid gap-4">
          {state.nutrition.targets.map((target) => (
            <div className="space-y-2" key={target.key}>
              <div className="flex items-center justify-between gap-3 text-[14px] leading-[20px]">
                <span className="font-medium text-[var(--text-primary)]">{target.label}</span>
                <span className="text-[var(--text-secondary)]">
                  {target.current}g / {target.goal}g
                </span>
              </div>
              <Progress
                className={
                  target.tone === 'mint'
                    ? '[&_[data-slot=progress-indicator]]:bg-[var(--accent-mint-solid)]'
                    : target.tone === 'amber'
                      ? '[&_[data-slot=progress-indicator]]:bg-[var(--accent-amber-solid)]'
                      : ''
                }
                value={Math.min(100, Math.round((target.current / target.goal) * 100))}
              />
            </div>
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="MEAL LOG" title="今日饮食记录" />
        <div className="grid gap-2.5">
          {state.nutrition.mealRecords.map((meal, index) => (
            <InsetRow
              copy={`${meal.slot} · ${meal.time} · 蛋白 ${meal.protein}g`}
              icon={index === 0 ? Salad : UtensilsCrossed}
              key={`${meal.time}-${meal.name}`}
              title={meal.name}
              tone={index === 0 ? 'mint' : 'amber'}
              trailing={<span className="text-[14px] font-medium text-[var(--text-secondary)]">{meal.kcal} kcal</span>}
            />
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4" variant="inset">
        <SectionHeader kicker="NUTRI THREAD" title="AI 营养对话" tone="muted" />
        <div className="grid gap-3">
          {nutritionMessages.map((message) => (
            <MessageBubble key={message.meta} {...message} />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <ActionTile helperText="从拍照页进入识别流程，最后会把结果写回今日营养目标。" icon={Camera} meta="真闭环" title="拍照记录下一餐" to={routes.app.mealCapture} variant="emphasized" />
        <ActionTile helperText="直接回看最近一次识别结果，确认是否已经写回今日记录。" icon={UtensilsCrossed} meta="写回确认" title="确认本次识别结果" to={routes.app.mealConfirm} tone="amber" />
      </div>
    </Screen>
  )
}
