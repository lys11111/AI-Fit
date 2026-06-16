import { Apple, Dumbbell, MessagesSquare, User } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { NavLink, useLocation, useOutlet } from 'react-router-dom'

import { routes, tabRoutes } from '@/app/routes'
import { bottomNavStyles, textRoleClasses } from '@/lib/design-system'
import { cn } from '@/lib/utils'

const tabs = [
  { to: routes.app.training, label: '训练', icon: Dumbbell },
  { to: routes.app.community, label: '论坛', icon: MessagesSquare },
  { to: routes.app.nutrition, label: '饮食', icon: Apple },
  { to: routes.app.profile, label: '我的', icon: User },
]

const tabPaths = new Set(tabRoutes)

export function MobileFrame() {
  const location = useLocation()
  const outlet = useOutlet()
  const showTabs = tabPaths.has(location.pathname as (typeof tabRoutes)[number])

  return (
    <div className="min-h-dvh bg-[radial-gradient(circle_at_top,var(--surface-glow-top),transparent_28rem),linear-gradient(180deg,var(--surface-gradient-start)_0%,var(--surface-gradient-end)_100%)] px-0 py-0 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col overflow-hidden bg-[var(--surface-shell)] md:min-h-[900px] md:rounded-[var(--radius-shell)] md:border md:border-[var(--border-shell)] md:shadow-[var(--shadow-shell)]">
        <div className={cn('flex items-center justify-between px-5 pb-2 pt-3 text-[var(--text-tertiary)]', textRoleClasses.meta)}>
          <span>09:41</span>
          <span>AI-FIT</span>
        </div>
        <main className={cn('relative flex-1 overflow-y-auto px-4 pt-1', showTabs ? 'pb-28' : 'pb-6')}>
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={location.pathname}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              className="min-h-full"
              exit={{ opacity: 0, x: -18, filter: 'blur(3px)' }}
              initial={{ opacity: 0, x: 24, filter: 'blur(3px)' }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {outlet}
            </motion.div>
          </AnimatePresence>
        </main>
        {showTabs ? (
          <nav aria-label="底部导航" className={cn('sticky bottom-0 grid grid-cols-4 gap-2 px-3 pb-4 pt-3', bottomNavStyles)}>
            {tabs.map((tab) => {
              const Icon = tab.icon

              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={({ isActive }) =>
                    cn(
                      'flex min-h-14 flex-col items-center justify-center gap-1 rounded-[18px] text-[11px] font-semibold text-[var(--text-tertiary)] transition',
                      isActive && 'bg-[var(--state-selected)] text-[var(--accent-primary-ink)]',
                    )
                  }
                >
                  <Icon className="size-[18px]" strokeWidth={2.1} />
                  <span>{tab.label}</span>
                </NavLink>
              )
            })}
          </nav>
        ) : null}
      </div>
    </div>
  )
}
