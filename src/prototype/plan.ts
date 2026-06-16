export type PlanInput = {
  goal: string
  weeklyFrequency: string
  preferredWindow: string
  sessionDuration: string
  equipmentPreference: string
  focusPreference: string
  trainingTags: string[]
  trainingPlace?: string
  experienceLevel?: string
  pushupLevel?: string
  squatLevel?: string
  plankLevel?: string
  recoveryLevel?: string
  bodyStatus?: string
  featurePreference?: string
}

export type GeneratedExercise = {
  name: string
  machineClass: string
  sets: number
  reps: string
  focus: string
}

export type GeneratedPlan = {
  title: string
  summary: string
  match: string
  coachIntro: string
  nutritionNudge: string
  focusPreference: string
  exercises: GeneratedExercise[]
  rationale: Array<{ label: string; value: string }>
}

export const supportedGymMachines = [
  'Chest Press machine',
  'Lat Pull Down',
  'Seated Cable Rows',
  'arm curl machine',
  'chest fly machine',
  'chinning dipping',
  'lateral raises machine',
  'leg extension',
  'leg press',
  'reg curl machine',
  'seated dip machine',
  'shoulder press machine',
  'smith machine',
] as const

const machineExerciseMap: Record<string, GeneratedExercise[]> = {
  chest: [
    { name: '坐姿推胸', machineClass: 'Chest Press machine', sets: 4, reps: '10-12 次', focus: '胸部发力路径' },
    { name: '蝴蝶机夹胸', machineClass: 'chest fly machine', sets: 3, reps: '12-15 次', focus: '顶峰收缩' },
    { name: '史密斯上斜推举', machineClass: 'smith machine', sets: 3, reps: '8-10 次', focus: '稳定推举' },
  ],
  back: [
    { name: '正握宽距高位下拉', machineClass: 'Lat Pull Down', sets: 4, reps: '10-12 次', focus: '肩胛下沉' },
    { name: '坐姿绳索划船', machineClass: 'Seated Cable Rows', sets: 3, reps: '10-12 次', focus: '躯干稳定' },
    { name: '引体辅助训练', machineClass: 'chinning dipping', sets: 3, reps: '8-10 次', focus: '背阔肌启动' },
  ],
  shoulder: [
    { name: '肩推机', machineClass: 'shoulder press machine', sets: 4, reps: '8-10 次', focus: '肩部推举稳定' },
    { name: '侧平举机', machineClass: 'lateral raises machine', sets: 3, reps: '12-15 次', focus: '中束控制' },
    { name: '坐姿臂屈伸', machineClass: 'seated dip machine', sets: 3, reps: '10-12 次', focus: '推力辅助' },
  ],
  leg: [
    { name: '腿举机', machineClass: 'leg press', sets: 4, reps: '10-12 次', focus: '膝髋同步' },
    { name: '腿屈伸', machineClass: 'leg extension', sets: 3, reps: '12-15 次', focus: '股四头肌控制' },
    { name: '腿弯举', machineClass: 'reg curl machine', sets: 3, reps: '12 次', focus: '腘绳肌收缩' },
  ],
  beginner: [
    { name: '坐姿推胸', machineClass: 'Chest Press machine', sets: 3, reps: '10 次', focus: '基础推力' },
    { name: '高位下拉', machineClass: 'Lat Pull Down', sets: 3, reps: '10 次', focus: '背部启动' },
    { name: '腿举机', machineClass: 'leg press', sets: 3, reps: '12 次', focus: '下肢稳定' },
  ],
}

function scoreForPlan(input: PlanInput) {
  const windowScore = input.preferredWindow.includes('晚') ? 2 : input.preferredWindow.includes('午') ? 1 : 0
  const equipmentScore = input.equipmentPreference.includes('器械') ? 2 : input.equipmentPreference.includes('哑铃') ? 1 : 0
  const frequencyScore = /\d/.test(input.weeklyFrequency) ? Number(input.weeklyFrequency.match(/\d/)?.[0] ?? 4) - 3 : 1

  return Math.max(86, Math.min(96, 88 + windowScore + equipmentScore + frequencyScore))
}

function goalLead(goal: string) {
  if (goal.includes('增肌')) {
    return '增肌推进'
  }

  if (goal.includes('维持')) {
    return '状态维持'
  }

  return '减脂塑形'
}

function equipmentLead(equipmentPreference: string) {
  if (equipmentPreference.includes('器械')) {
    return '器械匹配'
  }

  if (equipmentPreference.includes('哑铃')) {
    return '哑铃匹配'
  }

  return '场景匹配'
}

function nutritionLead(goal: string) {
  if (goal.includes('增肌')) {
    return '训练前后都补一份高蛋白主食'
  }

  if (goal.includes('维持')) {
    return '把训练前后的补给控制在稳定、好执行的区间'
  }

  return '训练前补一点轻碳水，晚餐继续把蛋白补齐'
}

function selectTrainingTheme(input: PlanInput) {
  const focusText = `${input.focusPreference} ${input.featurePreference ?? ''} ${input.goal}`.toLowerCase()

  if (focusText.includes('腿') || focusText.includes('下肢') || focusText.includes('深蹲')) {
    return 'leg'
  }

  if (focusText.includes('肩') || focusText.includes('上肢塑形')) {
    return 'shoulder'
  }

  if (focusText.includes('胸') || focusText.includes('推')) {
    return 'chest'
  }

  if (input.experienceLevel?.includes('新手')) {
    return 'beginner'
  }

  return 'back'
}

export function buildGeneratedPlan(input: PlanInput): GeneratedPlan {
  const score = scoreForPlan(input)
  const focus = input.focusPreference || '背部发力'
  const lead = goalLead(input.goal)
  const equipment = equipmentLead(input.equipmentPreference)
  const theme = selectTrainingTheme(input)
  const exercises = machineExerciseMap[theme]

  return {
    title: `${focus} · ${lead}训练`,
    summary: `按 ${input.preferredWindow}、${input.sessionDuration} 和 ${input.equipmentPreference} 安排，今天优先稳住 ${focus}。计划动作会限定在当前视觉模型可识别的固定器械范围内。`,
    match: `${equipment} ${score}%`,
    coachIntro: `已按 ${input.goal} 和 ${focus} 重排今天主线，整节训练会尽量在 ${input.sessionDuration} 内完成。`,
    nutritionNudge: `${nutritionLead(input.goal)}，这样和今天的 ${input.preferredWindow} 训练更能接上。`,
    focusPreference: focus,
    exercises,
    rationale: [
      { label: '训练目标', value: input.goal },
      { label: '训练地点', value: input.trainingPlace ?? '健身房固定器械区' },
      { label: '训练时间', value: `${input.preferredWindow} · ${input.sessionDuration}` },
      { label: '器械偏好', value: input.equipmentPreference },
      { label: '训练基础', value: input.experienceLevel ?? '需要先从稳定动作开始' },
      { label: '恢复状态', value: input.recoveryLevel ?? '中等恢复速度' },
      {
        label: '主线关注',
        value: input.trainingTags.length > 0 ? `${focus} · ${input.trainingTags.join(' · ')}` : focus,
      },
      {
        label: '视觉识别覆盖',
        value: exercises.map((exercise) => exercise.machineClass).join(' · '),
      },
    ],
  }
}
