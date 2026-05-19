import { Camera, Siren, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { liveCorrectionTips } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function LiveCorrectionScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="live-correction">
      <PageHeader
        backTo={routes.app.workout}
        title="实时动作纠正"
        description="当前它还是辅助工具页：负责在训练中提醒你注意关键动作，不会假装已经写回真实识别评分。"
        variant="compact"
      />

      <Badge className="w-fit" variant="indigo">
        辅助工具页 · 不直接写回评分
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-[var(--radius-row)] bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo-ink)]">
            <Camera className="size-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]">当前只做主线内的动作提醒</h2>
            <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
              这里主要盯 {state.plan.focusPreference} 相关的关键动作。看完提示后，你还是会回到训练总结页，由组后反馈和总结承担真正的写回逻辑。
            </p>
          </div>
        </div>
        <div className="grid gap-2.5">
          {liveCorrectionTips.map((tip, index) => (
            <InsetRow key={tip} title={tip} icon={index === 0 ? Siren : Zap} tone={index === 0 ? 'amber' : 'primary'} />
          ))}
        </div>
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.summary}>结束并查看训练总结</Link>
      </Button>
    </Screen>
  )
}
