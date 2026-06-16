import { ShieldCheck, Smartphone } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

export function LoginScreen() {
  const { state, actions } = usePrototypeState()
  const [phone, setPhone] = useState(state.auth.phone)
  const [code, setCode] = useState(state.auth.code)
  const [remainingSeconds, setRemainingSeconds] = useState(0)

  useEffect(() => {
    const updateCountdown = () => {
      const endsAt = state.auth.cooldownEndsAt
      if (!endsAt) {
        setRemainingSeconds(0)
        return
      }

      setRemainingSeconds(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000)))
    }

    updateCountdown()
    const timer = window.setInterval(updateCountdown, 1000)
    return () => window.clearInterval(timer)
  }, [state.auth.cooldownEndsAt])

  const sendLabel = useMemo(() => {
    if (state.auth.status === 'sending') {
      return '发送中...'
    }

    if (remainingSeconds > 0) {
      return `${remainingSeconds}s 后重发`
    }

    return state.auth.lastSentAt ? '重新获取验证码' : '获取验证码'
  }, [remainingSeconds, state.auth.lastSentAt, state.auth.status])

  return (
    <Screen dataScreen="login" density="compact">
      <PageHeader
        backTo={routes.welcome}
        title="手机号登录"
        description="这是低保真登录演示：验证码、倒计时和重发都只在本地前端完成，用来承接后面的问卷与计划预览。"
        variant="compact"
      />

      <Badge className="w-fit" variant="amber">
        当前不接真实验证码服务
      </Badge>

      <GroupedSection className="space-y-4">
        <label className="space-y-2">
          <span className="text-[14px] leading-[20px] font-medium text-[var(--text-primary)]">手机号</span>
          <Input
            id="login-phone"
            onChange={(event) => {
              const value = event.target.value
              setPhone(value)
              actions.saveAuthDraft({ phone: value })
            }}
            type="tel"
            value={phone}
          />
        </label>

        <div className="grid grid-cols-[1fr_auto] gap-3">
          <label className="space-y-2">
            <span className="text-[14px] leading-[20px] font-medium text-[var(--text-primary)]">验证码</span>
            <Input
              id="login-code"
              inputMode="numeric"
              onChange={(event) => {
                const value = event.target.value
                setCode(value)
                actions.saveAuthDraft({ code: value })
              }}
              value={code}
            />
          </label>
          <Button
            className="self-end"
            data-testid="request-code-button"
            disabled={state.auth.status === 'sending' || remainingSeconds > 0}
            onClick={() => actions.requestAuthCode(phone)}
            variant="secondary"
          >
            {sendLabel}
          </Button>
        </div>

        {state.auth.lastSentAt ? (
          <Badge className="w-fit" variant="mint">
            已完成一次本地验证码演示
          </Badge>
        ) : null}

        <Button asChild className="w-full">
          <Link to={routes.onboarding} onClick={() => actions.saveAuthDraft({ phone, code })}>
            继续进入问卷
          </Link>
        </Button>
      </GroupedSection>

      <GroupedSection className="space-y-3" variant="inset">
        <Badge className="w-fit" variant="indigo">
          入口承接页
        </Badge>
        <InsetRow
          title="这一页只收最少的必要输入"
          copy="真正会影响计划内容的是下一步问卷里的训练目标、时间偏好、器械偏好和主线关注点。"
          icon={Smartphone}
          tone="indigo"
        />
        <InsetRow
          title="登录的作用是进入主线，不是假装后端已经就绪"
          copy="测试时只需要确认输入可保存、倒计时可复现、返回后仍能看到当前草稿。"
          icon={ShieldCheck}
          tone="amber"
        />
      </GroupedSection>
    </Screen>
  )
}
