# AI-FIT Mobile Prototype

AI-FIT 是一个移动端训练原型项目，当前重点不是“把所有页面铺满”，而是把几条关键体验链路做成可反复验证的闭环。

这个仓库已经完成了：

- 登录 -> 问卷 -> 计划预览 -> 首页的承接链路
- 训练主线：`home -> training -> workout -> feedback -> summary -> assessment`
- 饮食副线：`nutrition -> meal-capture -> meal-confirm -> write-back`
- 个人资料、训练偏好、隐私、通知设置的本地持久化
- Playwright 截图与状态流测试

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- Radix UI primitives
- Playwright

## 快速开始

```bash
npm install
npm run dev
```

常用命令：

```bash
npm run build
npm run lint
npm run test:e2e
npm run test:e2e:update
```

如果在 Windows PowerShell 里直接执行 `npm` 被执行策略拦住，可改用：

```bash
npm.cmd run build
```

## 当前目录结构

```text
.
|-- docs/                    # 设计规范、路由审计、交接文档
|-- public/                  # 静态资源
|-- src/
|   |-- app/                 # 路由常量
|   |-- components/
|   |   |-- app/             # 页面级通用原语和壳层
|   |   `-- ui/              # 基础 UI 组件
|   |-- data/                # 原型数据、页面文案、假数据源
|   |-- prototype/           # 原型状态与计划生成逻辑
|   |-- screens/             # 按业务域分组的页面
|   |-- lib/                 # design system 映射与工具函数
|   |-- App.tsx              # 应用路由装配
|   `-- main.tsx             # 应用入口，挂载 PrototypeStateProvider
|-- tests/                   # Playwright E2E 与截图基线
|-- AGENTS.md                # 面向协作代理/自动化的约束说明
`-- package.json             # 脚本与依赖
```

## 核心代码入口

- 路由表：`src/app/routes.ts`
- 应用壳：`src/App.tsx`
- 原型状态：`src/prototype/state.tsx`
- 计划生成：`src/prototype/plan.ts`
- 页面原语：`src/components/app/primitives.tsx`
- 设计映射：`src/lib/design-system.ts`
- 全局样式与 token：`src/index.css`

## 建议先读的文档

- [项目交接上下文](./docs/project-context.md)
- [原型路由审计](./docs/prototype-route-audit.md)
- [设计 token 与页面层级规则](./docs/design-tokens.md)

## 当前产品分层

### 真闭环

这些页面会真实写回本地状态，适合优先继续开发：

- 训练主线
- 饮食记录
- 设置持久化

### 辅助闭环

这些页面负责把故事讲顺、把主线接起来：

- 登录
- 问卷
- 计划 loading / preview
- 通知
- 支持反馈 / 邀请

### 展示页

这些页面当前主要用于说明能力边界，不应被误判为“已经做完的深层能力”：

- 实时动作纠正
- 动作学习
- 社区 / 搭子 / 私聊草稿
- Help / About

## 测试说明

Playwright 测试除了截图，还覆盖了这些关键状态流：

- 验证码请求与持久化
- 问卷输入影响计划与首页
- 训练反馈写回总结、次日建议和首页
- 饮食识别写回营养状态和首页
- welcome 页重置原型状态

## 当前已知事项

- 构建可通过，但 Vite 会提示主包体积偏大，后续可以考虑代码拆分。
- `src/mockData.ts`、`src/assets/react.svg`、`src/assets/vite.svg` 看起来像早期模板遗留，暂未参与主流程。
- `dist/`、`node_modules/`、`test-results/` 都是本地生成产物，不需要提交。

## 协作建议

如果是继续迭代，建议优先遵守这几个原则：

1. 新功能先判断属于真闭环、辅助闭环还是展示页。
2. 会影响体验连续性的状态，优先接入 `src/prototype/state.tsx`。
3. 页面结构尽量复用 `src/components/app/primitives.tsx`，不要在 screen 里重新发明一套版式。
4. 修改体验链路后，同步更新 Playwright 用例和相关文档。
