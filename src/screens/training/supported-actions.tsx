import { CheckCircle2, Dumbbell } from 'lucide-react'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { equipmentOptions } from './equipment-options'

export function SupportedActionsScreen() {
  return (
    <Screen dataScreen="supported-actions">
      <PageHeader backTo={routes.app.exercise} eyebrow="Supported" title="支持动作列表" variant="compact" />

      <GroupedSection className="space-y-3" variant="inset">
        <Badge className="w-fit" variant="mint">
          <CheckCircle2 className="size-3.5" />
          当前视觉模型覆盖
        </Badge>
        <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">训练计划和器械识别会优先围绕这些固定器械动作展开。</p>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="MACHINES" title="可识别器械" />
        <div className="grid gap-2.5">
          {equipmentOptions.map((option) => (
            <InteractiveRow
              copy={`${option.focus} · ${option.machine}`}
              icon={Dumbbell}
              key={option.machine}
              title={option.name}
              tone={option.tone}
              to={option.machine === 'Lat Pull Down' ? routes.app.exerciseDetailLat : routes.app.exercise}
            />
          ))}
        </div>
      </GroupedSection>
    </Screen>
  )
}
