import { cn } from '@/lib/utils'

type SwitchProps = {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  ariaLabel: string
}

export function Switch({ checked, onCheckedChange, ariaLabel }: SwitchProps) {
  return (
    <button
      aria-checked={checked}
      aria-label={ariaLabel}
      className={cn(
        'relative inline-flex h-7 w-12 items-center rounded-full border transition',
        checked
          ? 'border-[var(--accent-primary-line)] bg-[var(--accent-primary-solid)]'
          : 'border-[var(--border-strong)] bg-[var(--surface-subtle)]',
      )}
      onClick={() => onCheckedChange(!checked)}
      role="switch"
      type="button"
    >
      <span
        className={cn(
          'inline-block size-5 rounded-full bg-white shadow-[var(--shadow-subtle)] transition',
          checked ? 'translate-x-6' : 'translate-x-1',
        )}
      />
    </button>
  )
}
