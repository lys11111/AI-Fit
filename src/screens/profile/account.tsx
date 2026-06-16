import { Activity, BadgeCheck, Bell, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, PageHeader, Screen } from '@/components/app/primitives'

export function ProfileAccountScreen() {
  return (
    <Screen dataScreen="profile-account">
      <PageHeader
        backTo={routes.app.profile}
        description="先给用户一个清晰分组，再进入具体编辑页。"
        title="账户与资料中心"
        variant="compact"
      />

      <GroupedSection className="space-y-3">
        <InteractiveRow helperText="名字、城市、个人简介。" icon={UserRound} title="个人资料" to={routes.app.personalInfo} />
        <InteractiveRow helperText="身高、体重、体脂率和腰围。" icon={Activity} title="体型数据" tone="mint" to={routes.app.bodyData} />
        <InteractiveRow
          helperText="训练目标、时段、器械偏好和标签。"
          icon={SlidersHorizontal}
          title="训练偏好"
          tone="mint"
          to={routes.app.trainingPreferences}
        />
        <InteractiveRow helperText="相机、通知和健康资料权限。" icon={ShieldCheck} title="隐私与权限" to={routes.app.privacy} />
        <InteractiveRow
          helperText="教练提醒、饮食提醒和免打扰时段。"
          icon={Bell}
          title="通知设置"
          tone="amber"
          to={routes.app.notificationSettings}
        />
      </GroupedSection>

      <GroupedSection className="space-y-2" variant="inset">
        <BadgeCheck className="size-5 text-[var(--accent-primary-ink)]" />
        <p className="text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]">账户资料会持续保留</p>
        <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">保存后刷新页面仍会保留，方便持续跟踪训练状态。</p>
      </GroupedSection>
    </Screen>
  )
}
