import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InfoTip } from '@/components/ui/info-tip'
import {
  accentToneStyles,
  actionRowVariantStyles,
  groupedSectionVariants,
  heroPanelStyles,
  metricVariantStyles,
  motionPresets,
  pageHeaderVariantStyles,
  radiusClasses,
  screenDensityClasses,
  textRoleClasses,
  type AccentTone,
  type ActionRowVariant,
  type MetricVariant,
  type PageHeaderVariant,
  type ScreenDensity,
  type SectionTone,
} from '@/lib/design-system'
import { cn } from '@/lib/utils'

type SharedHelperTextProps = {
  helperText?: string
  helperTextLabel?: string
  helperTextTestId?: string
}

type ScreenProps = {
  children: ReactNode
  dataScreen: string
  density?: ScreenDensity
}

type PageHeaderProps = SharedHelperTextProps & {
  title: string
  eyebrow?: string
  description?: string
  backTo?: string
  actions?: ReactNode
  variant?: PageHeaderVariant
}

type SectionHeaderProps = {
  title: string
  kicker?: string
  actionTo?: string
  actionLabel?: string
  tone?: SectionTone
}

type MetricCardProps = {
  label: string
  value: string
  hint?: string
  tone?: AccentTone
  variant?: MetricVariant
  className?: string
}

type MessageBubbleProps = {
  role: 'ai' | 'user'
  message: string
  meta?: string
}

type ActionTileProps = SharedHelperTextProps & {
  to: string
  title: string
  copy?: string
  icon: LucideIcon
  tone?: AccentTone
  variant?: ActionRowVariant
  meta?: string
}

type GroupedSectionProps = {
  children: ReactNode
  className?: string
  variant?: 'default' | 'inset'
}

type InsetRowProps = SharedHelperTextProps & {
  title: string
  copy?: string
  icon?: LucideIcon
  tone?: AccentTone
  trailing?: ReactNode
  meta?: string
  className?: string
}

type InteractiveRowProps = SharedHelperTextProps & {
  to?: string
  onClick?: () => void
  title: string
  description?: string
  copy?: string
  icon?: LucideIcon
  tone?: AccentTone
  trailing?: ReactNode
  meta?: string
  className?: string
  disabled?: boolean
  ariaLabel?: string
  testId?: string
}

function TitleWithHelper({
  title,
  helperText,
  helperTextLabel,
  helperTextTestId,
  titleClassName,
}: {
  title: string
  helperText?: string
  helperTextLabel?: string
  helperTextTestId?: string
  titleClassName: string
}) {
  return (
    <div className="flex items-start gap-2">
      <p className={cn(titleClassName, 'min-w-0 flex-1')}>{title}</p>
      {helperText ? (
        <InfoTip
          label={helperTextLabel ?? `${title}说明`}
          testId={helperTextTestId}
          text={helperText}
        />
      ) : null}
    </div>
  )
}

export function Screen({ children, dataScreen, density = 'comfortable' }: ScreenProps) {
  return (
    <motion.section
      animate={motionPresets.screen.animate}
      className={screenDensityClasses[density]}
      data-screen={dataScreen}
      initial={motionPresets.screen.initial}
    >
      {children}
    </motion.section>
  )
}

export function PageHeader({
  title,
  eyebrow,
  description,
  helperText,
  helperTextLabel,
  helperTextTestId,
  backTo,
  actions,
  variant = 'secondary',
}: PageHeaderProps) {
  const navigate = useNavigate()
  const variantStyles = pageHeaderVariantStyles[variant]
  const infoText = helperText ?? description

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()

    if (backTo) {
      navigate(backTo)
      return
    }

    const historyIndex =
      typeof window !== 'undefined' && typeof window.history.state?.idx === 'number' ? window.history.state.idx : 0

    if (historyIndex > 0) {
      navigate(-1)
    }
  }

  return (
    <header className="space-y-4 pt-2">
      <div className="grid grid-cols-[44px_1fr_44px] items-start gap-3">
        {backTo ? (
          <button
            aria-label="返回"
            className="flex size-11 items-center justify-center rounded-[var(--radius-row)] border border-[var(--border-subtle)] bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[var(--shadow-subtle)] transition hover:bg-[var(--state-hover)]"
            onClick={handleBack}
            type="button"
          >
            <ArrowLeft className="size-[18px]" />
          </button>
        ) : (
          <div aria-hidden="true" className="size-11" />
        )}
        <div className={cn(variantStyles.spacing, 'pt-0.5')}>
          {eyebrow ? <p className={textRoleClasses.meta}>{eyebrow}</p> : null}
          <div className="flex items-start gap-2">
            <h1 className={cn(variantStyles.title, 'min-w-0 flex-1')}>{title}</h1>
            {infoText ? (
              <InfoTip
                label={helperTextLabel ?? `${title}说明`}
                testId={helperTextTestId}
                text={infoText}
              />
            ) : null}
          </div>
        </div>
        <div className="flex min-h-11 items-start justify-end">{actions}</div>
      </div>
    </header>
  )
}

