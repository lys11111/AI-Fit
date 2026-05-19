export type AccentTone = 'primary' | 'mint' | 'amber' | 'indigo'
export type SurfaceRole = 'canvas' | 'shell' | 'default' | 'subtle' | 'raised' | 'accentSoft'
export type BorderRole = 'subtle' | 'strong' | 'selected' | 'focus'
export type ElevationRole = 'none' | 'subtle' | 'raised' | 'shell'
export type MotionPreset = 'screen' | 'card' | 'list'
export type ScreenDensity = 'comfortable' | 'compact'
export type AppRadius = 'shell' | 'hero' | 'section' | 'row' | 'pill'
export type TextRole =
  | 'display'
  | 'pageTitlePrimary'
  | 'pageTitleSecondary'
  | 'pageTitleCompact'
  | 'sectionTitle'
  | 'cardTitle'
  | 'body'
  | 'meta'
  | 'buttonLabel'
  | 'numericEmphasis'
export type PageHeaderVariant = 'primary' | 'secondary' | 'compact'
export type MetricVariant = 'feature' | 'compact' | 'inline'
export type SectionTone = 'default' | 'muted'
export type ActionRowVariant = 'default' | 'emphasized'
export type PatternRole = 'pageHeader' | 'heroPanel' | 'groupedSection' | 'metric' | 'actionRow' | 'bottomNav'

type AccentStyles = {
  soft: string
  solid: string
  line: string
  text: string
  icon: string
}

export const textRoleClasses: Record<TextRole, string> = {
  display: 'text-[32px] leading-[38px] font-semibold text-[var(--text-primary)]',
  pageTitlePrimary: 'text-[28px] leading-[32px] font-semibold text-[var(--text-primary)]',
  pageTitleSecondary: 'text-[24px] leading-[29px] font-semibold text-[var(--text-primary)]',
  pageTitleCompact: 'text-[22px] leading-[27px] font-semibold text-[var(--text-primary)]',
  sectionTitle: 'text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]',
  cardTitle: 'text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]',
  body: 'text-[14px] leading-[21px] font-normal text-[var(--text-secondary)]',
  meta: 'text-[11px] leading-[16px] font-semibold uppercase tracking-[0.12em] text-[var(--text-tertiary)]',
  buttonLabel: 'text-[14px] leading-[20px] font-semibold',
  numericEmphasis: 'text-[26px] leading-[28px] font-semibold text-[var(--text-primary)]',
}

export const accentToneStyles: Record<AccentTone, AccentStyles> = {
  primary: {
    soft: 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]',
    solid: 'bg-[var(--accent-primary-solid)] text-[var(--text-inverse)]',
    line: 'border border-[var(--accent-primary-line)] bg-[var(--surface-raised)] text-[var(--accent-primary-ink)]',
    text: 'text-[var(--accent-primary-ink)]',
    icon: 'bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]',
  },
  mint: {
    soft: 'bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]',
    solid: 'bg-[var(--accent-mint-solid)] text-[var(--text-inverse)]',
    line: 'border border-[var(--accent-mint-line)] bg-[var(--surface-raised)] text-[var(--accent-mint-ink)]',
    text: 'text-[var(--accent-mint-ink)]',
    icon: 'bg-[var(--accent-mint-soft)] text-[var(--accent-mint-ink)]',
  },
  amber: {
    soft: 'bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]',
    solid: 'bg-[var(--accent-amber-solid)] text-[var(--text-inverse)]',
    line: 'border border-[var(--accent-amber-line)] bg-[var(--surface-raised)] text-[var(--accent-amber-ink)]',
    text: 'text-[var(--accent-amber-ink)]',
    icon: 'bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]',
  },
  indigo: {
    soft: 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo-ink)]',
    solid: 'bg-[var(--accent-indigo-solid)] text-[var(--text-inverse)]',
    line: 'border border-[var(--accent-indigo-line)] bg-[var(--surface-raised)] text-[var(--accent-indigo-ink)]',
    text: 'text-[var(--accent-indigo-ink)]',
    icon: 'bg-[var(--accent-indigo-soft)] text-[var(--accent-indigo-ink)]',
  },
}

export const surfaceRoleClasses: Record<SurfaceRole, string> = {
  canvas: 'bg-[var(--surface-canvas)]',
  shell: 'bg-[var(--surface-shell)]',
  default: 'bg-[var(--surface-default)]',
  subtle: 'bg-[var(--surface-subtle)]',
  raised: 'bg-[var(--surface-raised)]',
  accentSoft: 'bg-[var(--surface-accent-soft)]',
}

export const borderRoleClasses: Record<BorderRole, string> = {
  subtle: 'border border-[var(--border-subtle)]',
  strong: 'border border-[var(--border-strong)]',
  selected: 'border border-[var(--border-selected)]',
  focus: 'border border-[var(--border-focus)]',
}

export const elevationRoleClasses: Record<ElevationRole, string> = {
  none: 'shadow-none',
  subtle: 'shadow-[var(--shadow-subtle)]',
  raised: 'shadow-[var(--shadow-raised)]',
  shell: 'shadow-[var(--shadow-shell)]',
}

