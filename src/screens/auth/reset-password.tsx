import { CheckCircle2, LockKeyhole, ShieldCheck, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { usePrototypeState } from '@/prototype/state'

export function ResetPasswordScreen() {
  const { state, actions } = usePrototypeState()
  const [phone, setPhone] = useState(state.auth.phone)
  const [code, setCode] = useState(state.auth.code)
  const [password, setPassword] = useState('')
  const [saved, setSaved] = useState(false)

  return (
    <Screen dataScreen="reset-password">
      <PageHeader backTo={routes.login} eyebrow="Account" title="重置密码" variant="compact" />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <SectionHeader kicker="STEP 1" title="验证手机号" />
        <label className="flex min-h-[58px] items-center gap-3 rounded-[var(--radius-row)] bg-[var(--surface-subtle)] px-4">
          <Smartphone className="size-5 text-[var(--text-secondary)]" />
          <Input className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="手机号" />
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-3">
          <label className="flex min-h-[58px] items-center gap-3 rounded-[var(--radius-row)] bg-[var(--surface-subtle)] px-4">
            <ShieldCheck className="size-5 text-[var(--text-secondary)]" />
            <Input className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" value={code} onChange={(event) => setCode(event.target.value)} placeholder="验证码" />
          </label>
          <Button onClick={() => actions.requestAuthCode(phone)} type="button" variant="secondary">
            获取验证码
          </Button>
        </div>
      </GroupedSection>

      <GroupedSection className="space-y-4">
        <SectionHeader kicker="STEP 2" title="设置新密码" />
        <label className="flex min-h-[58px] items-center gap-3 rounded-[var(--radius-row)] bg-[var(--surface-subtle)] px-4">
          <LockKeyhole className="size-5 text-[var(--text-secondary)]" />
          <Input className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="请输入新密码" type="password" />
        </label>
        {saved ? (
          <Badge className="w-fit" variant="mint">
            <CheckCircle2 className="size-3.5" />
            密码已更新
          </Badge>
        ) : null}
      </GroupedSection>

      <div className="grid gap-3">
        <Button
          disabled={phone.trim().length < 8 || code.trim().length < 4 || password.trim().length < 6}
          onClick={() => {
            actions.saveAuthDraft({ phone, code })
            setSaved(true)
          }}
        >
          保存新密码
        </Button>
        <Button asChild variant="secondary">
          <Link to={routes.login}>返回登录</Link>
        </Button>
      </div>
    </Screen>
  )
}
