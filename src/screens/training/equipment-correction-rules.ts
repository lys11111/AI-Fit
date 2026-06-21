import type { supportedGymMachines } from '@/prototype/plan'

export type SupportedEquipmentLabel = (typeof supportedGymMachines)[number]
export type CorrectionSeverity = 'info' | 'warning' | 'danger'

export type EquipmentCorrectionRule = {
  machine: SupportedEquipmentLabel
  displayName: string
  camera: {
    angle: string
    distance: string
    height: string
    framing: string
    prompt: string
  }
  stageModel: string[]
  primaryMetrics: string[]
  correctionItems: Array<{
    name: string
    cue: string
    severity: CorrectionSeverity
  }>
  liveCues: string[]
}

export const equipmentCorrectionRules = [
  {
    machine: 'Chest Press machine',
    displayName: '坐姿推胸',
    camera: {
      angle: '站在用户左前方或右前方约 45°',
      distance: '2.0-2.8 米',
      height: '镜头高度在胸口到肩部之间',
      framing: '头、肩、肘、腕、髋和手柄前后轨迹都要入框',
      prompt: '手机放在你前侧方 45°，距离约 2.5 米，让手柄完整出现在画面里。',
    },
    stageModel: ['前 3 次建立肘角、肩耳距离、躯干角和左右推举幅度基准', '第 4 次后检测耸肩、肘轨迹、弓背借力和左右不同步', '第 10 次后若弓背或耸肩明显加重，提示停止本组'],
    primaryMetrics: ['肘角', '肩-肘-腕推举轨迹', '耳肩距离', '躯干后仰角', '左右腕部位移差'],
    correctionItems: [
      { name: '耸肩推', cue: '肩膀下沉，不要用斜方肌顶重量。', severity: 'warning' },
      { name: '肘轨迹过高或过低', cue: '手肘略低于肩线，沿胸前斜向前推。', severity: 'warning' },
      { name: '弓背借力', cue: '背部贴住靠垫，减少腰部代偿。', severity: 'danger' },
      { name: '左右不同步', cue: '两侧同时推起，避免偏向单侧。', severity: 'warning' },
    ],
    liveCues: ['背部贴稳靠垫，手柄沿胸前斜向前推。', '若肩膀靠近耳朵或腰背离垫，先降低重量。'],
  },
  {
    machine: 'Lat Pull Down',
    displayName: '正握宽距高位下拉',
    camera: {
      angle: '站在用户左前方或右前方 30-45°',
      distance: '2.3-3.0 米',
      height: '镜头高度在胸口附近',
      framing: '头、肩、肘、腕、髋和手腕最高点到锁骨前方的轨迹都要入框',
      prompt: '手机放在你前侧方 45°，距离约 2.7 米，能看到手从最高点拉到锁骨前方。',
    },
    stageModel: ['前 3 次建立腕部下拉速度和耳肩距离基准', '第 4-9 次检测粘滞点和肩胛控制', '第 10 次后检测严重后仰和严重耸肩'],
    primaryMetrics: ['肘角 150° 到 65° 的循环', '躯干后仰角', '耳肩距离', '腕部 Y 轴速度'],
    correctionItems: [
      { name: '后仰借力', cue: '身体只允许轻微后倾，不要靠体重把杆拉下来。', severity: 'danger' },
      { name: '耸肩', cue: '先沉肩，再让肘部向下走。', severity: 'warning' },
      { name: '粘滞点', cue: '速度明显下降时保持动作形态，不要用腰甩。', severity: 'info' },
    ],
    liveCues: ['先沉肩，再把肘部向身体两侧下拉。', '杆拉到锁骨前方即可，身体不要大幅后仰。'],
  },
  {
    machine: 'Seated Cable Rows',
    displayName: '坐姿绳索划船',
    camera: {
      angle: '优先 45° 前侧方；遮挡严重时用 90° 侧面',
      distance: '2.2-3.0 米',
      height: '镜头高度在胸口附近',
      framing: '头、肩、肘、腕、髋和拉柄水平轨迹都要入框',
      prompt: '手机放在你前侧方 45° 或正侧面，距离约 2.5 米，能看到手柄水平拉向身体。',
    },
    stageModel: ['前 3 次建立速度、耳肩距、初始后仰和腋下角基准', '第 4 次后检测肘外展、耸肩和躯干晃动', '第 10 次后检测腰部甩动和动作结构崩溃'],
    primaryMetrics: ['3D 肘角', '3D 躯干后仰角', '耳肩距离', '腋下角', '腕部 X 轴速度', '肩部 Z 轴差'],
    correctionItems: [
      { name: '腰部甩动', cue: '躯干保持稳定，不要后仰甩重量。', severity: 'danger' },
      { name: '肘部外展', cue: '手肘贴近身体向后走。', severity: 'warning' },
      { name: '耸肩', cue: '肩膀下沉，肩胛向后收。', severity: 'warning' },
    ],
    liveCues: ['拉柄水平拉向腹部，手肘贴近身体。', '躯干稳定，避免用腰向后甩。'],
  },
  {
    machine: 'arm curl machine',
    displayName: '二头弯举机',
    camera: {
      angle: '90° 正侧面',
      distance: '1.8-2.4 米',
      height: '镜头高度在肘部到肩部之间',
      framing: '肩、肘、腕、髋和肘垫都要入框',
      prompt: '手机放在身体正侧面，距离约 2 米，让上臂和肘垫完整出现在画面里。',
    },
    stageModel: ['前 3 次建立肘角和肘点稳定基准', '第 4 次后检测肘离垫、肩前顶、后仰和半程动作', '第 10 次后检测明显甩动和失控回放'],
    primaryMetrics: ['肘角', '肘点漂移', '肩点漂移', '躯干角', '腕部弧线'],
    correctionItems: [
      { name: '肘离开肘垫', cue: '上臂固定在垫上，只让前臂弯起。', severity: 'warning' },
      { name: '肩膀前顶', cue: '不要用肩把重量抬起来。', severity: 'warning' },
      { name: '身体后仰借力', cue: '躯干保持稳定，降低重量。', severity: 'danger' },
      { name: '半程动作', cue: '放到底再弯起，保持完整行程。', severity: 'info' },
    ],
    liveCues: ['上臂压稳肘垫，前臂沿弧线弯起。', '如果肩膀或身体跟着动，重量偏大。'],
  },
  {
    machine: 'chest fly machine',
    displayName: '蝴蝶机夹胸',
    camera: {
      angle: '0° 正面，或 15-30° 前侧方',
      distance: '2.0-2.8 米',
      height: '镜头高度在胸口附近',
      framing: '双肩、双肘、双腕和胸前合拢路径都要入框',
      prompt: '手机放在正前方，距离约 2.5 米，能看到双臂从打开到合拢的全过程。',
    },
    stageModel: ['前 3 次建立肘角稳定性和双腕距离基准', '第 4 次后检测肘角变化、耸肩、过度后伸和左右不同步', '第 10 次后若肩前侧过度拉伸或耸肩明显，提示停止'],
    primaryMetrics: ['肩水平内收角', '双腕到中线距离', '肘角稳定性', '耳肩距离', '左右同步差'],
    correctionItems: [
      { name: '肘角变化过大', cue: '肘部角度保持稳定，不要把夹胸做成推胸。', severity: 'warning' },
      { name: '耸肩夹胸', cue: '肩膀下沉，胸部主动合拢。', severity: 'warning' },
      { name: '打开过深', cue: '不要过度拉伸肩前侧。', severity: 'danger' },
      { name: '左右不同步', cue: '双臂同时向身体中线合拢。', severity: 'warning' },
    ],
    liveCues: ['双臂向身体中线合拢，肘角保持稳定。', '打开时不要让肩前侧被过度拉伸。'],
  },
  {
    machine: 'chinning dipping',
    displayName: '引体双杠辅助',
    camera: {
      angle: '辅助引体用 0° 正面；辅助臂屈伸用 45-90° 侧面',
      distance: '2.8-3.8 米',
      height: '镜头高度在胸口附近',
      framing: '全身、肩、肘、腕、髋、膝和辅助踏板都要入框',
      prompt: '手机放在正前方约 3 米，确保全身和辅助踏板都在画面里。',
    },
    stageModel: ['前 3 次建立身体中线、肘角和垂直位移基准', '第 4 次后检测摆动、耸肩、肘外翻和踏板反弹', '第 10 次后若摆动或反弹明显，提示停止'],
    primaryMetrics: ['身体中线摆动', '肘角', '耳肩距离', '髋膝摆动', '垂直位移'],
    correctionItems: [
      { name: '身体摆动', cue: '身体保持垂直，不要甩腿。', severity: 'warning' },
      { name: '耸肩上拉', cue: '先沉肩，再向上拉。', severity: 'warning' },
      { name: '肘外翻', cue: '肘部沿身体两侧运动。', severity: 'warning' },
      { name: '踏板反弹借力', cue: '控制辅助踏板，不要弹起借力。', severity: 'danger' },
    ],
    liveCues: ['身体保持垂直，先沉肩再发力。', '不要用踏板反弹带动身体。'],
  },
  {
    machine: 'lateral raises machine',
    displayName: '侧平举机',
    camera: {
      angle: '0° 正面',
      distance: '1.8-2.5 米',
      height: '镜头高度在胸口到肩部之间',
      framing: '头、双肩、双肘、双腕和髋都要入框',
      prompt: '手机放在正前方约 2 米，能看到双肘抬到肩高附近。',
    },
    stageModel: ['前 3 次建立肩外展角、左右肘高度和耳肩距基准', '第 4 次后检测耸肩、侧倾、举太高和肘角异常', '第 10 次后若耸肩和侧倾明显，提示降低重量'],
    primaryMetrics: ['肩外展角', '左右肘高度差', '耳肩距离', '躯干侧倾', '肘角'],
    correctionItems: [
      { name: '耸肩', cue: '肩膀下沉，用肩中束发力。', severity: 'warning' },
      { name: '身体侧倾', cue: '身体保持直立，不要侧身借力。', severity: 'warning' },
      { name: '举得过高', cue: '抬到肩高附近即可。', severity: 'info' },
      { name: '肘太弯或锁死', cue: '肘部保持微屈且角度稳定。', severity: 'warning' },
    ],
    liveCues: ['肘部向两侧抬到肩高附近，肩膀不要耸起。', '身体保持直立，不要侧倾借力。'],
  },
  {
    machine: 'leg extension',
    displayName: '坐姿腿屈伸',
    camera: {
      angle: '90° 正侧面',
      distance: '2.0-2.6 米',
      height: '镜头高度对准膝关节',
      framing: '髋、膝、踝和坐垫边缘都要入框',
      prompt: '手机放在身体正侧面，距离约 2.3 米，镜头对准膝盖。',
    },
    stageModel: ['前 3 次建立膝角、髋点稳定和踝点弧线基准', '第 4 次后检测臀部离垫、踢腿惯性、行程不足和膝轴不对', '第 10 次后若离心失控，提示降低重量'],
    primaryMetrics: ['膝角', '髋点稳定性', '踝点轨迹', '左右膝踝差', '动作速度'],
    correctionItems: [
      { name: '臀部离垫', cue: '臀部贴住坐垫，不要用身体顶起重量。', severity: 'warning' },
      { name: '踢腿惯性', cue: '慢起慢放，不要猛踢。', severity: 'warning' },
      { name: '行程不足', cue: '完成全程，但不要暴力锁死膝盖。', severity: 'info' },
      { name: '膝轴不对', cue: '调整座椅，让膝盖对齐器械转轴。', severity: 'danger' },
    ],
    liveCues: ['膝关节对齐转轴，小腿向前上方伸展。', '慢起慢放，臀部不要离开坐垫。'],
  },
  {
    machine: 'leg press',
    displayName: '腿举机',
    camera: {
      angle: '45° 前侧方；重点看骨盆时用 90° 侧面',
      distance: '2.6-3.5 米',
      height: '镜头高度在膝到髋之间',
      framing: '髋、双膝、双踝和脚踏板完整入框',
      prompt: '手机放在前侧方 45°，距离约 3 米，能看到膝盖、脚踏板和髋部。',
    },
    stageModel: ['前 3 次建立膝角、髋角、膝踝方向和左右轨迹基准', '第 4 次后检测膝内扣、锁膝、骨盆卷曲和左右不均', '第 10 次后若腰背离垫或膝内扣明显，提示停止'],
    primaryMetrics: ['膝角', '髋角', '膝-踝方向一致性', '左右膝轨迹', '骨盆稳定'],
    correctionItems: [
      { name: '膝内扣', cue: '膝盖跟脚尖同向，不要向内夹。', severity: 'danger' },
      { name: '顶膝锁死', cue: '伸展末端不要猛锁膝。', severity: 'danger' },
      { name: '骨盆卷曲/腰离垫', cue: '减小下放深度，腰背贴住靠垫。', severity: 'danger' },
      { name: '左右发力不均', cue: '两侧膝盖同步伸展。', severity: 'warning' },
    ],
    liveCues: ['脚掌稳定蹬出，膝盖和脚尖方向一致。', '腰背贴住靠垫，不要在底部卷腰。'],
  },
  {
    machine: 'reg curl machine',
    displayName: '腿弯举机',
    camera: {
      angle: '90° 正侧面',
      distance: '2.0-2.6 米',
      height: '镜头高度对准膝关节',
      framing: '髋、膝、踝和大腿固定垫都要入框',
      prompt: '手机放在身体正侧面，距离约 2.3 米，能看到小腿向后弯曲的弧线。',
    },
    stageModel: ['前 3 次建立膝角、髋点稳定和踝点弧线基准', '第 4 次后检测髋部抬起、甩腿、半程和膝轴不对', '第 10 次后若髋部抬起明显，提示停止'],
    primaryMetrics: ['膝角', '髋点稳定', '踝点弧线', '躯干角'],
    correctionItems: [
      { name: '髋部抬起', cue: '髋部贴稳，不要拱腰。', severity: 'warning' },
      { name: '甩腿借惯性', cue: '慢慢弯曲和回放，不要甩动。', severity: 'warning' },
      { name: '半程动作', cue: '收缩和回放都要完整。', severity: 'info' },
      { name: '膝轴不对', cue: '调整座位，让膝盖对齐器械转轴。', severity: 'danger' },
    ],
    liveCues: ['膝关节为轴，小腿向后弯曲。', '髋部贴稳，避免拱腰和甩腿。'],
  },
  {
    machine: 'seated dip machine',
    displayName: '坐姿臂屈伸',
    camera: {
      angle: '45-90° 侧面',
      distance: '2.0-2.6 米',
      height: '镜头高度在肩肘之间',
      framing: '肩、肘、腕、髋和手柄都要入框',
      prompt: '手机放在身体侧前方或正侧面，距离约 2.3 米，能看到手柄向下压。',
    },
    stageModel: ['前 3 次建立肘角、肩耳距和躯干角基准', '第 4 次后检测耸肩下压、身体弹动、肘外翻和手腕塌陷', '第 10 次后若耸肩或弹动明显，提示降低重量'],
    primaryMetrics: ['肘角', '耳肩距离', '肩点垂直位移', '躯干角', '腕肘连线'],
    correctionItems: [
      { name: '耸肩下压', cue: '肩膀下沉后再下压。', severity: 'warning' },
      { name: '身体前后弹动', cue: '躯干保持稳定，不要用身体压。', severity: 'warning' },
      { name: '肘外翻', cue: '手肘沿身体两侧向下。', severity: 'warning' },
      { name: '手腕塌陷', cue: '手腕保持中立。', severity: 'info' },
    ],
    liveCues: ['肩膀下沉，手柄向下压到手臂接近伸直。', '不要耸肩或用身体弹动借力。'],
  },
  {
    machine: 'shoulder press machine',
    displayName: '肩推机',
    camera: {
      angle: '45° 前侧方',
      distance: '2.0-2.8 米',
      height: '镜头高度在胸口到肩部之间',
      framing: '头、肩、肘、腕、髋和顶部推举位置都要入框',
      prompt: '手机放在前侧方 45°，距离约 2.5 米，顶部推举位置不要出框。',
    },
    stageModel: ['前 3 次建立肘角、推举轨迹、耳肩距和躯干角基准', '第 4 次后检测反弓、耸肩、左右不同步和轨迹偏移', '第 10 次后若腰椎反弓明显，提示停止本组'],
    primaryMetrics: ['肘角', '肩推轨迹', '耳肩距离', '躯干后仰', '左右腕高度差'],
    correctionItems: [
      { name: '腰椎反弓/肋骨外翻', cue: '收紧核心，背部贴靠垫。', severity: 'danger' },
      { name: '耸肩推举', cue: '肩膀保持下沉，不要缩脖子推。', severity: 'warning' },
      { name: '左右不同步', cue: '两侧手柄同步上推。', severity: 'warning' },
      { name: '轨迹偏前或偏后', cue: '手柄沿肩上方推起。', severity: 'warning' },
    ],
    liveCues: ['收紧核心，手柄沿肩上方推起。', '背部贴住靠垫，不要反弓借力。'],
  },
  {
    machine: 'smith machine',
    displayName: '史密斯机',
    camera: {
      angle: '初代默认史密斯深蹲：90° 侧面；看膝内扣时用 0° 正面',
      distance: '2.8-3.8 米',
      height: '镜头高度在髋部附近',
      framing: '全身和杠铃固定轨迹都要完整入框',
      prompt: '初代先按史密斯深蹲拍摄：手机放在身体正侧面约 3 米，能看到全身和杠铃轨迹。',
    },
    stageModel: ['前 3 次建立髋角、膝角、躯干角和杠铃轨迹基准', '第 4 次后检测膝内扣、躯干塌陷、深度不足和路径异常', '第 10 次后若路径或躯干明显失控，提示停止'],
    primaryMetrics: ['髋角', '膝角', '踝膝髋连线', '躯干角', '杠铃垂直路径'],
    correctionItems: [
      { name: '膝内扣', cue: '膝盖跟脚尖同向。', severity: 'danger' },
      { name: '躯干塌陷', cue: '胸口保持打开，躯干不要突然前倾。', severity: 'danger' },
      { name: '深度不足或骨盆卷曲', cue: '控制深度，底部不要卷腰。', severity: 'warning' },
      { name: '杠铃路径异常', cue: '重新调整站位，让身体在杠铃正下方。', severity: 'warning' },
    ],
    liveCues: ['初代按史密斯深蹲纠偏：杠铃沿固定轨迹移动。', '膝盖跟脚尖同向，躯干保持稳定。'],
  },
] as const satisfies EquipmentCorrectionRule[]

export function findEquipmentCorrectionRule(label: string | null | undefined) {
  if (!label) {
    return null
  }

  return equipmentCorrectionRules.find((rule) => rule.machine === label || rule.displayName === label) ?? null
}