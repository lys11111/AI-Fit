import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

const goalOptions = ['减脂塑形', '增肌', '维持体能']
const timeOptions = ['晨间训练', '午间训练', '晚间训练']

export function TrainingPreferencesScreen() {
  const { state, actions } = usePrototypeState()
  const [form, setForm] = useState(state.profileSettings.trainingPreferences)
  const [saved, setSaved] = useState(false)

  const toggleTag = (tag: string) => {
    setForm((current) => ({
      ...current,
      trainingTags: current.trainingTags.includes(tag)
        ? current.trainingTags.filter((item) => item !== tag)
        : [...current.trainingTags, tag],
    }))
  }

  return (
    <Screen dataScreen="training-preferences">
      <PageHeader backTo={routes.app.profileAccount} title="训练偏好" description="这里会影响首页文案、计划预览和社区草稿里的内容。" variant="compact" />

      <GroupedSection className="space-y-4">
        <div className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">训练目标</span>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map((option) => (
              <Button key={option} onClick={() => setForm((current) => ({ ...current, goal: option }))} variant={form.goal === option ? 'default' : 'secondary'}>
                {option}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">训练时段</span>
          <div className="flex flex-wrap gap-2">
            {timeOptions.map((option) => (
              <Button key={option} onClick={() => setForm((current) => ({ ...current, preferredWindow: option }))} variant={form.preferredWindow === option ? 'default' : 'secondary'}>
                {option}
              </Button>
            ))}
          </div>
        </div>
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">每周频率</span>
          <Input onChange={(event) => setForm((current) => ({ ...current, weeklyFrequency: event.target.value }))} value={form.weeklyFrequency} />
        </label>
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">单次时长</span>
          <Input onChange={(event) => setForm((current) => ({ ...current, sessionDuration: event.target.value }))} value={form.sessionDuration} />
        </label>
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">器械偏好</span>
          <Input onChange={(event) => setForm((current) => ({ ...current, equipmentPreference: event.target.value }))} value={form.equipmentPreference} />
        </label>
        <div className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">训练标签</span>
          <div className="flex flex-wrap gap-2">
            {['背部塑形', '晚间档', '固定器械', '轻社交'].map((tag) => (
              <Badge
                key={tag}
                className={`cursor-pointer px-3 py-2 text-sm ${form.trainingTags.includes(tag) ? 'bg-[var(--accent-primary-solid)] text-[var(--text-inverse)]' : ''}`}
                onClick={() => toggleTag(tag)}
                variant={form.trainingTags.includes(tag) ? 'default' : 'outline'}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        {saved ? <Badge variant="mint" className="w-fit">训练偏好已保存，首页和社区草稿会同步使用</Badge> : null}
        <Button
          className="w-full"
          onClick={() => {
            actions.updateTrainingPreferences(form)
            setSaved(true)
          }}
        >
          保存训练偏好
        </Button>
      </GroupedSection>
    </Screen>
  )
}
