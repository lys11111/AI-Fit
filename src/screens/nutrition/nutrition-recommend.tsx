import { Apple, CheckCircle2, Coffee, Drumstick, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

const mealSuggestions = [
  { title: '训练前 60 分钟', copy: '香蕉或燕麦 + 酸奶，保证训练时有稳定能量。', icon: Coffee, tone: 'amber' as const },
  { title: '训练后正餐', copy: '鸡胸、牛肉或鱼肉 + 米饭 + 绿叶菜，优先补蛋白。', icon: Drumstick, tone: 'mint' as const },
  { title: '睡前轻补给', copy: '如果蛋白还差一截，可以补一份无糖酸奶或蛋白奶。', icon: Apple, tone: 'primary' as const },
]

export function NutritionRecommendScreen() {
  const { state, actions } = usePrototypeState()
  const recommendation =
    state.nutrition.aiRecommendation ??
    `今天按 ${state.onboardingProfile.goal} 来吃：训练前补一点轻碳水，训练后把蛋白质补到目标区间，晚餐保持清淡但不要空腹。`

  const saveRecommendation = () => {
    actions.saveNutritionRecommendation(recommendation)
  }

  return (
    <Screen dataScreen="nutrition-recommend">
      <PageHeader backTo={routes.app.nutrition} eyebrow="Meal Plan" title="AI 推荐结果" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-36 bg-[var(--surface-subtle)] bg-[url('/figma/meal-recommend.png')] bg-cover bg-top" />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="mint">
            <Sparkles className="size-3.5" />
            已生成
          </Badge>
          <h2 className="text-[22px] leading-[27px] font-semibold text-[var(--text-primary)]">今日训练营养建议</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{recommendation}</p>
        </div>
      </div>

      <div className="grid gap-3">
        <MetricCard label="目标" value={state.onboardingProfile.goal} hint="根据问卷结果写入" tone="indigo" variant="feature" />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="训练时段" value={state.onboardingProfile.preferredWindow} tone="amber" variant="compact" />
          <MetricCard label="训练重点" value={state.plan.focusPreference} tone="mint" variant="compact" />
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="MEALS" title="执行安排" />
        <div className="grid gap-2.5">
          {mealSuggestions.map((meal) => (
            <InsetRow copy={meal.copy} icon={meal.icon} key={meal.title} title={meal.title} tone={meal.tone} />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <Button onClick={saveRecommendation}>
          <CheckCircle2 className="size-4" />
          保存推荐
        </Button>
        <Button asChild variant="secondary">
          <Link to={routes.app.nutritionChat}>继续提问</Link>
        </Button>
      </div>
    </Screen>
  )
}
