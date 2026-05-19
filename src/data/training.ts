export type PlanExercise = {
  name: string
  sets: number
  reps: string
  focus: string
}

export type TrainingAdjustment = {
  kicker: string
  title: string
  value: string
  copy: string
}

export const coachCards = [
  {
    title: '可能的问题',
    value: '肩胛控制不足',
    copy: '后半组更容易出现耸肩代偿，先稳住起始位置。',
  },
  {
    title: '今日重点',
    value: '回程速度',
    copy: '离心阶段控制 2 秒，会让背部发力更扎实。',
  },
  {
    title: '建议强度',
    value: 'RPE 7',
    copy: '今天不用冲极限，重点是技术质量和恢复感。',
  },
] as const

export const todayPlan = {
  title: '背部塑形 · 今日训练',
  summary: '优先处理固定器械训练中的肩胛控制和回程速度，让背部发力更完整。',
  match: '器械匹配 92%',
  exercises: [
    { name: '高位下拉', sets: 4, reps: '12 次', focus: '肩胛下沉' },
    { name: '坐姿划船', sets: 3, reps: '10 次', focus: '躯干稳定' },
    { name: '面拉', sets: 3, reps: '15 次', focus: '回程控制' },
  ] satisfies PlanExercise[],
} as const

export const completionStats = [
  { label: '完成动作', value: '3', hint: '动作闭环已完成' },
  { label: '训练组数', value: '9', hint: '和计划保持一致' },
  { label: '训练时长', value: '45 分钟', hint: '落在目标区间内' },
] as const

export const workoutSummary = {
  scores: [
    { name: '高位下拉', score: 88 },
    { name: '面拉', score: 86 },
    { name: '坐姿划船', score: 84 },
  ],
  best: '面拉的稳定性提升很明显，肩胛收缩更完整，动作路径也更接近目标。',
  improve: '坐姿划船后半程仍有些手臂代偿，下次建议降低一点重量，把回程速度再压稳。',
} as const

export const assessmentAdjustments: TrainingAdjustment[] = [
  {
    kicker: 'INTENSITY',
    title: '明日训练强度',
    value: '-15%',
    copy: '疲劳积累属于正常范围，明天继续保持中高质量，不追求额外负荷。',
  },
  {
    kicker: 'RECOVERY',
    title: '拉伸时长',
    value: '+5 分钟',
    copy: '肩颈与背阔肌的拉伸优先级上调，帮助你更稳进入下一次上肢训练。',
  },
  {
    kicker: 'ALTERNATIVE',
    title: '器械替代建议',
    value: '优先坐姿划船机',
    copy: '如果高峰时段拉力器拥挤，可以先切到坐姿划船机保持主线刺激。',
  },
]

export const workoutCues = ['肩胛先下沉再发力', '顶点停 1 秒确认背部收紧', '回程用 2 秒压住速度']

export const liveCorrectionTips = ['镜头保持正前 45 度', '现在注意别耸肩，肘部继续向后带', '最后两次回程再慢一点']

export const exerciseLearningCards = [
  {
    title: '起始姿势',
    copy: '坐稳后先把肩膀放低，胸骨轻轻抬起，别急着用手臂发力。',
  },
  {
    title: '发力顺序',
    copy: '先让肩胛下沉和后收，再让肘部沿身体两侧向下划。',
  },
  {
    title: '常见代偿',
    copy: '如果脖子变紧或下巴前探，通常说明重量偏大或者回程太快。',
  },
]
