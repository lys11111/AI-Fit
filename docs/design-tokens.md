# AI-FIT Design Tokens

## 设计目标

AI-FIT 的 token 体系服务于一个明确方向：让整个产品更像 iPhone 上真实、克制、轻量的健身工具，而不是平均用力的卡片拼盘。

这份文档是仓库内唯一的人类可读规范锚点。后续所有用户可见 UI 变更，都先对照这里，再落到代码中的 `src/lib/design-system.ts` 与 `src/index.css`。

## 参考体系

- Apple Human Interface Guidelines：参考 iPhone 产品中的层级、留白和分组列表感
- Atlassian Design Tokens：参考 semantic token 作为 single source of truth 的组织方式
- Shopify Polaris：参考 typography token 和 color token 的分层
- Radix Colors：参考颜色角色和 CSS variable 的直接消费方式
- DTCG Format：参考未来可迁移到结构化 token 文件的命名方式

## Token 分层原则

AI-FIT 采用三层 token 结构：

1. **Primitive Tokens**
   - 原始颜色、字号、行高、字重、间距、圆角、阴影、动画时长、缓动
   - 不直接在页面中消费
2. **Semantic Tokens**
   - `text.*`、`surface.*`、`border.*`、`accent.*`、`state.*`、`icon.*`
   - 用于表达“这个值是干什么的”
3. **Component / Pattern Tokens**
   - `pageHeader.*`、`heroPanel.*`、`groupedSection.*`、`metric.*`、`actionRow.*`、`bottomNav.*`
   - 用于解决页面结构和视觉重量问题

规则：

- 主题值放在 CSS variables
- role / variant / pattern 放在 `src/lib/design-system.ts`
- 页面组件不得继续直接写死大多数字号、padding、radius、shadow、surface 组合

## Primitive Tokens

### Typography primitives

| Token | Value | 用途 |
| --- | --- | --- |
| `font.family.base` | `Inter, SF Pro Display, PingFang SC, Microsoft YaHei, system-ui, sans-serif` | 全局基础字体 |
| `font.weight.regular` | `400` | 正文 |
| `font.weight.medium` | `500` | 辅助强调 |
| `font.weight.semibold` | `600` | 标题与关键数值 |

### Spacing primitives

| Token | Value | 用途 |
| --- | --- | --- |
| `space.4` | `4px` | 内部微距 |
| `space.8` | `8px` | chip / 图标与文字 |
| `space.12` | `12px` | 小块间距 |
| `space.16` | `16px` | row padding |
| `space.20` | `20px` | section padding |
| `space.24` | `24px` | hero / panel padding |
| `space.32` | `32px` | shell radius / 大块留白 |

### Radius primitives

| Token | Value | 用途 | 禁止误用 |
| --- | --- | --- | --- |
| `radius.shell` | `32px` | 手机外壳与大容器 | 不用于普通 row |
| `radius.hero` | `24px` | 首屏重点面板 | 不用于列表项 |
| `radius.section` | `20px` | section 容器 | 不用于 chip |
| `radius.row` | `16px` | grouped row / inset row | 不用于 hero |
| `radius.pill` | `999px` | badge / chip | 不用于大卡片 |

### Shadow primitives

| Token | Value | 用途 |
| --- | --- | --- |
| `shadow.none` | `none` | 平铺分组区 |
| `shadow.subtle` | `0 20px 40px -32px rgba(20, 30, 26, 0.22)` | 默认 section |
| `shadow.raised` | `0 24px 42px -30px rgba(20, 103, 91, 0.22)` | 主行动按钮、强调面板 |
| `shadow.shell` | `0 40px 80px -44px rgba(20, 30, 26, 0.34)` | 设备壳 |

### Motion primitives

| Token | Value | 用途 |
| --- | --- | --- |
| `motion.duration.fast` | `160ms` | 轻反馈 |
| `motion.duration.standard` | `220ms` | hover / active |
| `motion.duration.entrance` | `280ms` | 页面与面板进入 |
| `motion.easing.standard` | `cubic-bezier(0.22, 1, 0.36, 1)` | 全产品统一缓动 |

## Semantic Tokens

### Text

| Token | Value | 用途 | 禁止误用 |
| --- | --- | --- | --- |
| `text.display` | `32 / 38 / 600` | welcome hero 主标题 | 不能用于普通页面 |
| `text.pageTitlePrimary` | `28 / 32 / 600` | `home`、`training` 一级标题 | 不用于 card title |
| `text.pageTitleSecondary` | `24 / 29 / 600` | `nutrition`、`profile`、`community` 等页面标题 | 不用于 hero |
| `text.pageTitleCompact` | `22 / 27 / 600` | detail / task flow 页标题 | 不用于首屏大标题 |
| `text.sectionTitle` | `18 / 24 / 600` | section 标题 | 不与页面标题同级竞争 |
| `text.cardTitle` | `16 / 22 / 600` | row / card 核心标题 | 不用于主标题 |
| `text.body` | `14 / 21 / 400` | 正文说明 | 不用于 meta |
| `text.meta` | `11 / 16 / 600` | kicker / 时间 / 标签眉线 | 不用于段落正文 |
| `text.buttonLabel` | `14 / 20 / 600` | 按钮与 row label | 不用于正文段落 |
| `text.numericEmphasis` | `26 / 28 / 600` | 核心统计数字 | 不用于长文本 |

