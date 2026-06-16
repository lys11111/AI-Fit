import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

export function SupportFeedbackScreen() {
  const { state, actions } = usePrototypeState()
  const [message, setMessage] = useState(state.support.lastFeedbackMessage || '通知中心和我的页都顺了很多，但我还想再看看训练页的更多异常态。')

  return (
    <Screen dataScreen="support-feedback">
      <PageHeader backTo={routes.app.profileSupport} title="反馈问题" description="告诉我们你在训练计划、动作识别或饮食记录里遇到的问题。" variant="compact" />

      <GroupedSection className="space-y-4">
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">这轮体验哪里最需要继续打磨？</span>
          <Textarea id="support-feedback" onChange={(event) => setMessage(event.target.value)} value={message} />
        </label>
        {state.support.lastFeedbackSubmittedAt ? (
          <Badge variant="mint" className="w-fit">
            最近一次已提交 · {formatClock(state.support.lastFeedbackSubmittedAt)}
          </Badge>
        ) : null}
        <Button className="w-full" onClick={() => actions.submitSupportFeedback(message)}>
          提交反馈
        </Button>
      </GroupedSection>
    </Screen>
  )
}
