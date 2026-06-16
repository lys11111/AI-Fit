import { useState } from 'react'

import { routes } from '@/app/routes'
import { GroupedSection, PageHeader, Screen } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { usePrototypeState } from '@/prototype/state'

export function PersonalInfoScreen() {
  const { state, actions } = usePrototypeState()
  const [form, setForm] = useState(state.profileSettings.personalInfo)
  const [saved, setSaved] = useState(false)

  return (
    <Screen dataScreen="personal-info">
      <PageHeader
        backTo={routes.app.profileAccount}
        title="个人资料"
        description="完善昵称、城市和个人简介，让训练计划和社区推荐更贴合你。"
        variant="compact"
      />

      <GroupedSection className="space-y-4">
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">昵称</span>
          <Input id="personal-info-name" onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} value={form.name} />
        </label>
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">城市</span>
          <Input id="personal-info-city" onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} value={form.city} />
        </label>
        <label className="space-y-2">
          <span className="text-[14px] font-medium text-[var(--text-primary)]">简介</span>
          <Textarea id="personal-info-bio" onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))} value={form.bio} />
        </label>
        {saved ? <Badge variant="mint" className="w-fit">资料已保存</Badge> : null}
        <Button
          className="w-full"
          data-testid="save-personal-info"
          onClick={() => {
            actions.updatePersonalInfo(form)
            setSaved(true)
          }}
        >
          保存个人资料
        </Button>
      </GroupedSection>
    </Screen>
  )
}
