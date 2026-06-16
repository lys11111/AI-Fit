import { Bot, Send, Sparkles, UtensilsCrossed } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, MessageBubble, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

function buildRecommendation(message: string, goal: string, focus: string) {
  const prompt = message.trim() || '我今天训练后应该怎么吃？'

  return `${prompt} 建议按「${goal}」和「${focus}」来安排：训练前补一份容易消化的碳水，训练后 2 小时内补足优质蛋白，晚餐把蔬菜和主食比例控制稳定。`
}

export function NutritionChatScreen() {
  const { state, actions } = usePrototypeState()
  const [message, setMessage] = useState('我今晚训练后应该怎么安排晚餐？')
  const [lastQuestion, setLastQuestion] = useState<string | null>(null)
  const recommendation =
    state.nutrition.aiRecommendation ??
    `根据你的 ${state.onboardingProfile.goal} 目标，今天先保证蛋白质达标，再把碳水放在训练前后。`

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextRecommendation = buildRecommendation(message, state.onboardingProfile.goal, state.plan.focusPreference)
    setLastQuestion(message)
    actions.saveNutritionRecommendation(nextRecommendation)
    setMessage('')
  }

  return (
    <Screen dataScreen="nutrition-chat">
      <PageHeader backTo={routes.app.nutrition} eyebrow="AI Nutrition" title="智能排餐对话" variant="compact" />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-32 rounded-[var(--radius-row)] bg-[var(--surface-subtle)] bg-[url('/figma/ai-chat.png')] bg-cover bg-top" />
        <SectionHeader kicker="THREAD" title="营养建议" />
        <div className="grid gap-3">
          <MessageBubble role="ai" message={`我会结合你的训练目标、今日计划和营养进度给出建议。`} meta="AI-FIT" />
          {lastQuestion ? <MessageBubble role="user" message={lastQuestion} meta="刚刚" /> : null}
          <MessageBubble role="ai" message={recommendation} meta="已保存到推荐结果" />
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-row)] bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]">
            <Bot className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]">当前会参考</p>
            <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{state.onboardingProfile.goal} · {state.plan.focusPreference} · {state.onboardingProfile.preferredWindow}</p>
          </div>
        </div>
      </GroupedSection>

      <form className="grid gap-3" onSubmit={submitMessage}>
        <Input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="输入饮食问题" />
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <Button asChild variant="secondary">
            <Link to={routes.app.nutritionRecommend}>
              <UtensilsCrossed className="size-4" />
              看推荐
            </Link>
          </Button>
          <Button type="submit">
            <Send className="size-4" />
            发送
          </Button>
        </div>
      </form>

      <Button asChild className="w-full" variant="subtle">
        <Link to={routes.app.nutritionRecommend}>
          <Sparkles className="size-4" />
          查看推荐结果
        </Link>
      </Button>
    </Screen>
  )
}
