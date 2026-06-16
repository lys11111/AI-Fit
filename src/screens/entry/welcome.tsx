import { Activity, Camera, RotateCcw, Salad, Users } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { prototypeWalkthroughSteps } from '@/data'
import { GroupedSection, InsetRow, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { textRoleClasses } from '@/lib/design-system'
import { usePrototypeState } from '@/prototype/state'

const highlights = [
  {
    title: '训练主线已经能走通',
    copy: '从首页、训练中心、组后反馈到总结和次日建议，已经是一条可复测的主闭环。',
    icon: Activity,
  },
  {
    title: '饮食记录会写回状态',
    copy: '拍照识别确认后，会把本餐营养写回到今日目标和记录列表里。',
    icon: Salad,
  },
  {
    title: '社区现在只是展示页',
    copy: '它负责解释轻社交方向，但目前不会深写训练状态或消息关系。',
    icon: Users,
  },
  {
    title: '相机页是辅助工具页',
    copy: '实时纠正和动作学习暂时只服务主线说明，不假装已经接入真实识别。',
    icon: Camera,
  },
]

export function WelcomeScreen() {
  const { state, actions } = usePrototypeState()
  const [resetDone, setResetDone] = useState(false)

  const hasProgress =
    Boolean(state.onboardingProfile.lastCompletedAt) ||
    Boolean(state.training.lastFeedback) ||
    Boolean(state.nutrition.lastSavedMealAt)

  return (
    <Screen dataScreen="welcome">
      <div className="space-y-3 pt-6">
        <p className={textRoleClasses.meta}>AI-FIT PROTOTYPE</p>
        <h1 className={textRoleClasses.display}>先把原型里真正走得通的主线收紧，再判断下一轮该补哪里。</h1>
        <p className={textRoleClasses.body}>
          这轮不是继续铺新页面，而是用同一套状态把问卷、计划、训练反馈、饮食写回和个人设置串成可复测的体验。
        </p>
      </div>

      <div className="grid gap-3">
        <Button asChild>
          <Link to={routes.login}>从登录开始体验</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to={routes.app.home}>直接进入产品演示</Link>
        </Button>
        <Button
          className="w-full"
          data-testid="prototype-reset"
          onClick={() => {
            actions.resetPrototypeState()
            setResetDone(true)
          }}
          variant="ghost"
        >
          重置原型状态
          <RotateCcw className="size-4" />
        </Button>
        {resetDone ? (
          <Badge className="w-fit" variant="mint">
            已恢复到测试初始状态
          </Badge>
        ) : null}
        {hasProgress ? (
          <Badge className="w-fit" variant="indigo">
            已载入上一次的原型进度
          </Badge>
        ) : null}
      </div>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="THIS ROUND" title="当前原型重点" />
        <div className="grid gap-2.5">
          {highlights.map((item) => (
            <InsetRow key={item.title} title={item.title} copy={item.copy} icon={item.icon} tone="primary" />
          ))}
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4" variant="inset">
        <SectionHeader kicker="TEST SCRIPT" title="建议这样走一遍" tone="muted" />
        <div className="grid gap-2.5">
          {prototypeWalkthroughSteps.map((step, index) => (
            <InsetRow key={step} meta={`STEP ${index + 1}`} title={step} />
          ))}
        </div>
      </GroupedSection>
    </Screen>
  )
}
