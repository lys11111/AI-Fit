import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { usePrototypeState } from '@/prototype/state'

export function NotificationSettingsScreen() {
  const { state, actions } = usePrototypeState()
  const [form, setForm] = useState(state.profileSettings.notificationSettings)
  const [saved, setSaved] = useState(false)

  return (
    <Screen dataScreen="notification-settings">
      <PageHeader
        backTo={routes.app.profileAccount}
        description="通知中心、首页铃铛和个人页铃铛都会共享这里的状态。"
        title="通知设置"
        variant="compact"
      />

      <GroupedSection className="space-y-3">
        <InsetRow
          helperText="训练强度变化、主线调整和总结更新。"
          title="教练提醒"
          trailing={
            <Switch
              ariaLabel="教练提醒"
              checked={form.coachReminders}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, coachReminders: checked }))}
            />
          }
        />
        <InsetRow
          helperText="训练前加餐、识别确认和记录补写。"
          title="饮食提醒"
          trailing={
            <Switch
              ariaLabel="饮食提醒"
              checked={form.nutritionReminders}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, nutritionReminders: checked }))}
            />
          }
        />
        <InsetRow
          helperText="搭子匹配、轻量私聊草稿和互动回访。"
          title="社区更新"
          trailing={
            <Switch
              ariaLabel="社区更新"
              checked={form.communityUpdates}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, communityUpdates: checked }))}
            />
          }
        />
        <InsetRow
          helperText="晚间训练外的时间尽量少打断。"
          title="免打扰时段"
          trailing={
            <Switch
              ariaLabel="免打扰时段"
              checked={form.quietHours}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, quietHours: checked }))}
            />
          }
        />
        {saved ? (
          <Badge className="w-fit" variant="mint">
            通知设置已保存
          </Badge>
        ) : null}
        <Button
          className="w-full"
          onClick={() => {
            actions.updateNotificationSettings(form)
            setSaved(true)
          }}
        >
          保存通知设置
        </Button>
      </GroupedSection>
    </Screen>
  )
}