export const radiusClasses: Record<AppRadius, string> = {
  shell: 'rounded-[var(--radius-shell)]',
  hero: 'rounded-[var(--radius-hero)]',
  section: 'rounded-[var(--radius-section)]',
  row: 'rounded-[var(--radius-row)]',
  pill: 'rounded-[var(--radius-pill)]',
}

export const surfaceToneClasses: Record<SectionTone, string> = {
  default: `${surfaceRoleClasses.default} ${borderRoleClasses.subtle} ${elevationRoleClasses.subtle}`,
  muted: `${surfaceRoleClasses.subtle} ${borderRoleClasses.subtle} ${elevationRoleClasses.none}`,
}

export const screenDensityClasses: Record<ScreenDensity, string> = {
  comfortable: 'space-y-5 pb-6',
  compact: 'space-y-4 pb-5',
}

export const pageHeaderVariantStyles: Record<
  PageHeaderVariant,
  { title: string; description: string; spacing: string }
> = {
  primary: {
    title: textRoleClasses.pageTitlePrimary,
    description: 'max-w-[24ch]',
    spacing: 'space-y-2',
  },
  secondary: {
    title: textRoleClasses.pageTitleSecondary,
    description: 'max-w-[26ch]',
    spacing: 'space-y-1.5',
  },
  compact: {
    title: textRoleClasses.pageTitleCompact,
    description: 'max-w-[28ch]',
    spacing: 'space-y-1.5',
  },
}

export const metricVariantStyles: Record<
  MetricVariant,
  { container: string; value: string; hint: string; label: string }
> = {
  feature: {
    container: `${radiusClasses.section} ${surfaceRoleClasses.raised} ${borderRoleClasses.strong} ${elevationRoleClasses.raised} space-y-4 px-5 py-5`,
    value: textRoleClasses.numericEmphasis,
    hint: textRoleClasses.body,
    label: 'text-[12px] leading-[18px] font-semibold text-[var(--text-primary)]',
  },
  compact: {
    container: `${radiusClasses.section} ${surfaceRoleClasses.default} ${borderRoleClasses.subtle} ${elevationRoleClasses.subtle} space-y-3 px-4 py-4`,
    value: textRoleClasses.numericEmphasis,
    hint: 'text-[13px] leading-[19px] text-[var(--text-secondary)]',
    label: 'text-[12px] leading-[18px] font-semibold text-[var(--text-primary)]',
  },
  inline: {
    container: `${radiusClasses.row} ${surfaceRoleClasses.subtle} ${borderRoleClasses.subtle} ${elevationRoleClasses.none} flex items-center gap-3 px-4 py-3`,
    value: 'text-[16px] leading-[22px] font-semibold text-[var(--text-primary)]',
    hint: 'text-[13px] leading-[19px] text-[var(--text-secondary)]',
    label: 'text-[13px] leading-[19px] font-medium text-[var(--text-secondary)]',
  },
}

export const groupedSectionVariants = {
  default: `${radiusClasses.section} ${surfaceRoleClasses.default} ${borderRoleClasses.subtle} ${elevationRoleClasses.subtle}`,
  inset: `${radiusClasses.section} ${surfaceRoleClasses.subtle} ${borderRoleClasses.subtle} ${elevationRoleClasses.none}`,
} as const

export const actionRowVariantStyles: Record<ActionRowVariant, string> = {
  default: `${radiusClasses.section} ${surfaceRoleClasses.default} ${borderRoleClasses.subtle} ${elevationRoleClasses.subtle}`,
  emphasized: `${radiusClasses.section} ${surfaceRoleClasses.raised} ${borderRoleClasses.strong} ${elevationRoleClasses.raised}`,
}

export const heroPanelStyles = `${radiusClasses.hero} ${surfaceRoleClasses.raised} ${borderRoleClasses.strong} ${elevationRoleClasses.raised}`
export const bottomNavStyles = `${surfaceRoleClasses.raised} border-t border-[var(--border-subtle)] backdrop-blur-md`

const ease = [0.22, 1, 0.36, 1] as const

export const motionPresets = {
  screen: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.28, ease } },
  },
  card: {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease } },
  },
  list: (index: number) => ({
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.22, ease, delay: index * 0.035 } },
  }),
} as const satisfies Record<
  MotionPreset,
  | { initial: { opacity: number; y: number }; animate: { opacity: number; y: number; transition: { duration: number; ease: readonly [number, number, number, number] } } }
  | ((index: number) => { initial: { opacity: number; y: number }; animate: { opacity: number; y: number; transition: { duration: number; ease: readonly [number, number, number, number]; delay: number } } })
>

export const appVoice = {
  productStyle: 'iPhone 风格的轻量健身工具界面',
  density: '中高信息密度，但首屏只保留一个强重点',
  primaryAccent: '主色克制，辅助色只用于状态与分组',
  cardUsage: '减少平均卡片感，优先分组列表与轻量行项',
}
