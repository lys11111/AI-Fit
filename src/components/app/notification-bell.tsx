import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

export function NotificationBell() {
  const { unreadNotifications } = usePrototypeState()

  return (
    <Button asChild aria-label="通知中心" className="relative" size="icon" variant="secondary">
      <Link data-testid="notification-bell" to={routes.app.notifications}>
        <Bell className="size-[18px]" />
        {unreadNotifications > 0 ? (
          <span
            className="absolute right-2 top-2 min-w-4 rounded-full bg-[var(--accent-primary-solid)] px-1 text-center text-[10px] leading-4 text-[var(--text-inverse)]"
            data-testid="notification-bell-count"
          >
            {unreadNotifications > 9 ? '9+' : unreadNotifications}
          </span>
        ) : null}
      </Link>
    </Button>
  )
}
