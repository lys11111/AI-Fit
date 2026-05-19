# Prototype Route Audit

## 真闭环

这些页面会写回本地原型状态，适合反复验证“这条路真的能跑通”。

- `home -> training -> workout -> feedback -> summary -> assessment`
- `nutrition -> meal-capture -> meal-confirm -> write-back`
- `personal-info / training-preferences / privacy / notification-settings`

## 辅助闭环

这些页面负责承接入口、把计划说顺，决定主线是否显得可信，但它们不是最终完成训练任务的地方。

- `login -> onboarding -> plan-loading -> plan-preview`
- `notifications`
- `support-feedback / invite`

## 展示页

这些页面当前用于解释能力边界或承接演示，不应伪装成已经完成的深层能力。

- `live-correction / exercise-learning`
- `community / buddy-match / chat-draft`
- `help / about`

## 本轮迭代原则

1. 只继续补 `真闭环 + 辅助闭环`。
2. 展示页保留能看，但明确标注“不深写状态”。
3. 训练主线优先，饮食副线第二，设置页作为支撑层。
4. 保留明确的原型重置入口，支持连续多轮测试。
