import { CheckCircle2, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'
import { equipmentOptions, findEquipmentOption } from './equipment-options'

export function ManualEquipmentScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const initialSelection = state.equipment.manualSelection ?? state.equipment.lastDetectedLabel ?? 'Lat Pull Down'
  const [selection, setSelection] = useState(initialSelection)
  const selectedOption = findEquipmentOption(selection)

  const saveSelection = () => {
    actions.saveManualEquipmentSelection(selection)
    navigate(routes.app.equipmentResult)
  }

  return (
    <Screen dataScreen="manual-equipment">
      <PageHeader backTo={routes.app.equipmentResult} eyebrow="Manual Entry" title="手动选择器械" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-32 bg-[var(--surface-subtle)] bg-[url('/figma/manual-entry.png')] bg-cover bg-top" />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="default">
            {selectedOption?.name ?? '请选择器械'}
          </Badge>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">如果自动识别不稳定，可以直接指定器械类别，后续训练流程会按这个选择继续。</p>
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="SUPPORTED" title="选择当前器械" />
        <div className="grid gap-2.5">
          {equipmentOptions.map((option) => {
            const selected = selection === option.machine

            return (
              <InteractiveRow
                copy={`${option.focus} · ${option.machine}`}
                icon={selected ? CheckCircle2 : SlidersHorizontal}
                key={option.machine}
                onClick={() => setSelection(option.machine)}
                title={option.name}
                tone={option.tone}
                trailing={selected ? <Badge variant="mint">当前</Badge> : <Badge variant="outline">选择</Badge>}
              />
            )
          })}
        </div>
      </GroupedSection>

      <Button className="w-full" onClick={saveSelection}>
        保存器械选择
      </Button>
    </Screen>
  )
}
