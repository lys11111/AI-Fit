import * as ProgressPrimitive from '@radix-ui/react-progress'
import type * as React from 'react'

import { cn } from '@/lib/utils'

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn('relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--surface-subtle)]', className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className="h-full rounded-full bg-[var(--accent-primary-solid)] transition-all"
        style={{ width: `${value ?? 0}%` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
