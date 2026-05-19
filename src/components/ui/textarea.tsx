import type * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'min-h-28 w-full rounded-[18px] border border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 py-3 text-[14px] leading-[21px] text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-tertiary)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
