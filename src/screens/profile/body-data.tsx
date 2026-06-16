import { Activity, Save, ScanLine } from 'lucide-react'
import { useMemo, useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

function numberInputValue(value: number) {
  return Number.isFinite(value) ? String(value) : ''
}

export function BodyDataScreen() {
  const { state, actions } = usePrototypeState()
  const [heightCm, setHeightCm] = useState(numberInputValue(state.bodyData.heightCm))
  const [weightKg, setWeightKg] = useState(numberInputValue(state.bodyData.weightKg))
  const [bodyFatPercent, setBodyFatPercent] = useState(numberInputValue(state.bodyData.bodyFatPercent))
  const [waistCm, setWaistCm] = useState(numberInputValue(state.bodyData.waistCm))

  const bmi = useMemo(() => {
    const height = Number(heightCm) / 100
    const weight = Number(weightKg)

    if (!height || !weight) {
      return '--'
    }

    return (weight / (height * height)).toFixed(1)
  }, [heightCm, weightKg])

  const saveBodyData = () => {
    actions.updateBodyData({
      heightCm: Number(heightCm) || state.bodyData.heightCm,
      weightKg: Number(weightKg) || state.bodyData.weightKg,
      bodyFatPercent: Number(bodyFatPercent) || state.bodyData.bodyFatPercent,
      waistCm: Number(waistCm) || state.bodyData.waistCm,
    })
  }

  return (
    <Screen dataScreen="body-data">
      <PageHeader backTo={routes.app.profile} eyebrow="Body Data" title="体型数据" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-32 bg-[var(--surface-subtle)] bg-[url('/figma/body-data.png')] bg-cover bg-top" />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="mint">
            本地保存
          </Badge>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">记录身高、体重、体脂和腰围，后续计划和营养建议可以继续读取这些数据。</p>
        </div>
      </div>

      <div className="grid gap-3">
        <MetricCard label="BMI" value={bmi} hint="由身高和体重自动计算" tone="indigo" variant="feature" />
        <div className="grid grid-cols-2 gap-3">
          <MetricCard label="体脂率" value={`${bodyFatPercent || '--'}%`} tone="mint" variant="compact" />
          <MetricCard label="腰围" value={`${waistCm || '--'} cm`} tone="amber" variant="compact" />
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="EDIT" title="更新身体数据" />
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">身高 cm</span>
          <Input inputMode="decimal" value={heightCm} onChange={(event) => setHeightCm(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">体重 kg</span>
          <Input inputMode="decimal" value={weightKg} onChange={(event) => setWeightKg(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">体脂率 %</span>
          <Input inputMode="decimal" value={bodyFatPercent} onChange={(event) => setBodyFatPercent(event.target.value)} />
        </label>
        <label className="grid gap-2">
          <span className="text-[13px] font-semibold text-[var(--text-secondary)]">腰围 cm</span>
          <Input inputMode="decimal" value={waistCm} onChange={(event) => setWaistCm(event.target.value)} />
        </label>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow copy={`${state.onboardingProfile.goal} · ${state.plan.focusPreference}`} icon={Activity} title="训练目标关联" tone="primary" />
        <InsetRow copy="体型记录会在本地保留，刷新页面后仍可查看。" icon={ScanLine} title="数据留存" tone="mint" />
        {state.bodyData.lastUpdatedAt ? (
          <Badge className="w-fit" variant="mint">
            已更新 · {formatClock(state.bodyData.lastUpdatedAt)}
          </Badge>
        ) : null}
      </GroupedSection>

      <Button className="w-full" onClick={saveBodyData}>
        <Save className="size-4" />
        保存体型数据
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <MetricCard label="身高" value={`${heightCm || '--'} cm`} hint="基础数据" tone="primary" variant="inline" />
        <MetricCard label="体重" value={`${weightKg || '--'} kg`} hint="基础数据" tone="mint" variant="inline" />
      </div>
    </Screen>
  )
}
