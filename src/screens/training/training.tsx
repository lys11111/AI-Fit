import {
  Activity,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Dumbbell,
  Layers3,
  Menu,
  Pencil,
  Play,
  Plus,
  ScanLine,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { motion } from 'motion/react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { ActionTile, GroupedSection, InsetRow, MetricCard, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { completionStats } from '@/data'
import { textRoleClasses } from '@/lib/design-system'
import { usePrototypeState } from '@/prototype/state'

const trainingPlans = [
  {
    title: '4周背部训练计划',
    image: '/figma/exercise-detail-lat.png',
    actionCount: '6-8',
    lastTrained: '昨天',
    match: '95%',
    focus: '背部发力',
  },
  {
    title: '我的上肢塑形计划',
    image: '/figma/exercise-detail-row.png',
    actionCount: '5',
    lastTrained: '3天前',
    match: '91%',
    focus: '肩胛控制',
  },
] as const

function PlanCard({
  title,
  image,
  actionCount,
  lastTrained,
  match,
  focus,
}: (typeof trainingPlans)[number]) {
  return (
    <motion.article
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]"
      initial={{ opacity: 0, y: 18 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-52 overflow-hidden bg-[var(--surface-subtle)]">
        <img alt="" className="h-full w-full object-cover object-top" src={image} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_20%,rgba(250,247,255,0.94)_92%)]" />
        <Badge className="absolute right-4 top-4 border-none bg-[#7bf1c5] text-[#174c3b]" variant="outline">
          <CheckCircle2 className="size-3.5" />
          匹配度 {match}
        </Badge>
      </div>

      <div className="space-y-4 px-5 pb-5 pt-3">
        <div className="space-y-1">
          <h2 className="text-[26px] leading-[32px] font-semibold text-[var(--text-primary)]">{title}</h2>
          <p className="text-[14px] leading-[21px] font-medium text-[var(--text-secondary)]">
            已锁定 {focus}，动作限定在当前视觉模型支持的固定器械中。
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[15px] leading-[21px] text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Dumbbell className="size-5 text-[var(--text-tertiary)]" />
            <span>预计动作数：{actionCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 className="size-5 text-[var(--text-tertiary)]" />
            <span>最近训练：{lastTrained}</span>
          </div>
        </div>

        <Button asChild className="min-h-[58px] w-full rounded-[24px] text-[18px]">
          <Link to={routes.app.workout}>
            开始训练
            <Play className="size-5" />
          </Link>
        </Button>
      </div>
    </motion.article>
  )
}

export function TrainingScreen() {
  const { state } = usePrototypeState()
  const [completed, sets, duration] = completionStats
  const weeklyProgress = Math.round((state.planLibrary.weeklyDays / 5) * 100)

  return (
    <Screen dataScreen="training">
      <div className="grid grid-cols-[44px_1fr_44px] items-center pt-2">
        <button
          aria-label="打开训练菜单"
          className="flex size-11 items-center justify-center rounded-full text-[var(--accent-primary-ink)] transition hover:bg-[var(--state-hover)]"
          type="button"
        >
          <Menu className="size-7" />
        </button>
        <h1 className="text-center text-[28px] leading-[34px] font-semibold text-[var(--accent-primary-ink)]">训练计划</h1>
        <Link
          aria-label="进入我的"
          className="flex size-11 items-center justify-center rounded-full bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]"
          to={routes.app.profile}
        >
          <UserRound className="size-6" />
        </Link>
      </div>

      <div className="space-y-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[48px] leading-[52px] font-semibold text-[var(--accent-primary-ink)]">计划</h2>
          <div className="flex shrink-0 gap-3">
            <Button asChild className="rounded-full px-4" variant="secondary">
              <Link to={routes.app.planStructure}>
                <Pencil className="size-4" />
                继续编辑
              </Link>
            </Button>
            <Button asChild className="rounded-full px-4">
              <Link to={routes.app.planNew}>
                <Plus className="size-4" />
                新建计划
              </Link>
            </Button>
          </div>
        </div>

        <GroupedSection className="grid grid-cols-[1fr_auto] items-center gap-5 rounded-[28px] px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-[20px] bg-[var(--accent-primary-soft)] text-[var(--accent-primary-ink)]">
              <Layers3 className="size-7" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-[var(--text-secondary)]">当前计划数</p>
              <p className="text-[42px] leading-[46px] font-semibold text-[var(--accent-primary-ink)]">{state.planLibrary.planCount}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[15px] font-semibold text-[var(--text-secondary)]">器械匹配度</p>
            <p className="text-[38px] leading-[44px] font-semibold text-[var(--accent-mint-solid)]">{state.plan.match.replace(/.*?(\d+%).*/, '$1')}</p>
          </div>
        </GroupedSection>

        <GroupedSection className="space-y-5 rounded-[28px] px-5 py-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[17px] font-semibold text-[var(--text-secondary)]">本周训练进度</p>
              <p className="mt-4 text-[42px] leading-[44px] font-semibold text-[var(--accent-primary-ink)]">
                {state.planLibrary.weeklyDays}
                <span className="text-[24px] text-[var(--text-secondary)]"> / 5 次</span>
              </p>
            </div>
            <div className="w-[38%] pb-2">
              <Progress value={weeklyProgress} />
            </div>
          </div>
        </GroupedSection>
      </div>

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <p className={textRoleClasses.meta}>AI GENERATED</p>
            <h2 className={textRoleClasses.pageTitleCompact}>问卷生成的推荐训练</h2>
            <p className={textRoleClasses.body}>{state.plan.summary}</p>
          </div>
          <Badge variant="mint">{state.plan.match}</Badge>
        </div>
        <div className="grid gap-2.5">
          {state.plan.exercises.map((exercise, index) => (
            <InsetRow
              copy={`${exercise.sets} 组 · ${exercise.reps} · ${exercise.focus}`}
              icon={index === 0 ? Sparkles : Activity}
              key={exercise.name}
              meta={exercise.machineClass}
              title={exercise.name}
              tone={index === 0 ? 'mint' : 'primary'}
            />
          ))}
        </div>
        <Button asChild className="w-full" variant="secondary">
          <Link to={routes.planPreview}>查看生成依据</Link>
        </Button>
      </GroupedSection>

      <div className="grid gap-3">
        <SectionHeader kicker="TRAINING LIBRARY" title="我的训练库" />
        {trainingPlans.map((plan) => (
          <PlanCard key={plan.title} {...plan} />
        ))}
      </div>

      <div className="grid gap-3">
        <SectionHeader kicker="AI & PLAN TOOLS" title="AI 辅助与计划管理" />
        <ActionTile helperText="输入训练问题，获得围绕当前计划和器械的调整建议。" icon={Bot} meta="AI 教练" title="AI 健身对话" to={routes.app.fitnessChat} variant="emphasized" />
        <ActionTile helperText="查看动作要点、常见错误和训练提示。" icon={ScanLine} meta="动作学习" title="学习动作要点" to={routes.app.exercise} tone="amber" />
        <ActionTile helperText="创建新的计划名称、训练分化和每周训练天数。" icon={Plus} meta="新建计划" title="新建训练计划" to={routes.app.planNew} tone="mint" />
        <ActionTile helperText="调整每周训练结构，并进入训练日编辑。" icon={CalendarDays} meta={state.planLibrary.trainingSplit} title="训练结构设置" to={routes.app.planStructure} tone="primary" />
        <ActionTile helperText="从当前模型支持的器械动作中添加到计划草稿。" icon={Dumbbell} meta={`${state.planLibrary.selectedExercises.length} 个自选动作`} title="添加动作" to={routes.app.planAddExercise} tone="amber" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard hint={duration.hint} label={duration.label} tone="amber" value={duration.value} />
        <MetricCard hint={completed.hint} label={completed.label} tone="mint" value={completed.value} />
        <MetricCard hint={sets.hint} label={sets.label} tone="indigo" value={sets.value} />
      </div>
    </Screen>
  )
}
