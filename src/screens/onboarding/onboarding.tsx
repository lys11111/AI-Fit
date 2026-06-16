import {
  Activity,
  BatteryMedium,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  HeartPulse,
  MapPin,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { routes } from '@/app/routes'
import { Button } from '@/components/ui/button'
import { usePrototypeState } from '@/prototype/state'

type QuestionKey =
  | 'goal'
  | 'trainingPlace'
  | 'weeklyFrequency'
  | 'sessionDuration'
  | 'pushupLevel'
  | 'squatLevel'
  | 'plankLevel'
  | 'recoveryLevel'
  | 'bodyStatus'
  | 'featurePreference'

type Question = {
  key: QuestionKey
  eyebrow: string
  title: string
  subtitle: string
  icon: typeof Target
  analysis: string
  options: Array<{
    label: string
    copy: string
  }>
}

const questions: Question[] = [
  {
    key: 'goal',
    eyebrow: 'QUESTION 01',
    title: '你的训练目标是什么？',
    subtitle: '选择当前最想优先实现的目标',
    icon: Target,
    analysis: 'AI 会根据目标决定训练分化、动作顺序和饮食建议。',
    options: [
      { label: '减脂', copy: '消耗多余脂肪，塑造精干体型' },
      { label: '增肌', copy: '提升肌肉质量，增加基础代谢' },
      { label: '体态改善', copy: '矫正圆肩驼背，改善脊柱健康' },
      { label: '塑形', copy: '优化身体线条，强化局部紧致度' },
      { label: '提升力量', copy: '突破负重极限，增强核心稳定性' },
    ],
  },
  {
    key: 'trainingPlace',
    eyebrow: 'QUESTION 02',
    title: '你主要在哪里训练？',
    subtitle: '这会影响可用器械和动作安排',
    icon: MapPin,
    analysis: '当前会优先使用固定器械区，方便进行器械识别和动作纠偏。',
    options: [
      { label: '健身房固定器械区', copy: '优先匹配推胸、下拉、划船、腿举等器械' },
      { label: '健身房自由重量区', copy: '可安排史密斯机作为稳定动作入口' },
      { label: '家庭训练', copy: '以低风险动作和后续替代方案为主' },
    ],
  },
  {
    key: 'weeklyFrequency',
    eyebrow: 'QUESTION 03',
    title: '你每周计划训练几次？',
    subtitle: '频率决定恢复节奏和训练分化',
    icon: CalendarDays,
    analysis: 'AI 会避免给低频用户安排过细的分化，先保证可持续。',
    options: [
      { label: '每周 2 次', copy: '适合刚开始恢复运动习惯' },
      { label: '每周 3 次', copy: '适合全身或上下肢交替训练' },
      { label: '每周 4 次', copy: '适合胸背腿肩的轻分化安排' },
      { label: '每周 5 次', copy: '适合更明确的部位专项推进' },
    ],
  },
  {
    key: 'sessionDuration',
    eyebrow: 'QUESTION 04',
    title: '单次训练你希望多久？',
    subtitle: '训练计划会控制在这个时间窗口内',
    icon: Clock3,
    analysis: '时长越短，动作数量越少，优先保留可被视觉模型识别的关键器械。',
    options: [
      { label: '30 分钟', copy: '少动作，高执行率' },
      { label: '45 分钟', copy: '兼顾热身、主项和辅助动作' },
      { label: '60 分钟', copy: '适合完整部位专项训练' },
    ],
  },
  {
    key: 'pushupLevel',
    eyebrow: 'QUESTION 05',
    title: '你的上肢推力基础如何？',
    subtitle: '用俯卧撑或推举稳定度做粗略评估',
    icon: Dumbbell,
    analysis: '推力基础会影响推胸机、肩推机和坐姿臂屈伸的组数。',
    options: [
      { label: '几乎做不了标准俯卧撑', copy: '先用固定器械建立轨迹' },
      { label: '标准俯卧撑 6-15 个', copy: '适合中等容量训练' },
      { label: '标准俯卧撑 15 个以上', copy: '可以加入更高强度安排' },
    ],
  },
  {
    key: 'squatLevel',
    eyebrow: 'QUESTION 06',
    title: '你的下肢动作稳定吗？',
    subtitle: '评估深蹲、腿举和膝髋控制',
    icon: Activity,
    analysis: '如果深蹲稳定性一般，腿举机会比复杂自由重量更适合作为主动作。',
    options: [
      { label: '深蹲容易膝内扣', copy: '优先低负荷轨迹控制' },
      { label: '徒手深蹲动作稳定', copy: '可安排腿举和腿屈伸' },
      { label: '有负重训练经验', copy: '可安排更高组数或更高强度' },
    ],
  },
  {
    key: 'plankLevel',
    eyebrow: 'QUESTION 07',
    title: '核心稳定能力如何？',
    subtitle: '用平板支撑时间判断躯干控制',
    icon: ShieldAlert,
    analysis: '核心稳定会影响坐姿划船、下拉和史密斯动作的纠偏优先级。',
    options: [
      { label: '少于 30 秒', copy: '先降低负荷，强调躯干稳定' },
      { label: '45-90 秒', copy: '适合常规固定器械训练' },
      { label: '90 秒以上', copy: '可以承接更高强度训练' },
    ],
  },
  {
    key: 'recoveryLevel',
    eyebrow: 'QUESTION 08',
    title: '你通常多久恢复？',
    subtitle: '恢复速度会影响训练密度',
    icon: BatteryMedium,
    analysis: '恢复慢时，AI 会减少重复刺激，避免计划看起来很猛但执行不了。',
    options: [
      { label: '第二天仍明显酸痛', copy: '降低容量，增加恢复提示' },
      { label: '训练后 1-2 天恢复', copy: '适合中等训练密度' },
      { label: '恢复很快', copy: '可以安排更积极的训练推进' },
    ],
  },
  {
    key: 'bodyStatus',
    eyebrow: 'QUESTION 09',
    title: '近期身体有没有不适？',
    subtitle: '安全信息会影响动作选择',
    icon: HeartPulse,
    analysis: '如有肩颈、腰背或膝盖不适，系统会优先选择更稳定的器械动作。',
    options: [
      { label: '无明显疼痛或伤病', copy: '按目标正常生成计划' },
      { label: '肩颈容易紧张', copy: '减少耸肩风险，强化肩胛控制' },
      { label: '腰背容易疲劳', copy: '降低躯干压力，优先坐姿器械' },
      { label: '膝盖偶尔不适', copy: '控制下肢动作幅度和负荷' },
    ],
  },
  {
    key: 'featurePreference',
    eyebrow: 'QUESTION 10',
    title: '你最想优先体验哪项 AI 功能？',
    subtitle: '决定进入产品后的主要训练路径',
    icon: Sparkles,
    analysis: '选择动作纠偏后，训练计划会优先包含可被 YOLO 模型识别的固定器械。',
    options: [
      { label: 'AI 动作纠偏', copy: '识别器械后进入摄像头训练界面' },
      { label: 'AI 生成训练计划', copy: '根据问卷自动生成可执行计划' },
      { label: 'AI 饮食建议', copy: '围绕训练日给出饮食安排' },
      { label: 'AI 数据追踪', copy: '关注身体变化和训练趋势' },
    ],
  },
]

function inferFocusPreference(goal: string, featurePreference: string) {
  if (goal.includes('力量')) {
    return '腿部力量'
  }

  if (goal.includes('体态') || featurePreference.includes('纠偏')) {
    return '肩胛控制'
  }

  if (goal.includes('增肌')) {
    return '背部发力'
  }

  return '胸背协调'
}

export function OnboardingScreen() {
  const navigate = useNavigate()
  const { state, actions } = usePrototypeState()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<Record<QuestionKey, string>>({
    goal: state.onboardingProfile.goal,
    trainingPlace: state.onboardingProfile.trainingPlace,
    weeklyFrequency: state.onboardingProfile.weeklyFrequency,
    sessionDuration: state.onboardingProfile.sessionDuration,
    pushupLevel: state.onboardingProfile.pushupLevel,
    squatLevel: state.onboardingProfile.squatLevel,
    plankLevel: state.onboardingProfile.plankLevel,
    recoveryLevel: state.onboardingProfile.recoveryLevel,
    bodyStatus: state.onboardingProfile.bodyStatus,
    featurePreference: state.onboardingProfile.featurePreference,
  })

  const question = questions[step]
  const selected = form[question.key]
  const progress = ((step + 1) / questions.length) * 100

  const preferredWindow = useMemo(() => {
    if (form.weeklyFrequency.includes('5')) {
      return '晚间训练'
    }

    return '午间训练'
  }, [form.weeklyFrequency])

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep((current) => current + 1)
      return
    }

    const focusPreference = inferFocusPreference(form.goal, form.featurePreference)

    actions.saveOnboardingProfile({
      goal: form.goal,
      trainingPlace: form.trainingPlace,
      weeklyFrequency: form.weeklyFrequency,
      preferredWindow,
      sessionDuration: form.sessionDuration,
      equipmentPreference: '固定器械优先',
      focusPreference,
      experienceLevel: form.pushupLevel.includes('几乎') ? '训练新手' : '规律训练 3-12 个月',
      pushupLevel: form.pushupLevel,
      squatLevel: form.squatLevel,
      plankLevel: form.plankLevel,
      recoveryLevel: form.recoveryLevel,
      bodyStatus: form.bodyStatus,
      featurePreference: form.featurePreference,
    })
    navigate(routes.planLoading)
  }

  const Icon = question.icon

  return (
    <div className="flex min-h-[calc(100dvh-88px)] flex-col" data-screen="onboarding">
      <div className="sticky top-0 z-10 -mx-4 bg-[var(--surface-shell)] px-4 pb-4 pt-2">
        <div className="grid grid-cols-[44px_1fr_44px] items-center">
          <button
            aria-label="返回"
            className="flex size-11 items-center justify-center rounded-full text-[var(--accent-primary-ink)]"
            onClick={() => (step === 0 ? navigate(routes.login) : setStep((current) => current - 1))}
            type="button"
          >
            <ChevronLeft className="size-7" />
          </button>
          <h1 className="text-center text-[24px] font-semibold text-[var(--accent-primary-ink)]">AI 计划制定</h1>
          <div className="text-right text-[16px] font-semibold text-[var(--text-secondary)]">{step + 1}/10</div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-[#eceaf2]">
          <div className="h-full rounded-full bg-[var(--accent-primary-solid)] transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        className="flex-1 space-y-7 py-6"
        exit={{ opacity: 0, x: -18, filter: 'blur(2px)' }}
        initial={{ opacity: 0, x: 20, filter: 'blur(2px)' }}
        transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="space-y-3">
          <p className="text-[13px] font-bold uppercase tracking-[0.28em] text-[var(--accent-primary-ink)]">{question.eyebrow}</p>
          <h2 className="text-[34px] leading-[42px] font-semibold tracking-normal text-[var(--text-primary)]">{question.title}</h2>
          <p className="text-[18px] leading-[28px] font-semibold text-[var(--text-secondary)]">{question.subtitle}</p>
        </div>

        <div className="grid gap-4">
          {question.options.map((option) => {
            const active = selected === option.label

            return (
              <button
                className={`flex min-h-[92px] items-center gap-4 rounded-[24px] border px-5 py-4 text-left transition ${
                  active
                    ? 'border-[var(--accent-primary-solid)] bg-white shadow-[0_18px_45px_-34px_rgba(111,82,204,0.8)]'
                    : 'border-[var(--border-subtle)] bg-white/70'
                }`}
                key={option.label}
                onClick={() => setForm((current) => ({ ...current, [question.key]: option.label }))}
                type="button"
              >
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-[18px] ${active ? 'bg-[var(--accent-primary-solid)] text-white' : 'bg-white text-[var(--text-tertiary)] shadow-[var(--shadow-subtle)]'}`}>
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-[20px] font-semibold ${active ? 'text-[var(--accent-primary-ink)]' : 'text-[var(--text-primary)]'}`}>{option.label}</p>
                  <p className="mt-1 text-[14px] leading-[20px] font-medium text-[var(--text-secondary)]">{option.copy}</p>
                </div>
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-full border-2 ${active ? 'border-[var(--accent-primary-solid)] bg-[var(--accent-primary-solid)] text-white' : 'border-[#e7e4ec]'}`}>
                  {active ? <ChevronRight className="size-5" /> : null}
                </div>
              </button>
            )
          })}
        </div>

        <div className="rounded-[24px] border border-[var(--accent-primary-line)] bg-[var(--accent-primary-soft)] p-5">
          <div className="flex items-center gap-3">
            <Sparkles className="size-5 text-[var(--accent-primary-ink)]" />
            <p className="text-[18px] font-semibold text-[var(--accent-primary-ink)]">AI 智能分析</p>
          </div>
          <p className="mt-3 text-[15px] leading-[24px] font-medium text-[var(--text-secondary)]">{question.analysis}</p>
        </div>
      </motion.div>
      </AnimatePresence>

      <div className="sticky bottom-0 -mx-4 grid grid-cols-[92px_1fr] gap-4 bg-[linear-gradient(180deg,rgba(250,247,255,0),var(--surface-shell)_32%)] px-4 pb-4 pt-8">
        <Button className="min-h-[58px] rounded-[20px]" onClick={() => (step === 0 ? navigate(routes.login) : setStep((current) => current - 1))} type="button" variant="secondary">
          <ChevronLeft className="size-5" />
        </Button>
        <Button className="min-h-[58px] rounded-[20px] text-[18px]" disabled={!selected} onClick={handleNext} type="button">
          {step === questions.length - 1 ? '生成训练计划' : '下一步'}
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  )
}
