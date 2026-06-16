import { Bell, CircleHelp, ShieldCheck, SlidersHorizontal, UserRound } from 'lucide-react'

import { routes } from '@/app/routes'
import { NotificationBell } from '@/components/app/notification-bell'
import { GroupedSection, InteractiveRow, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { profileHighlights } from '@/data'
import { usePrototypeState } from '@/prototype/state'

export function ProfileScreen() {
  const { state } = usePrototypeState()
  const [planHighlight, bodyHighlight, nutritionHighlight] = profileHighlights

  return (
    <Screen dataScreen="profile">
      <PageHeader
        actions={<NotificationBell />}
        description="把账户、进度和支持入口收在同一页里，用户点哪里都应该有明确去处。"
        eyebrow="Profile"
        title="我的"
        variant="secondary"
      />

      <div className="grid gap-3">
        <MetricCard hint={planHighlight.copy} label={planHighlight.title} tone="indigo" value={planHighlight.value} variant="feature" />
        <MetricCard hint={bodyHighlight.copy} label={bodyHighlight.title} tone="mint" value={bodyHighlight.value} variant="inline" />
        <MetricCard hint={nutritionHighlight.copy} label={nutritionHighlight.title} tone="amber" value={nutritionHighlight.value} variant="inline" />
      </div>

      <GroupedSection className="space-y-4 border-[var(--border-strong)]">
        <SectionHeader kicker="STATUS" title="当前状态" />
        <div className="grid gap-2.5">
          <InteractiveRow
            helperText="相机、通知和健康资料都能单独控制。"
            icon={ShieldCheck}
            title="隐私与权限"
            to={routes.app.privacy}
          />
          <InteractiveRow
            description={`当前为 ${state.profileSettings.trainingPreferences.preferredWindow} · ${state.profileSettings.trainingPreferences.sessionDuration}`}
            icon={SlidersHorizontal}
            title="训练偏好"
            tone="mint"
            to={routes.app.trainingPreferences}
          />
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <GroupedSection className="space-y-4">
          <SectionHeader actionLabel="查看全部" actionTo={routes.app.profileAccount} kicker="ACCOUNT" title="账户与资料" />
          <div className="grid gap-2.5">
            <InteractiveRow
              helperText="统一进入个人资料、训练偏好、隐私与通知设置。"
              icon={UserRound}
              title="账户中心"
              to={routes.app.profileAccount}
            />
            <InteractiveRow
              helperText="编辑名字、城市和简介，并持久保留。"
              icon={UserRound}
              title="个人资料"
              to={routes.app.personalInfo}
            />
            <InteractiveRow
              helperText="调整教练提醒、饮食提醒和免打扰时段。"
              icon={Bell}
              title="通知设置"
              tone="amber"
              to={routes.app.notificationSettings}
            />
          </div>
        </GroupedSection>

        <GroupedSection className="space-y-4">
          <SectionHeader actionLabel="查看全部" actionTo={routes.app.profileSupport} kicker="SUPPORT" title="帮助与服务" />
          <div className="grid gap-2.5">
            <InteractiveRow
              helperText="帮助、关于、反馈和邀请都从这里展开。"
              icon={CircleHelp}
              title="支持中心"
              to={routes.app.profileSupport}
            />
            <InteractiveRow
              helperText="查看常见问题、识别说明和原型范围。"
              icon={CircleHelp}
              title="帮助中心"
              to={routes.app.help}
            />
            <InteractiveRow
              helperText="把这轮体验里的卡点写回来。"
              icon={CircleHelp}
              title="反馈问题"
              tone="mint"
              to={routes.app.supportFeedback}
            />
          </div>
        </GroupedSection>
      </div>
    </Screen>
  )
}
