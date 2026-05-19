import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-row)] text-[14px] leading-[20px] font-semibold transition-all duration-[var(--motion-duration-standard)] ease-[var(--motion-ease-standard)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent-primary-solid)] px-4 py-3 text-[var(--text-inverse)] shadow-[var(--shadow-raised)] hover:translate-y-[-1px]',
        secondary: 'border border-[var(--border-strong)] bg-[var(--surface-raised)] px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--state-hover)]',
        ghost: 'bg-transparent px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--state-hover)] hover:text-[var(--text-primary)]',
        subtle: 'bg-[var(--surface-subtle)] px-4 py-3 text-[var(--text-primary)] hover:bg-[var(--primitive-neutral-200)]',
      },
      size: {
        default: 'min-h-11',
        sm: 'min-h-9 rounded-[14px] px-3 text-[14px] leading-[20px]',
        icon: 'size-11 rounded-[var(--radius-row)] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button }