### Surface

| Token | 用途 | 禁止误用 |
| --- | --- | --- |
| `surface.canvas` | 页面总背景 | 不用于卡片内部 |
| `surface.shell` | 设备壳 | 不用于列表项 |
| `surface.default` | 默认容器背景 | 不作为页面大背景 |
| `surface.subtle` | grouped row / 次级块 | 不作为唯一 hero 背景 |
| `surface.raised` | 强调块 / 次级白面板 | 不大量重复堆叠 |
| `surface.accentSoft` | 轻强调染色底 | 不覆盖大面积内容区 |

### Border

| Token | 用途 |
| --- | --- |
| `border.subtle` | 默认分隔 |
| `border.strong` | 主块边界 |
| `border.selected` | 激活 / 选中状态 |
| `border.focus` | 键盘焦点与交互 ring |

### Accent

| Token | 用途 |
| --- | --- |
| `accent.primary.*` | 主品牌与训练主线 |
| `accent.mint.*` | 积极反馈、完成度、营养进展 |
| `accent.amber.*` | 饮食、提醒、注意项 |
| `accent.indigo.*` | 社区、学习、辅助工具 |

### State

| Token | 用途 |
| --- | --- |
| `state.hover` | 轻 hover / row hover |
| `state.pressed` | 点击下压状态 |
| `state.selected` | 当前 tab / 选中块 |
| `state.disabled` | 不可用状态 |

## Component / Pattern Tokens

### `pageHeader.*`

- `pageHeader.primary`
  - 用于 `home`、`training`
  - 标题使用 `text.pageTitlePrimary`
  - 描述允许一行半到两行
- `pageHeader.secondary`
  - 用于 `nutrition`、`profile`、`community` 等
  - 标题使用 `text.pageTitleSecondary`
- `pageHeader.compact`
  - 用于 `meal-confirm`、`workout-session`、`set-feedback` 等任务流页
  - 标题使用 `text.pageTitleCompact`

### `heroPanel.default`

- 用于每页首屏唯一重块
- 使用 `surface.raised + border.strong + shadow.raised + radius.hero`
- 同一首屏不得出现第二个同等级面板

### `groupedSection.default`

- 用于默认 section 容器
- 使用 `surface.default + border.subtle + shadow.subtle + radius.section`
- section 内部优先容纳 inset rows，而不是再嵌完整 card

### `groupedSection.inset`

- 用于更加轻量的分组
- 使用 `surface.subtle + border.subtle + shadow.none`
- 适合说明、状态提示、细小表单区

### `metric.feature`

- 用于每页最重要指标
- 大数字、明确标签、允许独占一行或更宽跨度
- 同一屏首段不超过 1 个

### `metric.compact`

- 用于辅助指标
- 可以成组出现
- 不允许和 `metric.feature` 视觉等重

### `metric.inline`

- 用于 detail flow 或轻统计
- 表现为一行或小块，不做大数字主角

### `actionRow.default`

- 标准操作入口
- 使用 `surface.default` 或 `surface.raised`
- 视觉上比 hero 轻，比纯文本列表重

### `actionRow.emphasized`

- 用于单页最重要 CTA 入口
- 允许 accent soft 底色和更强 icon tone
- 同一区域内不超过 1 个

### `bottomNav.default`

- 底部导航使用轻模糊 + 白色高透底
- 当前项使用 `state.selected` + `accent.primary.soft`
- 导航本身不应抢走首屏主块的注意力

## 页面层级规则

- 每页首屏最多一个强强调块
- 指标区不能默认三等分等重，优先采用：
  - `1 个 feature + 2 个 compact`
  - `1 个 feature + 1 组 inline`
- 二级内容优先 grouped section
- 三级内容优先 inset row、chip、meta、辅助说明
- 不允许把每个 section 都做成一样厚、一样宽、一样有阴影的大卡片

## 组件消费规则

- `src/index.css` 存 light theme token 值
- `src/lib/design-system.ts` 存 role、variant、pattern 映射
- `src/components/app/primitives.tsx` 只消费 token role，不再写死视觉数值
- 页面只通过组件 prop 和 role map 取值，不直接复制黏贴样式常量

## 迁移规则

1. 先改 token
2. 再改共享原语
3. 再迁移页面
4. 再更新截图基线

迁移时优先处理：

1. `home`、`training`、`nutrition`、`profile`
2. `welcome`、`plan-preview`、`community`、`workout-summary`
3. `meal-confirm`、`meal-capture`、`workout-session`、`live-correction`、`set-feedback` 等任务流页面

## 验收标准

- 每页首屏存在唯一第一重点
- 不再出现无差别 3 等分重卡片
- 全产品标题、section、正文、meta 层级一致
- grouped list 与强调面板差异明显
- 手机截图中无文字裁切、按钮跳动、首屏主次失衡
- `npm run build`、`npm run lint`、`npm run test:e2e` 通过
