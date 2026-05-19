import { MessageCircle, Users } from 'lucide-react'

import { routes } from '@/app/routes'
import { ActionTile, GroupedSection, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { buddySuggestion, communityPosts } from '@/data'
import { getInitials } from '@/lib/utils'

export function CommunityScreen() {
  return (
    <Screen dataScreen="community">
      <PageHeader
        backTo={routes.app.home}
        description="社区当前是展示页：它负责解释轻社交方向和训练搭子场景，但不会深写训练状态或真实消息关系。"
        title="社区与训练搭子"
        variant="secondary"
      />

      <Badge className="w-fit" variant="indigo">
        展示页 · 不打断主线
      </Badge>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start gap-4">
          <Avatar className="size-14 bg-[var(--accent-indigo-soft)]">
            <AvatarFallback className="bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo-ink)]">{getInitials(buddySuggestion.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]">{buddySuggestion.name}</p>
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

      <div className="grid gap-3">
        <SectionHeader kicker="LIGHT FEED" title="社区动态" />
        {communityPosts.map((post) => (
          <GroupedSection className="space-y-4" key={post.title}>
            <div className="flex items-center gap-3">
              <Avatar className="bg-[var(--surface-subtle)]">
                <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]">{post.author}</p>
                <p className="text-[13px] leading-[19px] text-[var(--text-tertiary)]">{post.meta}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]">{post.title}</h2>
              <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{post.excerpt}</p>
            </div>
            <div className="flex items-center gap-4 text-[13px] leading-[19px] text-[var(--text-tertiary)]">
              <span>{post.likes} 赞</span>
              <span>{post.comments} 评论</span>
            </div>
          </GroupedSection>
        ))}
      </div>

      <div className="grid gap-3">
        <ActionTile helperText="这个页面解释未来的训练搭子方向，但目前不会建立真实关系链。 " icon={Users} meta="展示页" title="看看搭子匹配逻辑" to={routes.app.buddyMatch} tone="indigo" />
        <ActionTile helperText="这个页面只展示低压开场方式，不会真的发出消息。" icon={MessageCircle} meta="展示页" title="打开私聊草稿" to={routes.app.chatDraft} tone="mint" />
      </div>
    </Screen>
  )
}
