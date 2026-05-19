import { BellRing, RefreshCcw, Settings2, Trash2 } from 'lucide-react'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

export function NotificationsScreen() {
  const { state, actions, unreadNotifications } = usePrototypeState()

  return (
    <Screen dataScreen="notifications">
      <PageHeader
        backTo={routes.app.home}
        description="这里不是简单堆消息，而是把下一步要不要行动讲清楚。"
        title="通知中心"
        variant="secondary"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Button data-testid="notifications-mark-all" onClick={actions.markAllNotificationsRead} variant="secondary">
          全部标记已读
        </Button>
        <Button data-testid="notifications-clear" onClick={actions.clearNotifications} variant="secondary">
          清空通知
        </Button>
        <Button data-testid="notifications-restore" onClick={actions.restoreNotifications} variant="ghost">
          恢复演示数据
        </Button>
      </div>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]">OVERVIEW</p>
            <h2 className="text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]">当前还有 {unreadNotifications} 条未读提醒</h2>
          </div>
          <Badge variant={unreadNotifications > 0 ? 'amber' : 'mint'}>{unreadNotifications > 0 ? '待处理' : '已清空'}</Badge>
        </div>
        <InteractiveRow
          helperText="训练提醒、饮食提醒、社区更新和免打扰时段都从这里进入。"
          icon={Settings2}
          title="通知设置"
          to={routes.app.notificationSettings}
        />
      </GroupedSection>

      {state.notifications.items.length > 0 ? (
        <div className="grid gap-3">
          <SectionHeader kicker="INBOX" title="消息列表" />
          {state.notifications.items.map((item) => (
            <InteractiveRow
              description={item.copy}
              icon={item.category === 'community' ? BellRing : item.category === 'nutrition' ? RefreshCcw : Trash2}
              key={item.id}
              meta={item.readAt ? '已读' : item.time}
              onClick={() => actions.markNotificationRead(item.id)}
              testId={`notification-item-${item.id}`}
              title={item.title}
              trailing={<Badge variant={item.readAt ? 'outline' : 'mint'}>{item.readAt ? '已读' : '点按已读'}</Badge>}
            />
          ))}
        </div>
      ) : (
        <GroupedSection className="space-y-2" variant="inset">
          <p className="text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]">现在是空收件箱</p>
          <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">这轮演示通知已经处理完了，需要继续演示时可以恢复默认数据。</p>
        </GroupedSection>
      )}
    </Screen>
  )
}
