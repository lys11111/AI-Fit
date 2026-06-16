import { Activity, BookOpen, ChevronRight, CircleHelp, Info, LogOut, Pencil, Share2, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

export function ProfileScreen() {
  const { state } = usePrototypeState()
  const profile = state.profileSettings.personalInfo

  return (
    <Screen dataScreen="profile">
      <div className="grid grid-cols-[44px_1fr_44px] items-center pt-2">
        <div aria-hidden="true" className="size-11" />
        <h1 className="text-center text-[32px] leading-[38px] font-semibold text-[var(--accent-primary-ink)]">我的</h1>
        <div aria-hidden="true" className="size-11" />
      </div>

      <section className="-mx-4 mt-4 space-y-6 bg-[linear-gradient(180deg,#f1e9ff_0%,#faf7ff_72%)] px-4 pb-5 pt-10">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <div className="size-32 overflow-hidden rounded-full border-[6px] border-white bg-[var(--accent-primary-soft)] shadow-[var(--shadow-raised)]">
              <img alt="" className="h-full w-full object-cover object-center" src="/figma/profile-avatar.png" />
            </div>
            <Link
              aria-label="编辑个人资料"
              className="absolute -bottom-1 right-0 flex size-12 items-center justify-center rounded-full border-[4px] border-white bg-[var(--accent-primary-solid)] text-white shadow-[var(--shadow-raised)]"
              to={routes.app.personalInfo}
            >
              <Pencil className="size-5" />
            </Link>
          </div>
          <h2 className="mt-6 text-[28px] leading-[34px] font-semibold text-[var(--text-primary)]">{profile.name}</h2>
          <p className="mt-2 text-[17px] leading-[24px] font-medium text-[var(--text-secondary)]">{profile.bio}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <GroupedSection className="rounded-[24px] bg-white p-5">
            <p className="text-[38px] leading-[42px] font-semibold text-[var(--accent-primary-ink)]">24</p>
            <p className="text-[16px] font-semibold text-[var(--text-secondary)]">坚持天数</p>
          </GroupedSection>
          <GroupedSection className="rounded-[24px] border-[var(--accent-primary-line)] bg-[#eadbff] p-5">
            <Sparkles className="size-8 text-[var(--accent-primary-ink)]" />
            <p className="mt-6 text-[16px] leading-[22px] font-semibold text-[var(--accent-primary-ink)]">等级：资深营养师</p>
          </GroupedSection>
        </div>
      </section>

      <div className="grid gap-4">
        <Link to={routes.app.tdeeDashboard}>
          <GroupedSection className="flex items-center gap-4 rounded-[24px] bg-white p-5">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-[18px] bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]">
              <TrendingUp className="size-8" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[26px] leading-[31px] font-semibold text-[var(--text-primary)]">数据追踪</h2>
              <p className="mt-1 text-[16px] leading-[23px] font-medium text-[var(--text-secondary)]">实时查看身体代谢与营养数据</p>
            </div>
            <ChevronRight className="size-6 text-[var(--text-tertiary)]" />
          </GroupedSection>
        </Link>

        <div className="grid grid-cols-2 gap-4">
          <Link to={routes.app.buddyMatch}>
            <GroupedSection className="min-h-[170px] rounded-[24px] bg-white p-5">
              <div className="flex size-14 items-center justify-center rounded-[16px] bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]">
                <Users className="size-7" />
              </div>
              <h2 className="mt-8 text-[24px] leading-[30px] font-semibold text-[var(--text-primary)]">寻找搭子</h2>
              <p className="mt-2 text-[14px] leading-[21px] text-[var(--text-secondary)]">寻找志同道合健康伙伴</p>
            </GroupedSection>
          </Link>

          <Link to={routes.app.profileAccount}>
            <GroupedSection className="min-h-[170px] rounded-[24px] bg-white p-5">
              <div className="flex size-14 items-center justify-center rounded-[16px] bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]">
                <BookOpen className="size-7" />
              </div>
              <h2 className="mt-8 text-[24px] leading-[30px] font-semibold text-[var(--text-primary)]">知识详情</h2>
              <p className="mt-2 text-[14px] leading-[21px] text-[var(--text-secondary)]">深度了解食品科学营养</p>
            </GroupedSection>
          </Link>
        </div>
      </div>

      <GroupedSection className="overflow-hidden rounded-[24px] bg-white p-0">
        <InteractiveRow className="rounded-none shadow-none" icon={CircleHelp} title="帮助中心" to={routes.app.help} trailing={<ChevronRight className="size-6 text-[var(--text-tertiary)]" />} />
        <div className="h-px bg-[var(--border-subtle)]" />
        <InteractiveRow className="rounded-none shadow-none" icon={Info} title="关于我们" to={routes.app.about} trailing={<ChevronRight className="size-6 text-[var(--text-tertiary)]" />} />
        <div className="h-px bg-[var(--border-subtle)]" />
        <InteractiveRow className="rounded-none shadow-none" icon={Share2} title="推荐给好友" to={routes.app.invite} trailing={<ChevronRight className="size-6 text-[var(--text-tertiary)]" />} />
      </GroupedSection>

      <GroupedSection className="space-y-3 rounded-[24px] bg-white">
        <InteractiveRow
          description={`${state.bodyData.heightCm} cm · ${state.bodyData.weightKg} kg · 体脂 ${state.bodyData.bodyFatPercent}%`}
          icon={Activity}
          title="体型数据"
          tone="amber"
          to={routes.app.bodyData}
        />
        <InteractiveRow
          description={`当前为 ${state.profileSettings.trainingPreferences.preferredWindow} · ${state.profileSettings.trainingPreferences.sessionDuration}`}
          icon={TrendingUp}
          title="训练偏好"
          tone="mint"
          to={routes.app.trainingPreferences}
        />
      </GroupedSection>

      <Button className="min-h-[64px] w-full rounded-[24px] bg-[#fff2f6] text-[20px] text-[#d42832] shadow-none hover:bg-[#ffe7ee]" type="button" variant="ghost">
        <LogOut className="size-5" />
        退出登录
      </Button>
    </Screen>
  )
}
