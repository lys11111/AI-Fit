import { Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buddyMatchChecklist, buddySuggestion } from '@/data'
import { getInitials } from '@/lib/utils'

export function BuddyMatchScreen() {
  return (
    <Screen dataScreen="buddy-match">
      <PageHeader
        backTo={routes.app.community}
        title="训练搭子匹配"
        description="这是一张展示页，用来说明未来会按什么理由推荐训练搭子，而不是现在就建立深层社交状态。"
        variant="compact"
      />

      <Badge className="w-fit" variant="indigo">
        展示页 · 解释匹配逻辑
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start gap-4">
          <Avatar className="size-16 bg-[var(--accent-indigo-soft)]">
            <AvatarFallback className="bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo-ink)]">{getInitials(buddySuggestion.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-[20px] leading-[25px] font-semibold text-[var(--text-primary)]">{buddySuggestion.name}</h2>
              <Badge variant="indigo">{buddySuggestion.match}</Badge>
            </div>
            <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{buddySuggestion.copy}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {buddySuggestion.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3">
        <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">WHY THIS MATCH</p>
        <div className="grid gap-2.5">
          {buddyMatchChecklist.map((item) => (
            <InsetRow key={item} title={item} icon={Users} tone="indigo" />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <Button asChild>
          <Link to={routes.app.chatDraft}>看看系统准备的破冰草稿</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to={routes.app.community}>回到社区</Link>
        </Button>
      </div>
    </Screen>
  )
}
