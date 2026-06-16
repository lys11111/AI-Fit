import { ArrowDownToLine, Camera, CheckCircle2, Dumbbell, ScanLine } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const exerciseDetails = {
  'lat-pulldown': {
    image: '/figma/exercise-detail-lat.png',
    title: '正握宽距高位下拉',
    machine: 'Lat Pull Down',
    focus: '肩胛下沉 · 背阔肌发力',
    cues: ['先沉肩，再向锁骨前方下拉', '手肘向身体两侧靠近', '回放阶段保持背部张力'],
  },
  row: {
    image: '/figma/exercise-detail-row.png',
    title: '坐姿绳索划船',
    machine: 'Seated Cable Rows',
    focus: '水平拉 · 躯干稳定',
    cues: ['胸口打开，背部保持自然伸展', '手肘向后贴近身体', '不要用身体后仰代偿'],
  },
  facepull: {
    image: '/figma/exercise-detail-facepull.png',
    title: '面拉',
    machine: 'Seated Cable Rows',
    focus: '后束与肩胛控制',
    cues: ['绳索拉向眉眼高度', '手肘打开但不要耸肩', '顶峰停顿一秒再回放'],
  },
} as const

export function ExerciseDetailScreen() {
  const params = useParams()
  const detail = exerciseDetails[(params.slug as keyof typeof exerciseDetails) ?? 'lat-pulldown'] ?? exerciseDetails['lat-pulldown']

  return (
    <Screen dataScreen="exercise-detail">
      <PageHeader backTo={routes.app.exercise} eyebrow="Movement Detail" title="动作详情" variant="compact" />

      <div className="overflow-hidden rounded-[var(--radius-section)] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
        <div className="h-48 bg-[var(--surface-subtle)] bg-cover bg-top" style={{ backgroundImage: `url('${detail.image}')` }} />
        <div className="space-y-2 p-4">
          <Badge className="w-fit" variant="mint">
            <CheckCircle2 className="size-3.5" />
            可接入纠偏
          </Badge>
          <h2 className="text-[26px] leading-[31px] font-semibold text-[var(--text-primary)]">{detail.title}</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{detail.machine} · {detail.focus}</p>
        </div>
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="CUES" title="动作要点" />
        <div className="grid gap-2.5">
          {detail.cues.map((cue, index) => (
            <InsetRow icon={index === 0 ? ArrowDownToLine : index === 1 ? Dumbbell : ScanLine} key={cue} title={cue} tone={index === 2 ? 'amber' : 'indigo'} />
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <InsetRow copy="先识别当前器械，再进入该器械对应的标准力线纠偏。" icon={Camera} title="进入摄像头纠偏" tone="mint" />
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.equipmentResult}>识别器械并开始纠偏</Link>
      </Button>
    </Screen>
  )
}
