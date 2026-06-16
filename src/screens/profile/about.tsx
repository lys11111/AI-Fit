import { routes } from '@/app/routes'
import { aboutStats, prototypeRouteAudit } from '@/data'
import { GroupedSection, InsetRow, MetricCard, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'

export function AboutScreen() {
  return (
    <Screen dataScreen="about">
      <PageHeader
        backTo={routes.app.profileSupport}
        title="关于 AI-FIT"
        description="AI-FIT 专注于固定器械识别、训练计划生成、动作纠偏和训练饮食记录。"
        variant="compact"
      />

      <div className="grid gap-3">
        {aboutStats.map((item, index) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value}
            hint={item.hint}
            tone={index === 1 ? 'indigo' : index === 2 ? 'amber' : 'primary'}
            variant={index === 0 ? 'feature' : 'compact'}
          />
        ))}
      </div>

      <GroupedSection className="space-y-4" variant="inset">
        <SectionHeader kicker="PRODUCT" title="AI-FIT 能为你做什么" tone="muted" />
        <div className="grid gap-2.5">
          <InsetRow title="固定器械训练更容易开始" copy="计划会优先匹配推胸、下拉、划船、腿举等常见器械动作。" />
          <InsetRow title="动作纠偏降低训练风险" copy="摄像头训练页会帮助你关注姿态、节奏和完成次数。" />
          <InsetRow title="训练饮食一起管理" copy="训练计划、饮食记录和身体数据会放在同一套日常流程里。" />
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <SectionHeader kicker="FEATURES" title="功能模块" />
        {prototypeRouteAudit.map((item, index) => (
          <GroupedSection key={item.title} className="space-y-3">
            <Badge variant={index === 0 ? 'mint' : index === 1 ? 'indigo' : 'amber'}>{item.badge}</Badge>
            <InsetRow className="bg-transparent px-0 py-0" title={item.title} copy={item.copy} />
          </GroupedSection>
        ))}
      </div>
    </Screen>
  )
}
