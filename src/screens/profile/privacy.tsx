import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { usePrototypeState } from '@/prototype/state'

export function PrivacyScreen() {
  const { state, actions } = usePrototypeState()
  const [form, setForm] = useState(state.profileSettings.privacy)
  const [saved, setSaved] = useState(false)

  return (
    <Screen dataScreen="privacy">
      <PageHeader
        backTo={routes.app.profileAccount}
        description="这页主要演示设置保存和跨页持久化。"
        title="隐私与权限"
        variant="compact"
      />

      <GroupedSection className="space-y-3">
        <InsetRow
          helperText="用于实时动作纠正和饮食拍照识别。"
          title="相机权限"
          trailing={
            <Switch
              ariaLabel="相机权限"
              checked={form.camera}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, camera: checked }))}
            />
          }
        />
        <InsetRow
          helperText="用于训练提醒、营养提示和社区更新。"
          title="通知权限"
          trailing={
            <Switch
              ariaLabel="通知权限"
              checked={form.notifications}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, notifications: checked }))}
            />
          }
        />
        <InsetRow
          helperText="用于和训练恢复状态做轻量联动。"
          title="健康资料"
          trailing={
            <Switch
              ariaLabel="健康资料"
              checked={form.healthData}
              onCheckedChange={(checked) => setForm((current) => ({ ...current, healthData: checked }))}
            />
          }
        />
        {saved ? (
          <Badge className="w-fit" variant="mint">
            权限设置已保存
          </Badge>
        ) : null}
        <Button
          className="w-full"
          onClick={() => {
            actions.updatePrivacy(form)
            setSaved(true)
          }}
        >
          保存权限设置
        </Button>
      </GroupedSection>
    </Screen>
  )
}
