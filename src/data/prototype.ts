export const prototypeWalkthroughSteps = [
  '从欢迎页重置原型状态，再进入登录和问卷。',
  '改动目标、训练时间或器械偏好，确认计划预览和首页文案一起变化。',
  '走完一次训练反馈，看总结、次日建议和首页提醒是否引用了刚才的输入。',
  '记录一餐并返回首页，确认饮食写回已经在营养页和首页都可见。',
] as const

export const prototypeRouteAudit = [
  {
    title: '真闭环',
    badge: '会写回状态',
    copy: '这些页面会改动本地原型状态，适合反复测试主线是否真的走通。',
    items: ['训练主线：home -> training -> workout -> feedback -> summary -> assessment', '饮食记录：nutrition -> meal-capture -> meal-confirm -> write-back', '设置持久化：personal-info / training-preferences / privacy / notification-settings'],
  },
  {
    title: '辅助闭环',
    badge: '承接入口',
    copy: '这些页面不负责最终完成训练或饮食任务，但它们决定主线是否显得可信。',
    items: ['login -> onboarding -> plan-loading -> plan-preview', 'notifications 作为提醒与恢复入口', 'support-feedback / invite 作为原型反馈和演示尾声'],
  },
  {
    title: '展示页',
    badge: '不深写状态',
    copy: '这些页面目前用于解释能力边界或承接演示，不应伪装成已经完成的智能能力。',
    items: ['live-correction / exercise-learning 现在是辅助工具页', 'community / buddy-match / chat-draft 现在是轻社交展示页', 'help / about 负责解释原型范围、测试路径和当前阶段'],
  },
] as const
