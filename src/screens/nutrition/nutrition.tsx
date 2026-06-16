import { Bot, Camera, Flame, RefreshCw, Salad, Send, Sparkles, UtensilsCrossed, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { ActionTile, GroupedSection, InsetRow, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { nutritionMessages } from '@/data'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

const mealRecommendations = [
  {
    slot: '早餐',
    title: '鲜果燕麦粥',
    copy: '搭配蓝莓、香蕉与少许奇亚籽，提供早晨所需能量与纤维。',
    kcal: 320,
    image: '/figma/nutrition-breakfast.png',
  },
  {
    slot: '午餐',
    title: '藜麦烤温蔬菜沙拉',
    copy: '富含植物蛋白与优质淀粉，清爽无负担，饱足感十足。',
    kcal: 450,
    image: '/figma/nutrition-lunch.png',
  },
] as const

export function NutritionScreen() {
  const { state } = usePrototypeState()
  const lastSavedMealAt = state.nutrition.lastSavedMealAt
  const latestMessage = nutritionMessages[0]

  return (
    <Screen dataScreen="nutrition">
      <div className="grid grid-cols-[44px_1fr_44px] items-center pt-2">
        <div aria-hidden="true" className="size-11" />
        <h1 className="text-center text-[28px] leading-[34px] font-semibold text-[var(--accent-primary-ink)]">饮食</h1>
        <Link
          aria-label="进入我的"
          className="flex size-11 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--text-secondary)] shadow-[var(--shadow-subtle)]"
          to={routes.app.profile}
        >
          <UserRound className="size-6" />
        </Link>
      </div>

      <GroupedSection className="space-y-5 rounded-[28px] border-[var(--border-strong)] bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-raised)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <Badge className="w-fit" variant="mint">
              今日饮食状态
            </Badge>
            <h2 className="text-[26px] leading-[32px] font-semibold text-[var(--text-primary)]">训练日补给已接入 AI 推荐</h2>
            <p className="text-[14px] leading-[22px] text-[var(--text-secondary)]">
              {lastSavedMealAt ? `最近一次餐食写回于 ${formatClock(lastSavedMealAt)}。` : state.plan.nutritionNudge}
            </p>
          </div>
          <div className="flex size-14 shrink-0 items-center justify-center rounded-[20px] bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]">
            <Salad className="size-7" />
          </div>
        </div>

        <div className="grid gap-4">
          {state.nutrition.targets.map((target) => (
            <div className="space-y-2" key={target.key}>
              <div className="flex items-center justify-between gap-3 text-[14px] leading-[20px]">
                <span className="font-semibold text-[var(--text-primary)]">{target.label}</span>
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

        <div className="grid grid-cols-2 gap-3">
          <Button asChild className="min-h-[54px] rounded-[18px]">
            <Link to={routes.app.mealCapture}>
              <Camera className="size-5" />
              拍照识别
            </Link>
          </Button>
          <Button asChild className="min-h-[54px] rounded-[18px]" variant="secondary">
            <Link to={routes.app.nutritionChat}>
              <Bot className="size-5" />
              智能排餐
            </Link>
          </Button>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4 p-5">
        <div className="ml-auto max-w-[82%] rounded-[22px] rounded-br-[8px] bg-[var(--accent-primary-solid)] px-4 py-3 text-[15px] leading-[23px] font-semibold text-white">
          今天想吃点清淡的，前几天吃太油腻了。
        </div>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-primary-solid)] text-white">
            <Sparkles className="size-5" />
          </div>
          <div className="rounded-[22px] rounded-tl-[8px] bg-[var(--surface-subtle)] px-4 py-4">
            <h2 className="text-[18px] font-semibold text-[var(--text-primary)]">今日饮食洞察</h2>
            <p className="mt-2 text-[15px] leading-[24px] text-[var(--text-secondary)]">{latestMessage.message}</p>
            <div className="mt-3 flex gap-2">
              <Badge variant="outline">低油盐</Badge>
              <Badge variant="outline">高纤维</Badge>
            </div>
          </div>
        </div>
        <Button asChild className="min-h-[52px] rounded-full" variant="secondary">
          <Link to={routes.app.nutritionChat}>
            告诉我偏好
            <Send className="size-4" />
          </Link>
        </Button>
      </GroupedSection>

      <div className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <SectionHeader title="为您推荐的餐点" />
          <Button asChild className="h-9 px-2 text-[13px]" variant="ghost">
            <Link to={routes.app.nutritionRecommend}>
              <RefreshCw className="size-4" />
              重新生成
            </Link>
          </Button>
        </div>
        {mealRecommendations.map((meal) => (
          <GroupedSection className="overflow-hidden p-0" key={meal.title}>
            <div className="relative h-36 overflow-hidden bg-[var(--surface-subtle)]">
              <img alt="" className="h-full w-full object-cover object-top" src={meal.image} />
              <Badge className="absolute left-4 top-4 bg-white text-[var(--accent-primary-ink)]" variant="outline">
                {meal.slot}
              </Badge>
            </div>
            <div className="space-y-3 p-5">
              <div>
                <h2 className="text-[20px] font-semibold text-[var(--text-primary)]">{meal.title}</h2>
                <p className="mt-1 text-[15px] leading-[24px] text-[var(--text-secondary)]">{meal.copy}</p>
              </div>
              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] pt-3">
                <span className="flex items-center gap-1 text-[14px] font-semibold text-[var(--text-secondary)]">
                  <Flame className="size-4" />
                  {meal.kcal} kcal
                </span>
                <Button asChild size="sm" variant="subtle">
                  <Link to={routes.app.nutritionRecommend}>查看食谱</Link>
                </Button>
              </div>
            </div>
          </GroupedSection>
        ))}
      </div>

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

      <div className="grid gap-3">
        <ActionTile helperText="拍摄餐食后确认识别结果，自动更新今日营养目标。" icon={Camera} meta="AI 识别" title="拍照记录下一餐" to={routes.app.mealCapture} variant="emphasized" />
        <ActionTile helperText="直接回看最近一次识别结果，确认是否已经写回今日记录。" icon={UtensilsCrossed} meta="写回确认" title="确认本次识别结果" to={routes.app.mealConfirm} tone="amber" />
        <ActionTile helperText="输入饮食问题，生成适合今天训练安排的餐食建议。" icon={Bot} meta="AI 对话" title="智能排餐对话" to={routes.app.nutritionChat} tone="indigo" />
      </div>
    </Screen>
  )
}
