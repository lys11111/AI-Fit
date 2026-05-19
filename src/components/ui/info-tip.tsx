import { Info } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from 'react'

import { cn } from '@/lib/utils'

type InfoTipProps = {
  text: string
  label?: string
  className?: string
  panelClassName?: string
  testId?: string
  align?: 'start' | 'end'
}

export function InfoTip({
  text,
  label = '查看说明',
  className,
  panelClassName,
  testId,
  align = 'end',
}: InfoTipProps) {
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const panelId = useId()
  const open = pinned || hovered || focused

  useEffect(() => {
    if (!pinned) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (wrapperRef.current?.contains(event.target as Node)) {
        return
      }

      setPinned(false)
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPinned(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [pinned])

  const stopInteraction = (event: MouseEvent<HTMLSpanElement> | ReactKeyboardEvent<HTMLSpanElement>) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    stopInteraction(event)
    setPinned((current) => !current)
  }

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      stopInteraction(event)
      setPinned((current) => !current)
      return
    }

    if (event.key === 'Escape') {
      stopInteraction(event)
      setPinned(false)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    if (wrapperRef.current?.contains(event.relatedTarget as Node)) {
      return
    }

    setFocused(false)
  }

  return (
    <span
      className={cn('relative inline-flex shrink-0 items-start', className)}
      onBlur={handleBlur}
      onFocus={() => setFocused(true)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={wrapperRef}
    >
      <span
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={label}
        className="inline-flex size-5 cursor-pointer items-center justify-center rounded-full text-[var(--text-tertiary)] transition hover:bg-[var(--surface-subtle)] hover:text-[var(--accent-primary-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
        data-slot="info-tip-trigger"
        data-testid={testId}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
      >
        <Info className="size-3.5" strokeWidth={2.2} />
      </span>

      <span
        aria-hidden={!open}
        className={cn(
          'absolute top-[calc(100%+8px)] z-50 w-[min(18rem,calc(100vw-2rem))] rounded-[16px] border border-[var(--border-strong)] bg-[var(--surface-raised)] px-3 py-2 text-[13px] leading-[19px] text-[var(--text-secondary)] shadow-[var(--shadow-raised)] transition',
          align === 'start' ? 'left-0' : 'right-0',
          open ? 'pointer-events-auto visible translate-y-0 opacity-100' : 'pointer-events-none invisible -translate-y-1 opacity-0',
          panelClassName,
        )}
        data-slot="info-tip-panel"
        data-testid={testId ? `${testId}-panel` : undefined}
        id={panelId}
        role="tooltip"
      >
        {text}
      </span>
    </span>
  )
}
