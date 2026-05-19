# AI-FIT Project Context

这份文档是给下一位接手开发的人看的。目标不是介绍全部细节，而是让人快速回答下面几个问题：

1. 这个原型现在到底做到哪了？
2. 哪些页面是真的，哪些页面只是展示？
3. 改一个功能时，应该先去哪里找代码？
4. 接下来最值得继续补的地方是什么？

## 1. 项目目标

AI-FIT 当前是一个移动端健身产品原型。它的重点不是后端接入，也不是完整 AI 能力，而是：

- 让训练主线形成完整闭环
- 让饮食记录形成一条稳定副线
- 让登录 / 问卷 / 计划预览成为可信入口
- 明确标出哪些页面仍然只是说明页或展示页

换句话说，这个项目现在更像“可测试的产品原型”，而不是“所有能力都做完的 App”。

## 2. 当前完成度

### 已经可反复测试的链路

#### 训练主线

`home -> training -> workout -> feedback -> summary -> assessment`

这条链路会真实写回本地状态：

- 训练反馈会保存到 `training.lastFeedback`
- 首页、总结页、次日建议页会引用这份反馈
- 问卷生成的 `plan` 会贯穿训练主线文案

#### 饮食副线

`nutrition -> meal-capture -> meal-confirm -> write-back`

这条链路会真实写回本地状态：

- 餐食确认后会更新 `nutrition.targets`
- 会追加一条 `mealRecords`
- 首页能看到“饮食已同步”的反馈状态

#### 设置持久化

这些页面会直接改动并保存本地状态：

- `personal-info`
- `training-preferences`
- `privacy`
- `notification-settings`

### 负责承接体验的辅助链路

`login -> onboarding -> plan-loading -> plan-preview`

这条链路的作用不是完成任务，而是把训练主线的上下文建立起来。问卷里的这些字段会直接影响后续页面：

- `goal`
- `weeklyFrequency`
- `preferredWindow`
- `sessionDuration`
- `equipmentPreference`
- `focusPreference`

### 当前仍属于展示页的部分

这些页面存在，但不要把它们理解成“已经做完”：

- `live-correction`
- `exercise-learning`
- `community`
- `buddy-match`
- `chat-draft`
- `help`
- `about`

这些页的任务是：

- 解释能力边界
- 承接演示
- 让产品方向可见

而不是承担复杂状态写回或真实业务逻辑。

## 3. 代码结构怎么找

### 路由与入口

- `src/main.tsx`
  - React 入口
  - 在这里挂载 `PrototypeStateProvider`
- `src/App.tsx`
  - 全部路由装配
- `src/app/routes.ts`
  - 所有 path 常量

如果要新增页面，通常会同时改这 3 个层级里的 1 到 2 处：

- 新建 screen 文件
- 在对应 `index.ts` 里导出
- 在 `src/App.tsx` 和 `src/app/routes.ts` 中挂路由

### 状态层

- `src/prototype/state.tsx`
  - 本项目最重要的状态文件
  - 原型所有“会写回”的行为几乎都在这里
  - 使用 localStorage，key 是 `aifit-prototype-state-v1`
- `src/prototype/plan.ts`
  - 根据问卷输入生成当前训练计划快照

如果某个页面改动应该影响后续页面，优先判断是不是该进 `PrototypeState`。

### 页面层

页面按业务域拆在 `src/screens/`：

- `auth/`
- `entry/`
- `home/`
- `onboarding/`
- `training/`
- `nutrition/`
- `notifications/`
- `community/`
- `profile/`

每个目录里通常有：

- 页面组件
- 一个 `index.ts` 导出入口

### 页面原语和基础 UI

- `src/components/app/`
  - 页面级原语
  - 比如 `Screen`、`PageHeader`、`GroupedSection`、`InsetRow`、`MetricCard`
- `src/components/ui/`
  - 更底层、通用的 UI 组件

经验上：

- 页面骨架优先复用 `components/app`
- 基础控件优先复用 `components/ui`
- 不建议在 screen 内部直接复制大段样式去造新壳

### 数据与文案

- `src/data/`
  - 原型静态数据
  - 页面用的 mock 文案
  - 训练、饮食、通知、社区、问卷等假数据

