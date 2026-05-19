import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatClock } from '@/lib/utils'
import { usePrototypeState } from '@/prototype/state'

const channelOptions: Array<'微信' | '短信'> = ['微信', '短信']

export function InviteFriendsScreen() {
  const { state, actions } = usePrototypeState()
  const [recipient, setRecipient] = useState(state.support.inviteRecipient || '阿宁')
  const [channel, setChannel] = useState<'微信' | '短信'>(state.support.inviteChannel)

  return (
    <Screen dataScreen="invite-friends">
      <PageHeader
        backTo={routes.app.profileSupport}
        title="推荐给好友"
        description="这里仍然是演示态，但也应该有完成感：你能看到收件人、渠道和最近一次发出的状态。"
        variant="compact"
      />

      <GroupedSection className="space-y-4">
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">收件人</span>
          <Input onChange={(event) => setRecipient(event.target.value)} value={recipient} />
        </label>
        <div className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">发送渠道</span>
          <div className="flex gap-2">
            {channelOptions.map((option) => (
              <Button key={option} onClick={() => setChannel(option)} variant={channel === option ? 'default' : 'secondary'}>
                {option}
              </Button>
            ))}
          </div>
        </div>
        {state.support.lastInviteSentAt ? (
          <Badge className="w-fit" variant="mint">
            最近一次已发送给 {state.support.inviteRecipient} · {formatClock(state.support.lastInviteSentAt)}
          </Badge>
        ) : null}
        <Button
          className="w-full"
          onClick={() => actions.sendInvite({ recipient, channel })}
        >
          发送演示邀请
        </Button>
      </GroupedSection>
    </Screen>
  )
}
