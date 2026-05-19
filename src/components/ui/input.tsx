import type * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'flex h-12 w-full rounded-[var(--radius-row)] border border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 py-3 text-[14px] leading-[20px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
