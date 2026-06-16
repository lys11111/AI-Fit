import { MessageSquareText } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { usePrototypeState } from '@/prototype/state'

const tags = ['太轻松', '刚刚好', '有点吃力', '动作快散了']
const stabilityOptions = ['很稳', '基本稳住', '后半程开始代偿']

export function SetFeedbackScreen() {
  const navigate = useNavigate()
  const { state, actions } = usePrototypeState()
  const previous = state.training.lastFeedback
  const [selectedTag, setSelectedTag] = useState(previous?.tag ?? '刚刚好')
  const [rpe, setRpe] = useState(previous?.rpe ?? 7)
  const [stability, setStability] = useState(previous?.stability ?? '基本稳住')
  const [note, setNote] = useState(previous?.note ?? `后两组在 ${state.plan.focusPreference} 上有点松，下一次想再稳一点。`)

  const handleSave = () => {
    actions.saveTrainingFeedback({ tag: selectedTag, rpe, stability, note })
    navigate(routes.app.summary)
  }

  return (
    <Screen dataScreen="set-feedback">
      <PageHeader
        backTo={routes.app.workout}
        title="组后反馈"
        description={`这一步会把你对 ${state.plan.focusPreference} 的主观感受写回状态，后面的总结、次日建议和首页提醒都会引用它。`}
        variant="compact"
      />

      <Badge className="w-fit" variant="mint">
        真闭环 · 第 3 步 / 5 步
      </Badge>

      <GroupedSection className="space-y-4">
        <SectionHeader title="这组感觉如何" kicker="SESSION SIGNAL" />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className={`rounded-[14px] px-3 py-2 text-sm font-medium transition ${
                selectedTag === tag
                  ? 'bg-[var(--accent-primary-solid)] text-[var(--text-inverse)]'
                  : 'border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--text-secondary)]'
              }`}
              onClick={() => setSelectedTag(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="grid gap-3">
          <MetricCard label="主观强度" value={`RPE ${rpe} / 10`} tone="primary" hint="这里会直接影响后续总结对强度的判断。" variant="inline" />
          <div className="flex gap-2">
            {[6, 7, 8, 9].map((value) => (
              <Button key={value} onClick={() => setRpe(value)} variant={rpe === value ? 'default' : 'secondary'}>
                {value}
              </Button>
            ))}
          </div>

          <MetricCard label="动作稳定性" value={stability} tone="mint" hint={`重点看 ${state.plan.focusPreference} 有没有在后半程散掉。`} variant="inline" />
          <div className="flex flex-wrap gap-2">
            {stabilityOptions.map((option) => (
              <Badge
                key={option}
                className={`cursor-pointer px-3 py-2 text-sm ${stability === option ? 'bg-[var(--accent-mint-solid)] text-[var(--text-inverse)]' : ''}`}
                onClick={() => setStability(option)}
                variant={stability === option ? 'mint' : 'outline'}
              >
                {option}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[14px] leading-[20px] font-medium text-[var(--text-primary)]" htmlFor="feedback-note">
            备注
          </label>
          <Textarea id="feedback-note" onChange={(event) => setNote(event.target.value)} value={note} />
        </div>
      </GroupedSection>

      <Button className="w-full" data-testid="save-training-feedback" onClick={handleSave}>
        保存并查看总结
        <MessageSquareText className="size-4" />
      </Button>
    </Screen>
  )
}
