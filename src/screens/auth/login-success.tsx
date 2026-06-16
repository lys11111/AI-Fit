import { CheckCircle2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'

export function LoginSuccessScreen() {
  return (
    <Screen dataScreen="login-success">
      <div className="flex min-h-[calc(100dvh-120px)] flex-col justify-center gap-8 text-center">
        <div className="mx-auto flex size-24 items-center justify-center rounded-[32px] bg-[var(--accent-primary-solid)] text-white shadow-[var(--shadow-raised)]">
          <CheckCircle2 className="size-12" />
        </div>
        <div className="space-y-3">
          <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-[var(--accent-primary-ink)]">Welcome Back</p>
          <h1 className="text-[36px] leading-[42px] font-semibold text-[var(--text-primary)]">登录成功</h1>
          <p className="mx-auto max-w-[26ch] text-[16px] leading-[24px] text-[var(--text-secondary)]">接下来完成训练问卷，AI-FIT 会生成适合你的固定器械训练计划。</p>
        </div>

        <GroupedSection className="space-y-3 text-left" variant="inset">
          <InsetRow copy="问卷会读取目标、频率、训练地点、体能基础和功能偏好。" icon={Sparkles} title="准备生成计划" tone="indigo" />
        </GroupedSection>

        <Button asChild className="min-h-[58px] w-full rounded-[20px] text-[18px]">
          <Link to={routes.onboardingStart}>开始定制计划</Link>
        </Button>
      </div>
    </Screen>
  )
}
