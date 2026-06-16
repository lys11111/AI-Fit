export const profileHighlights = [
  { title: '最近训练计划', copy: '背部塑形计划 · 连续 4 次完成', value: '4/5' },
  { title: '身体数据趋势', copy: '腰围下降 2.1cm，体重平稳下滑', value: '-2.4kg' },
  { title: '饮食执行率', copy: '训练日前后补蛋白稳定达标', value: '92%' },
] as const

export const settingsSections = [
  { kicker: 'ACCOUNT', title: '账户与资料', items: ['个人资料', '训练标签', '隐私与权限', '通知设置'] },
  { kicker: 'SUPPORT', title: '帮助与服务', items: ['帮助中心', '关于我们', '反馈问题', '推荐给好友'] },
] as const

export const helpTopics = [
  {
    title: '为什么训练计划会调整？',
    copy: '系统会根据你最近一次训练反馈、疲劳状态和器械可用性给出轻量调整建议。',
  },
  {
    title: '饮食识别结果可以改吗？',
    copy: '可以。识别确认页支持细调标签，最终写回的是你确认后的记录。',
  },
  {
    title: '社区会自动帮我匹配搭子吗？',
    copy: '会先按训练时间、训练目标和打卡稳定度给出轻社交推荐，不会直接打断主流程。',
  },
]

export const aboutStats = [
  { label: '产品版本', value: 'v0.3', hint: 'AI-FIT 体验版' },
  { label: '核心能力', value: '训练 · 饮食 · 社区', hint: '围绕日常健身闭环' },
  { label: '核心体验', value: 'AI 训练助手', hint: '计划、识别、纠偏与记录' },
]
