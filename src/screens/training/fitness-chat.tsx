import { Loader2, Send, Sparkles } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, MessageBubble, PageHeader, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

function buildCoachAnswer(question: string, focus: string, equipment: string) {
  return `围绕「${focus}」和当前器械「${equipment}」，先把重量降到能稳定控制的档位。动作开始前确认肩胛位置，发力时让目标肌群先启动，最后 2 次如果明显代偿就停止本组。你的问题是：${question}`
}

export function FitnessChatScreen() {
  const { state, actions } = usePrototypeState()
  const navigate = useNavigate()
  const [question, setQuestion] = useState(state.aiCoach.lastQuestion)
  const [loading, setLoading] = useState(false)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    const answer = buildCoachAnswer(question.trim() || state.aiCoach.lastQuestion, state.plan.focusPreference, state.equipment.lastDetectedLabel ?? state.plan.exercises[0]?.machineClass ?? 'Lat Pull Down')
    actions.saveAiCoachRecommendation({ question: question.trim() || state.aiCoach.lastQuestion, recommendation: answer })
    setLoading(false)
    navigate(routes.app.fitnessAnalysis)
  }

  return (
    <Screen dataScreen="fitness-chat">
      <PageHeader backTo={routes.app.training} eyebrow="AI Coach" title="AI 健身对话" variant="compact" />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="h-32 rounded-[var(--radius-row)] bg-[url('/figma/ai-chat.png')] bg-cover bg-top" />
        <div className="grid gap-3">
          <MessageBubble role="ai" message="告诉我你训练中遇到的问题，我会结合今日计划和已识别器械给出调整建议。" meta="AI-FIT Coach" />
          <MessageBubble role="user" message={state.aiCoach.lastQuestion} meta="最近一次问题" />
          <MessageBubble role="ai" message={state.aiCoach.recommendation} meta="最近一次建议" />
        </div>
      </GroupedSection>

      <form className="grid gap-3" onSubmit={submit}>
        <Input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="输入训练问题" />
        <Button disabled={loading} type="submit">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          发送并分析
        </Button>
      </form>

      <Button asChild variant="secondary">
        <Link to={routes.app.fitnessResult}>
          <Sparkles className="size-4" />
          查看推荐结果
        </Link>
      </Button>
    </Screen>
  )
}
