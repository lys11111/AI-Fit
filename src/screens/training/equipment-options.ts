import type { supportedGymMachines } from '@/prototype/plan'

export const equipmentOptions = [
  { machine: 'Chest Press machine', name: '坐姿推胸', focus: '胸部推力', tone: 'primary', line: 'M 28 62 C 42 50, 60 45, 78 42', cue: '手肘沿胸前斜向前推，肩胛保持稳定。' },
  { machine: 'Lat Pull Down', name: '正握宽距高位下拉', focus: '背部下拉', tone: 'indigo', line: 'M 50 16 C 50 30, 46 48, 38 70', cue: '从上向下拉到锁骨前方，先沉肩再发力。' },
  { machine: 'Seated Cable Rows', name: '坐姿绳索划船', focus: '背部水平拉', tone: 'indigo', line: 'M 78 48 C 60 48, 44 49, 24 52', cue: '拉力线保持水平，手肘贴近身体向后。' },
  { machine: 'arm curl machine', name: '二头弯举机', focus: '手臂弯举', tone: 'amber', line: 'M 38 72 C 42 58, 50 46, 60 34', cue: '上臂固定，前臂沿弧线向上弯举。' },
  { machine: 'chest fly machine', name: '蝴蝶机夹胸', focus: '胸部收缩', tone: 'primary', line: 'M 18 48 C 34 58, 48 60, 82 48', cue: '双臂向身体中线合拢，胸部主动收缩。' },
  { machine: 'chinning dipping', name: '引体双杠辅助', focus: '背部与推力辅助', tone: 'mint', line: 'M 50 82 C 50 66, 50 42, 50 20', cue: '身体保持垂直，沿竖直方向完成上拉或下压。' },
  { machine: 'lateral raises machine', name: '侧平举机', focus: '肩中束', tone: 'amber', line: 'M 26 66 C 38 48, 50 42, 74 66', cue: '手臂向两侧抬起，不要耸肩借力。' },
  { machine: 'leg extension', name: '坐姿腿屈伸', focus: '股四头肌', tone: 'mint', line: 'M 42 72 C 52 62, 62 54, 74 42', cue: '膝关节为轴，小腿向前上方伸展。' },
  { machine: 'leg press', name: '腿举机', focus: '下肢推力', tone: 'mint', line: 'M 30 72 C 44 58, 58 45, 76 30', cue: '脚掌稳定蹬出，膝盖和脚尖方向一致。' },
  { machine: 'reg curl machine', name: '腿弯举机', focus: '腘绳肌', tone: 'mint', line: 'M 72 36 C 60 50, 48 60, 34 72', cue: '小腿向后下方弯曲，避免臀部离开坐垫。' },
  { machine: 'seated dip machine', name: '坐姿臂屈伸', focus: '三头肌推力', tone: 'amber', line: 'M 50 28 C 50 44, 50 58, 50 76', cue: '向下推到手臂伸直前，保持肩部下沉。' },
  { machine: 'shoulder press machine', name: '肩推机', focus: '肩部推举', tone: 'amber', line: 'M 38 72 C 42 54, 50 38, 60 20', cue: '手柄沿肩上方推起，肋骨不要外翻。' },
  { machine: 'smith machine', name: '史密斯机', focus: '稳定复合动作', tone: 'primary', line: 'M 50 16 C 50 34, 50 56, 50 82', cue: '杠铃沿固定轨迹移动，身体中线保持稳定。' },
] as const satisfies Array<{
  machine: (typeof supportedGymMachines)[number]
  name: string
  focus: string
  tone: 'primary' | 'mint' | 'amber' | 'indigo'
  line: string
  cue: string
}>

export function findEquipmentOption(label: string | null | undefined) {
  if (!label) {
    return null
  }

  return equipmentOptions.find((option) => option.machine === label || option.name === label) ?? null
}