如果只是调整原型文案或静态列表，通常先看这里。

## 4. 状态模型概览

`PrototypeState` 目前主要包含这些域：

- `auth`
- `notifications`
- `onboardingProfile`
- `profileSettings`
- `plan`
- `nutrition`
- `training`
- `support`

可以把它理解成：

- `onboardingProfile`：入口问卷结果
- `plan`：由问卷生成的训练计划快照
- `training`：训练反馈结果
- `nutrition`：饮食目标和写回记录
- `profileSettings`：个人设置与偏好

### 关键动作

状态层里值得先认识的 action：

- `requestAuthCode`
- `saveOnboardingProfile`
- `saveMealRecognition`
- `saveTrainingFeedback`
- `updatePersonalInfo`
- `updateTrainingPreferences`
- `updatePrivacy`
- `updateNotificationSettings`
- `submitSupportFeedback`
- `sendInvite`
- `resetPrototypeState`

`resetPrototypeState` 很重要，因为现在测试主流程时经常需要回到初始状态。

## 5. 设计和页面层级约束

先看：

- `docs/design-tokens.md`
- `src/lib/design-system.ts`
- `src/index.css`

当前 UI 不是随意拼的，已经有一套约束：

- 每页首屏最多一个最重的视觉重点
- 指标有 `feature / compact / inline` 分级
- 页面尽量用 grouped section，而不是每段都做成厚重卡片
- 不鼓励在 screen 里散写大量原始间距、字号、圆角值

如果要改视觉，优先动 token / role map，而不是直接在页面里一把梭。

## 6. 测试现状

当前已有：

- Playwright E2E
- 关键页面截图基线

测试文件：

- `tests/app.spec.ts`

当前测试覆盖重点：

- 登录验证码状态
- 问卷如何影响计划预览和首页
- 通知读/清空/恢复
- 饮食识别写回
- 训练反馈写回
- 个人信息持久化
- welcome 页 reset

本地常用命令：

```bash
npm run lint
npm run build
npm run test:e2e
```

更新截图基线：

```bash
npm run test:e2e:update
```

## 7. 当前文档关系

建议这样理解几个文档：

- `README.md`
  - 给第一次进入仓库的人看
- `docs/project-context.md`
  - 给接手继续开发的人看
- `docs/prototype-route-audit.md`
  - 说明哪些链路是真闭环 / 辅助闭环 / 展示页
- `docs/design-tokens.md`
  - 说明设计系统和页面层级规则

## 8. 当前已知问题 / 可继续整理点

### 优先级高

- 当前构建可通过，但主 bundle 偏大，Vite 会给 chunk size warning。
- 一些页面仍然以展示说明为主，后续如果要做深，应该先明确它们是否升级为真闭环。

### 优先级中

- `src/mockData.ts` 很像早期遗留文件，建议确认是否还能删。
- `src/assets/react.svg`、`src/assets/vite.svg` 也像模板遗留。
- `src/data/prototype.ts` 和 `docs/prototype-route-audit.md` 在“原型分层说明”上有轻微重复，后续可考虑统一来源。

### 优先级低

- README 之外还可以补一份更偏产品视角的 walkthrough，方便非开发同伴 review。

## 9. 推荐接手顺序

如果你是下一位开发者，建议按这个顺序理解项目：

1. 先读 `README.md`
2. 再读 `docs/project-context.md`
3. 看 `docs/prototype-route-audit.md`
4. 打开 `src/prototype/state.tsx`
5. 看 `src/App.tsx` 和 `src/app/routes.ts`
6. 跑一次 `npm run test:e2e`
7. 按欢迎页的 walkthrough 手工走一遍主链路

## 10. 推荐下一步开发方向

最值得继续做的，依次是：

1. 继续补“真闭环”，不要优先扩展示意页。
2. 让训练主线的状态反馈更具体，比如更细的 session 结果和历史趋势。
3. 把饮食副线再补一层，例如多餐记录、撤销、重复写回保护。
4. 统一展示页的话术和视觉标识，避免被误解为已完成能力。
5. 清理模板遗留文件，减少仓库噪音。
