import { ArrowRight, ClipboardList, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'

export function OnboardingStartScreen() {
  return (
    <Screen dataScreen="onboarding-start">
      <div className="space-y-7 pt-4">
        <div className="overflow-hidden rounded-[32px] border border-[var(--border-strong)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]">
          <div className="h-56 bg-[url('/figma/onboarding-start.png')] bg-cover bg-top" />
          <div className="space-y-3 p-5">
            <p className="text-[13px] font-bold uppercase tracking-[0.24em] text-[var(--accent-primary-ink)]">AI-FIT Intake</p>
            <h1 className="text-[34px] leading-[40px] font-semibold text-[var(--text-primary)]">先了解你的身体和训练目标</h1>
            <p className="text-[15px] leading-[23px] text-[var(--text-secondary)]">完成基础采集后，AI 会进入 10 题训练问卷，生成固定器械优先的训练计划。</p>
          </div>
        </div>

        <GroupedSection className="space-y-3" variant="inset">
          <InsetRow copy="身高、体重、训练目标和身体状态会影响计划强度。" icon={ClipboardList} title="基础信息采集" tone="mint" />
          <InsetRow copy="后续计划会优先包含当前视觉模型支持的器械动作。" icon={Sparkles} title="AI 计划生成" tone="indigo" />
        </GroupedSection>

        <div className="grid gap-3">
          <Button asChild className="min-h-[58px] rounded-[20px] text-[17px]">
            <Link to={routes.onboardingBasic}>
              开始采集
              <ArrowRight className="size-5" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to={routes.onboarding}>直接进入训练问卷</Link>
          </Button>
        </div>
      </div>
    </Screen>
  )
}
