import { Dumbbell, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'

export function WelcomeScreen() {
  return (
    <div className="flex min-h-[calc(100dvh-88px)] flex-col justify-between pb-5 pt-10" data-screen="welcome">
      <div className="space-y-9 text-center">
        <div className="mx-auto flex size-24 rotate-3 items-center justify-center rounded-[28px] bg-[var(--accent-primary-ink)] text-white shadow-[var(--shadow-raised)]">
          <Dumbbell className="size-11" strokeWidth={2.8} />
        </div>

        <div className="space-y-3">
          <h1 className="text-[44px] leading-[52px] font-semibold tracking-normal text-[var(--accent-primary-ink)]">Welcome To AIFIT</h1>
          <p className="text-[18px] leading-[28px] font-medium text-[var(--text-secondary)]">AI驱动科学训练，固定器械精准纠错</p>
        </div>

        <div className="mx-auto aspect-square w-[82%] overflow-hidden rounded-full border-[16px] border-white bg-white shadow-[0_24px_80px_-50px_rgba(111,82,204,0.65)]">
          <img alt="AI-FIT training" className="h-full w-full object-cover grayscale" src="/figma/welcome.png" />
        </div>
      </div>

      <div className="space-y-5">
        <Button asChild className="min-h-[60px] w-full rounded-[18px] text-[19px]">
          <Link to={routes.login}>手机号登录 / 注册</Link>
        </Button>
        <Button asChild className="min-h-[58px] w-full rounded-[18px] border-2 border-[var(--accent-primary-ink)] text-[18px]" variant="secondary">
          <Link to={routes.onboarding}>游客模式浏览</Link>
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-[13px] leading-[20px] text-[var(--text-tertiary)]">
          <ShieldCheck className="size-4" />
          登录即代表同意 <span className="font-semibold text-[var(--accent-primary-ink)]">用户协议</span> 与{' '}
          <span className="font-semibold text-[var(--accent-primary-ink)]">隐私政策</span>
        </p>
      </div>
    </div>
  )
}
