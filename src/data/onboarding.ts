export type ChatMessage = {
  role: 'ai' | 'user'
  message: string
  meta: string
}

export type OnboardingSection = {
  kicker: string
  title: string
  answers: string[]
}

export const onboardingSections: OnboardingSection[] = [
  {
    kicker: 'SECTION 01',
    title: '身体基础',
    answers: ['27 岁', '172 cm', '68 kg', '体脂 19%', '肩颈容易紧张'],
  },
  {
    kicker: 'SECTION 02',
    title: '训练习惯',
    answers: ['减脂塑形', '每周 4 次', '偏晚间训练', '喜欢固定器械', '单次 45 分钟'],
  },
  {
    kicker: 'SECTION 03',
    title: '体能表现',
    answers: ['深蹲稳定', '平板支撑 70 秒', '俯卧撑 16 次', '恢复速度中等'],
  },
  {
    kicker: 'SECTION 04',
    title: '能力偏好',
    answers: ['AI 实时纠正', '器械匹配', '训练计划推荐', '饮食建议', '轻社区互动'],
  },
]

export const coachMessages: ChatMessage[] = [
  {
    role: 'ai',
    message: '根据你昨天反馈的疲劳感，我把今天背部训练强度下调了 15%，但发力质量训练会保留。',
    meta: '14:30',
  },
  {
    role: 'user',
    message: '可以，我今天更想把动作做稳一点。',
    meta: '14:31',
  },
  {
    role: 'ai',
    message: '那我们就先处理肩胛控制，再进入高位下拉和面拉的实时纠正。',
    meta: '14:32',
  },
]
