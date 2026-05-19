import type { ChatMessage } from './onboarding'

export type MacroTarget = {
  key: 'carb' | 'protein' | 'fat'
  label: string
  current: number
  goal: number
  tone: 'primary' | 'mint' | 'amber'
}

export type MealRecord = {
  name: string
  slot: string
  time: string
  kcal: number
  protein: number
}

export const nutritionTargets: MacroTarget[] = [
  { key: 'carb', label: '碳水', current: 145, goal: 320, tone: 'primary' },
  { key: 'protein', label: '蛋白质', current: 82, goal: 150, tone: 'mint' },
  { key: 'fat', label: '脂肪', current: 42, goal: 65, tone: 'amber' },
]

export const mealRecords: MealRecord[] = [
  { name: '蓝莓燕麦酸奶碗', slot: '早餐', time: '08:30', kcal: 320, protein: 24 },
  { name: '鸡胸藜麦蔬菜碗', slot: '午餐', time: '12:15', kcal: 540, protein: 38 },
]

export const nutritionMessages: ChatMessage[] = [
  {
    role: 'ai',
    message: '你今晚有背部训练，下午可以补一份轻碳水，晚餐保持高蛋白但不要太油。',
    meta: 'Nutri Aura · 12:10',
  },
  {
    role: 'user',
    message: '我中午吃了沙拉和鸡胸肉，训练前还要加餐吗？',
    meta: '12:12',
  },
  {
    role: 'ai',
    message: '训练前 90 分钟加半根香蕉或一片全麦吐司就够，不需要再来一顿完整正餐。',
    meta: '12:13',
  },
]

export const recognizedMeal = {
  name: '鸡胸藜麦蔬菜碗',
  slot: '午餐',
  calories: 540,
  protein: 38,
  carbs: 56,
  fat: 18,
  copy: '系统识别到了主食、优质蛋白与高纤维蔬菜，比较适合你今天的训练日结构。',
  fineTuneTags: ['加餐后补记', '份量偏大', '油脂更高', '拍摄角度一般'],
}
