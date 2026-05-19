import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { chatDraftPrompts } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function ChatDraftScreen() {
  const { state } = usePrototypeState()

  return (
    <Screen dataScreen="chat-draft">
      <PageHeader
        backTo={routes.app.community}
        title="私聊草稿"
        description="这里先展示一种低压开场方式，减少第一次发消息的心理门槛，但它目前不会真的发送或建立会话。"
        variant="compact"
      />

      <Badge className="w-fit" variant="mint">
        展示页 · 不发送真实消息
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="space-y-2">
          <Badge variant="mint">开场建议</Badge>
          <h2 className="text-[20px] leading-[25px] font-semibold text-[var(--text-primary)]">先围绕共同训练语境聊</h2>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">
            你当前的偏好是 {state.profileSettings.trainingPreferences.preferredWindow} · {state.profileSettings.trainingPreferences.equipmentPreference}，
            所以开场白尽量围绕时间和器械展开。
          </p>
        </div>
        <div className="grid gap-2.5">
          {chatDraftPrompts.map((prompt) => (
            <InsetRow key={prompt} title={prompt} icon={MessageCircle} tone="mint" />
          ))}
        </div>
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.buddyMatch}>回到匹配页继续看</Link>
      </Button>
    </Screen>
  )
}
