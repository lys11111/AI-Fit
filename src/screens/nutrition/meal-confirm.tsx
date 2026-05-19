import { CheckCircle2, PencilLine } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { recognizedMeal } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function MealConfirmScreen() {
  const { state, actions } = usePrototypeState()

  return (
    <Screen dataScreen="meal-confirm">
      <PageHeader
        backTo={routes.app.mealCapture}
        title="识别结果确认"
        description="确认本次餐食识别后，记录会直接写回今天的营养进度。"
        variant="compact"
      />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="mint">
            <CheckCircle2 className="size-3.5" />
            识别成功
          </Badge>
          <Badge variant="outline">{recognizedMeal.slot}</Badge>
        </div>
        <div className="space-y-2">
          <h2 className="text-[22px] leading-[27px] font-semibold text-[var(--text-primary)]">{recognizedMeal.name}</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{recognizedMeal.copy}</p>
        </div>
        <div className="grid gap-3">
          <MetricCard label="热量" value={`${recognizedMeal.calories} kcal`} tone="amber" variant="inline" />
          <MetricCard label="蛋白" value={`${recognizedMeal.protein} g`} tone="mint" variant="inline" />
          <MetricCard label="碳水" value={`${recognizedMeal.carbs} g`} tone="primary" variant="inline" />
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader title="可选微调" kicker="FINE TUNE" />
        <div className="flex flex-wrap gap-2">
          {recognizedMeal.fineTuneTags.map((tag) => (
            <Badge key={tag} variant="outline" className="rounded-[14px] px-3 py-2 text-sm font-medium">
              <PencilLine className="size-3.5" />
              {tag}
            </Badge>
          ))}
        </div>
      </GroupedSection>

      {state.nutrition.recognitionSaved ? (
        <Button asChild className="w-full" variant="secondary">
          <Link to={routes.app.nutrition}>已经写回今日记录，返回查看</Link>
        </Button>
      ) : (
        <Button asChild className="w-full">
          <Link
            data-testid="save-meal-recognition"
            onClick={() => {
              actions.saveMealRecognition()
            }}
            to={routes.app.nutrition}
          >
            写回今日饮食记录
          </Link>
        </Button>
      )}
    </Screen>
  )
}
