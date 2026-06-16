export type PlanInput = {
  goal: string
  weeklyFrequency: string
  preferredWindow: string
  sessionDuration: string
  equipmentPreference: string
  focusPreference: string
  trainingTags: string[]
}

export type GeneratedPlan = {
  title: string
  summary: string
  match: string
  coachIntro: string
  nutritionNudge: string
  focusPreference: string
  rationale: Array<{ label: string; value: string }>
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

export function buildGeneratedPlan(input: PlanInput): GeneratedPlan {
  const score = scoreForPlan(input)
  const focus = input.focusPreference || '背部发力'
  const lead = goalLead(input.goal)
  const equipment = equipmentLead(input.equipmentPreference)

  return {
    title: `${focus} · ${lead}训练`,
    summary: `按 ${input.preferredWindow}、${input.sessionDuration} 和 ${input.equipmentPreference} 安排，今天优先稳住 ${focus}，把训练节奏压在可恢复的范围里。`,
    match: `${equipment} ${score}%`,
    coachIntro: `已按 ${input.goal} 和 ${focus} 重排今天主线，整节训练会尽量在 ${input.sessionDuration} 内完成。`,
    nutritionNudge: `${nutritionLead(input.goal)}，这样和今天的 ${input.preferredWindow} 训练更能接上。`,
    focusPreference: focus,
    rationale: [
      { label: '训练目标', value: input.goal },
      { label: '训练时间', value: `${input.preferredWindow} · ${input.sessionDuration}` },
      { label: '器械偏好', value: input.equipmentPreference },
      {
        label: '主线关注',
        value: input.trainingTags.length > 0 ? `${focus} · ${input.trainingTags.join(' · ')}` : focus,
      },
    ],
  }
}
