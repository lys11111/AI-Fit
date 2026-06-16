import { LockKeyhole, MessageCircle, QrCode, ShieldCheck, Smartphone, UserRound, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

type LoginMode = 'code' | 'password'

export function LoginScreen() {
  const { state, actions } = usePrototypeState()
  const [mode, setMode] = useState<LoginMode>('code')
  const [phone, setPhone] = useState(state.auth.phone)
  const [code, setCode] = useState(state.auth.code)
  const [password, setPassword] = useState('aifit2026')
  const [agreed, setAgreed] = useState(true)
  const [agreement, setAgreement] = useState<'user' | 'privacy' | null>(null)

  const canContinue = useMemo(() => {
    if (!agreed) {
      return false
    }

    return mode === 'code' ? phone.trim().length >= 8 && code.trim().length >= 4 : phone.trim().length >= 8 && password.trim().length >= 6
  }, [agreed, code, mode, password, phone])

  const handleDraft = () => {
    actions.saveAuthDraft({ phone, code })
  }

  return (
    <div className="flex min-h-[calc(100dvh-88px)] flex-col justify-between pb-3 pt-4" data-screen="login">
      <div className="space-y-9">
        <div className="flex items-center justify-between">
          <Link className="flex size-11 items-center justify-center rounded-full bg-white/80 text-[var(--text-primary)] shadow-[var(--shadow-subtle)]" to={routes.welcome}>
            <UserRound className="size-5" />
          </Link>
          <p className="text-[18px] font-semibold text-[var(--text-primary)]">账号登录</p>
          <Link className="text-[14px] font-semibold text-[var(--accent-primary-ink)]" to={routes.onboardingStart} onClick={handleDraft}>
            游客模式
          </Link>
        </div>

        <div className="space-y-3">
          <p className="text-[15px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-primary-ink)]">AI-FIT</p>
          <h1 className="text-[42px] leading-[50px] font-semibold tracking-normal text-[var(--text-primary)]">欢迎回来</h1>
          <p className="max-w-[27ch] text-[16px] leading-[24px] text-[var(--text-secondary)]">登录后生成你的训练计划，并在固定器械训练中获得动作识别与纠偏提醒。</p>
        </div>

        <div className="grid grid-cols-2 rounded-[22px] bg-[var(--surface-subtle)] p-1">
          <button
            className={`rounded-[18px] px-4 py-3 text-[15px] font-semibold transition ${mode === 'code' ? 'bg-white text-[var(--accent-primary-ink)] shadow-[var(--shadow-subtle)]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setMode('code')}
            type="button"
          >
            验证码登录
          </button>
          <button
            className={`rounded-[18px] px-4 py-3 text-[15px] font-semibold transition ${mode === 'password' ? 'bg-white text-[var(--accent-primary-ink)] shadow-[var(--shadow-subtle)]' : 'text-[var(--text-secondary)]'}`}
            onClick={() => setMode('password')}
            type="button"
          >
            密码登录
          </button>
        </div>

        <div className="space-y-4">
          <label className="flex min-h-[68px] items-center gap-3 rounded-[22px] bg-[#f1eaf4] px-5">
            <Smartphone className="size-5 text-[var(--text-secondary)]" />
            <Input
              className="border-0 bg-transparent px-0 text-[16px] shadow-none focus-visible:ring-0"
              id="login-phone"
              onChange={(event) => {
                const value = event.target.value
                setPhone(value)
                actions.saveAuthDraft({ phone: value })
              }}
              placeholder="请输入手机号"
              type="tel"
              value={phone}
            />
          </label>

          {mode === 'code' ? (
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <label className="flex min-h-[68px] items-center gap-3 rounded-[22px] bg-[#f1eaf4] px-5">
                <ShieldCheck className="size-5 text-[var(--text-secondary)]" />
                <Input
                  className="border-0 bg-transparent px-0 text-[16px] shadow-none focus-visible:ring-0"
                  id="login-code"
                  inputMode="numeric"
                  onChange={(event) => {
                    const value = event.target.value
                    setCode(value)
                    actions.saveAuthDraft({ code: value })
                  }}
                  placeholder="验证码"
                  value={code}
                />
              </label>
              <Button className="self-stretch rounded-[22px] px-4" onClick={() => actions.requestAuthCode(phone)} type="button" variant="secondary">
                获取验证码
              </Button>
            </div>
          ) : (
            <label className="flex min-h-[68px] items-center gap-3 rounded-[22px] bg-[#f1eaf4] px-5">
              <LockKeyhole className="size-5 text-[var(--text-secondary)]" />
              <Input
                className="border-0 bg-transparent px-0 text-[16px] shadow-none focus-visible:ring-0"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="请输入密码"
                type="password"
                value={password}
              />
            </label>
          )}

          <div className="flex items-center justify-between text-[14px]">
            <Link className="font-semibold text-[var(--accent-primary-ink)]" to={routes.resetPassword}>
              忘记密码？
            </Link>
            <Link className="font-semibold text-[var(--accent-primary-ink)]" to={routes.onboardingStart} onClick={handleDraft}>
              新用户注册
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-[var(--border-strong)] bg-white/80 text-[14px] font-semibold text-[var(--text-secondary)]" type="button">
            <MessageCircle className="size-4 text-[var(--accent-primary-ink)]" />
            微信登录
          </button>
          <button className="flex min-h-12 items-center justify-center gap-2 rounded-[18px] border border-[var(--border-strong)] bg-white/80 text-[14px] font-semibold text-[var(--text-secondary)]" type="button">
            <QrCode className="size-4 text-[var(--accent-primary-ink)]" />
            QQ 登录
          </button>
        </div>

        <label className="flex items-start gap-3 text-[13px] leading-[20px] text-[var(--text-secondary)]">
          <input checked={agreed} className="mt-0.5 size-5 accent-[#6f52cc]" onChange={(event) => setAgreed(event.target.checked)} type="checkbox" />
          <span>
            我已阅读并同意{' '}
            <button className="font-semibold text-[var(--accent-primary-ink)]" onClick={() => setAgreement('user')} type="button">
              用户协议
            </button>{' '}
            和{' '}
            <button className="font-semibold text-[var(--accent-primary-ink)]" onClick={() => setAgreement('privacy')} type="button">
              隐私政策
            </button>
          </span>
        </label>

        <Button asChild className="min-h-[58px] w-full rounded-[20px] text-[18px]" disabled={!canContinue}>
          <Link to={routes.loginSuccess} onClick={handleDraft}>
            登录并开始定制计划
          </Link>
        </Button>
      </div>

      {agreement ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 px-4 pb-4">
          <div className="w-full max-w-[430px] rounded-[28px] bg-white p-5 shadow-[var(--shadow-raised)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">Agreement</p>
                <h2 className="text-[22px] leading-[27px] font-semibold text-[var(--text-primary)]">
                  {agreement === 'user' ? '用户协议' : '隐私政策'}
                </h2>
              </div>
              <button className="flex size-10 items-center justify-center rounded-full bg-[var(--surface-subtle)]" onClick={() => setAgreement(null)} type="button">
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-4 text-[14px] leading-[22px] text-[var(--text-secondary)]">
              AI-FIT 会使用手机号完成登录，并在你授权后使用摄像头进行器械识别和动作纠偏。训练、饮食和身体数据会用于生成个性化建议。
            </p>
            <Button
              className="mt-5 w-full"
              onClick={() => {
                setAgreed(true)
                setAgreement(null)
              }}
            >
              同意并继续
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
