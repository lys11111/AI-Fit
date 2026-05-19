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
        description="这页负责把原型现在是什么、还不是什么讲清楚，避免测试时把展示页误读成已经完成的智能能力。"
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
        <SectionHeader kicker="CURRENT SCOPE" title="当前阶段怎么理解这套原型" tone="muted" />
        <div className="grid gap-2.5">
          <InsetRow title="训练主线和饮食副线优先做真" copy="这一轮重点是确认哪些闭环已经能反复测试，而不是继续堆页面数量。" />
          <InsetRow title="入口链路负责把故事讲顺" copy="登录、问卷、计划预览现在的任务，是让后面的训练主线显得可信。 " />
          <InsetRow title="社区和相机页先解释能力边界" copy="如果它们还没有深写状态，就明确告诉测试者它们目前只是展示页或辅助工具页。" />
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        <SectionHeader kicker="ROUTE AUDIT" title="当前路由分层" />
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
