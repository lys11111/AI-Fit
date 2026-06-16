import { Heart, MapPin, MessageCircle, MoreHorizontal, Send, Share2, SlidersHorizontal, Users } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, Screen, SectionHeader } from '@/components/app/primitives'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { buddySuggestion, communityPosts } from '@/data'
import { cn, getInitials } from '@/lib/utils'

const buddyCards = [
  {
    ...buddySuggestion,
    distance: '800m',
    image: '/figma/community-feed.png',
  },
  {
    name: '陈亦然',
    copy: '减脂打卡稳定，周末也能约训练',
    match: '94%',
    distance: '1.2km',
    tags: ['有氧减脂', '周末练', '饮食控'],
    image: '/figma/profile-home.png',
  },
] as const

const posts = [
  {
    ...communityPosts[0],
    image: '/figma/community-meal.png',
    tag: '450 kcal',
  },
  {
    ...communityPosts[1],
    image: '/figma/community-run.png',
    tag: '10.02 km',
  },
] as const

export function CommunityScreen() {
  const [greeted, setGreeted] = useState<string | null>(null)
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  const toggleLike = (author: string) => {
    setLikedPosts((current) => (current.includes(author) ? current.filter((item) => item !== author) : [...current, author]))
  }

  return (
    <Screen dataScreen="community">
      <div className="grid grid-cols-[44px_1fr_44px] items-center pt-2">
        <div aria-hidden="true" className="size-11" />
        <h1 className="text-center text-[28px] leading-[34px] font-semibold text-[var(--accent-primary-ink)]">社区发现</h1>
        <Button aria-label="更多筛选" className="size-11 rounded-full" size="icon" variant="ghost">
          <SlidersHorizontal className="size-5" />
        </Button>
      </div>

      <div className="space-y-4 pt-8">
        <div className="flex items-end justify-between">
          <SectionHeader title="智能推荐搭子" />
          <Button asChild className="h-9 gap-1 px-2 text-[13px]" variant="ghost">
            <Link to={routes.app.buddyMatch}>
              更多筛选
              <SlidersHorizontal className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          {buddyCards.map((buddy) => {
            const hasGreeted = greeted === buddy.name

            return (
              <motion.article
                animate={{ opacity: 1, x: 0 }}
                className="w-[82%] shrink-0 snap-start rounded-[24px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] p-5 shadow-[var(--shadow-subtle)]"
                initial={{ opacity: 0, x: 24 }}
                key={buddy.name}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-start gap-4">
                  <Avatar className="size-16 border-4 border-[var(--accent-primary-solid)]">
                    <AvatarFallback className="bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]">
                      {getInitials(buddy.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-[21px] font-semibold text-[var(--text-primary)]">{buddy.name}</h2>
                      <Badge className="rounded-full bg-[var(--accent-primary-solid)] text-white" variant="default">
                        {buddy.match}
                      </Badge>
                    </div>
                    <p className="mt-1 flex items-center gap-1 text-[14px] font-semibold text-[var(--text-secondary)]">
                      <MapPin className="size-4" />
                      距离 {buddy.distance}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {buddy.tags.map((tag) => (
                    <Badge className="bg-[#f2f0f7] text-[var(--text-secondary)]" key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button
                  className="mt-5 min-h-[54px] w-full rounded-[16px] text-[17px]"
                  onClick={() => setGreeted(buddy.name)}
                  type="button"
                  variant={hasGreeted ? 'secondary' : 'default'}
                >
                  {hasGreeted ? '已发送招呼' : '打招呼'}
                  <Send className="size-4" />
                </Button>
              </motion.article>
            )
          })}
        </div>
      </div>

      <div className="grid gap-4">
        <SectionHeader title="热门打卡" />
        {posts.map((post) => {
          const liked = likedPosts.includes(post.author)

          return (
            <GroupedSection className="overflow-hidden p-0" key={post.author}>
              <div className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <Avatar className="size-12 bg-[var(--surface-subtle)]">
                    <AvatarFallback>{getInitials(post.author)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-semibold text-[var(--text-primary)]">{post.author}</p>
                    <p className="text-[13px] text-[var(--text-tertiary)]">{post.meta}</p>
                  </div>
                  <Button aria-label="更多" className="size-9 rounded-full" size="icon" variant="ghost">
                    <MoreHorizontal className="size-5" />
                  </Button>
                </div>
                <p className="text-[16px] leading-[25px] font-medium text-[var(--text-primary)]">{post.excerpt}</p>
              </div>

              <div className="relative h-64 overflow-hidden bg-[var(--surface-subtle)]">
                <img alt="" className="h-full w-full object-cover object-top" src={post.image} />
                <Badge className="absolute bottom-4 right-4 rounded-full bg-white/92 text-[var(--accent-primary-ink)] shadow-[var(--shadow-subtle)]" variant="outline">
                  {post.tag}
                </Badge>
              </div>

              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-5">
                  <button
                    className={cn('flex items-center gap-2 text-[16px] font-semibold transition', liked ? 'text-[var(--accent-primary-ink)]' : 'text-[var(--text-secondary)]')}
                    onClick={() => toggleLike(post.author)}
                    type="button"
                  >
                    <Heart className={cn('size-6', liked && 'fill-current')} />
                    {post.likes + (liked ? 1 : 0)}
                  </button>
                  <Link className="flex items-center gap-2 text-[16px] font-semibold text-[var(--text-secondary)]" to={routes.app.chatDraft}>
                    <MessageCircle className="size-6" />
                    {post.comments}
                  </Link>
                </div>
                <Button aria-label="分享" className="size-10 rounded-full" size="icon" variant="ghost">
                  <Share2 className="size-5" />
                </Button>
              </div>
            </GroupedSection>
          )
        })}
      </div>

      <div className="grid gap-3">
        <Button asChild className="min-h-[54px] rounded-[18px]">
          <Link to={routes.app.buddyMatch}>
            <Users className="size-5" />
            查看搭子匹配逻辑
          </Link>
        </Button>
      </div>
    </Screen>
  )
}