export function SectionHeader({ title, kicker, actionTo, actionLabel, tone = 'default' }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-3">
      <div className="space-y-1">
        {kicker ? <p className={textRoleClasses.meta}>{kicker}</p> : null}
        <h2 className={cn(textRoleClasses.sectionTitle, tone === 'muted' && 'text-[var(--text-secondary)]')}>{title}</h2>
      </div>
      {actionTo && actionLabel ? (
        <Link className="text-[14px] leading-[20px] font-semibold text-[var(--accent-primary-ink)]" to={actionTo}>
          {actionLabel}
        </Link>
      ) : null}
    </div>
  )
}

export function MetricCard({ label, value, hint, tone = 'primary', variant = 'compact', className }: MetricCardProps) {
  const toneClasses = accentToneStyles[tone]
  const variantStyles = metricVariantStyles[variant]

  return (
    <motion.div animate={motionPresets.card.animate} initial={motionPresets.card.initial}>
      <div className={cn(variantStyles.container, className)}>
        {variant === 'inline' ? (
          <>
            <Badge className={cn('border-none', toneClasses.soft)} variant="outline">
              {label}
            </Badge>
            <div className="min-w-0 flex-1">{hint ? <p className={variantStyles.hint}>{hint}</p> : null}</div>
            <p className={variantStyles.value}>{value}</p>
          </>
        ) : (
          <div className="space-y-3">
            <Badge className={cn('w-fit border-none', toneClasses.soft)} variant="outline">
              {label}
            </Badge>
            <div className="space-y-1">
              <p className={variantStyles.value}>{value}</p>
              {hint ? <p className={variantStyles.hint}>{hint}</p> : null}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export function MessageBubble({ role, message, meta }: MessageBubbleProps) {
  const isAI = role === 'ai'

  return (
    <div className={cn('flex flex-col gap-1.5', isAI ? 'items-start' : 'items-end')}>
      <div
        className={cn(
          'max-w-[85%] rounded-[20px] px-4 py-3 text-[14px] leading-[21px] shadow-[var(--shadow-subtle)]',
          isAI
            ? 'rounded-bl-[8px] bg-[var(--surface-raised)] text-[var(--text-primary)]'
            : 'rounded-br-[8px] bg-[var(--accent-primary-solid)] text-[var(--text-inverse)]',
        )}
      >
        {message}
      </div>
      {meta ? <p className="px-1 text-[11px] text-[var(--text-tertiary)]">{meta}</p> : null}
    </div>
  )
}

export function GroupedSection({ children, className, variant = 'default' }: GroupedSectionProps) {
  return <section className={cn(groupedSectionVariants[variant], 'p-4', className)}>{children}</section>
}

export function InsetRow({
  title,
  copy,
  helperText,
  helperTextLabel,
  helperTextTestId,
  icon: Icon,
  tone = 'primary',
  trailing,
  meta,
  className,
}: InsetRowProps) {
  return (
    <div className={cn(radiusClasses.row, 'flex items-start gap-4 bg-[var(--surface-subtle)] px-4 py-4', className)}>
      {Icon ? (
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-row)]', accentToneStyles[tone].icon)}>
          <Icon className="size-5" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        {meta ? <p className={textRoleClasses.meta}>{meta}</p> : null}
        <TitleWithHelper
          helperText={helperText}
          helperTextLabel={helperTextLabel}
          helperTextTestId={helperTextTestId}
          title={title}
          titleClassName={textRoleClasses.cardTitle}
        />
        {copy ? <p className={textRoleClasses.body}>{copy}</p> : null}
      </div>
      {trailing ? <div className="shrink-0 pt-0.5">{trailing}</div> : null}
    </div>
  )
}

function InteractiveRowBody({
  title,
  description,
  copy,
  helperText,
  helperTextLabel,
  helperTextTestId,
  icon: Icon,
  tone = 'primary',
  trailing,
  meta,
  className,
}: Omit<InteractiveRowProps, 'to' | 'onClick' | 'disabled' | 'ariaLabel' | 'testId'>) {
  return (
    <div
      className={cn(
        radiusClasses.row,
        'flex items-start gap-4 bg-[var(--surface-raised)] px-4 py-4 text-left shadow-[var(--shadow-subtle)] transition hover:translate-y-[-1px] hover:bg-[var(--surface-default)]',
        className,
      )}
    >
      {Icon ? (
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-row)]', accentToneStyles[tone].icon)}>
          <Icon className="size-5" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        {meta ? <p className={textRoleClasses.meta}>{meta}</p> : null}
        <TitleWithHelper
          helperText={helperText}
          helperTextLabel={helperTextLabel}
          helperTextTestId={helperTextTestId}
          title={title}
          titleClassName={textRoleClasses.cardTitle}
        />
        {description ?? copy ? <p className={textRoleClasses.body}>{description ?? copy}</p> : null}
      </div>
      <div className="shrink-0 pt-0.5">{trailing ?? <ArrowRight className="mt-1 size-4 text-[var(--text-tertiary)]" />}</div>
    </div>
  )
}

export function InteractiveRow({ to, onClick, disabled, ariaLabel, testId, ...content }: InteractiveRowProps) {
  const containerClass = disabled ? 'pointer-events-none opacity-50' : ''

  return (
    <motion.div animate={motionPresets.card.animate} className={containerClass} initial={motionPresets.card.initial}>
      {to ? (
        <Link aria-label={ariaLabel ?? content.title} data-testid={testId} to={to}>
          <InteractiveRowBody {...content} />
        </Link>
      ) : (
        <button
          aria-label={ariaLabel ?? content.title}
          className="block w-full bg-transparent p-0"
          data-testid={testId}
          onClick={onClick}
          type="button"
        >
          <InteractiveRowBody {...content} />
        </button>
      )}
    </motion.div>
  )
}

export function ActionTile({
  to,
  title,
  copy,
  helperText,
  helperTextLabel,
  helperTextTestId,
  icon,
  tone = 'primary',
  variant = 'default',
  meta,
}: ActionTileProps) {
  return (
    <Link to={to}>
      <motion.div animate={motionPresets.card.animate} initial={motionPresets.card.initial}>
        <div className={cn(actionRowVariantStyles[variant], 'px-4 py-4 transition hover:translate-y-[-1px]')}>
          <InsetRow
            className="bg-transparent px-0 py-0"
            copy={copy}
            helperText={helperText}
            helperTextLabel={helperTextLabel}
            helperTextTestId={helperTextTestId}
            icon={icon}
            meta={meta}
            title={title}
            tone={tone}
            trailing={<ArrowRight className="mt-1 size-4 shrink-0 text-[var(--text-tertiary)]" />}
          />
        </div>
      </motion.div>
    </Link>
  )
}

export function HeroPanel({
  badge,
  title,
  copy,
  visual,
}: {
  badge: string
  title: string
  copy: string
  visual?: ReactNode
}) {
  return (
    <Card className={cn('overflow-hidden bg-[linear-gradient(180deg,var(--surface-panel-gradient-start),var(--surface-panel-gradient-end))]', heroPanelStyles)}>
      <CardHeader className="space-y-3">
        <Badge className="w-fit" variant="default">
          {badge}
        </Badge>
        <div className="space-y-2">
          <CardTitle className="text-[24px] leading-[29px]">{title}</CardTitle>
          <CardDescription className="max-w-[28ch]">{copy}</CardDescription>
        </div>
      </CardHeader>
      {visual ? <CardContent className="pt-1">{visual}</CardContent> : null}
    </Card>
  )
}
