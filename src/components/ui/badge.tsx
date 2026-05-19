import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-3 py-1 text-[11px] font-semibold tracking-[0.02em]',
  {
    variants: {
      variant: {
        default: 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]',
        mint: 'bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]',
        amber: 'bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]',
        indigo: 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo-ink)]',
        outline: 'border border-[var(--border-strong)] bg-[var(--surface-raised)] text-[var(--text-secondary)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof badgeVariants>) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge }
