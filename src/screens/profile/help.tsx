import { routes } from '@/app/routes'
import { helpTopics, prototypeRouteAudit, prototypeWalkthroughSteps } from '@/data'
import { GroupedSection, InsetRow, PageHeader, Screen, SectionHeader } from '@/components/app/primitives'
import { Badge } from '@/components/ui/badge'

export function HelpCenterScreen() {
  return (
    <Screen dataScreen="help-center">
      <PageHeader
        backTo={routes.app.profileSupport}
        title="帮助中心"
        description="这里不只放 FAQ，也负责把当前原型哪些地方已经能走通、哪些地方还是展示态说清楚。"
        variant="compact"
      />

      <GroupedSection className="space-y-4" variant="inset">
        <SectionHeader kicker="TEST SCRIPT" title="建议这样跑一遍原型" tone="muted" />
        <div className="grid gap-2.5">
          {prototypeWalkthroughSteps.map((step, index) => (
            <InsetRow key={step} meta={`STEP ${index + 1}`} title={step} />
          ))}
        </div>
      </GroupedSection>

      <div className="grid gap-3">
        {prototypeRouteAudit.map((section, index) => (
          <GroupedSection key={section.title} className="space-y-3">
            <div className="space-y-2">
              <Badge variant={index === 0 ? 'mint' : index === 1 ? 'indigo' : 'amber'}>{section.badge}</Badge>
              <h2 className="text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]">{section.title}</h2>
              <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">{section.copy}</p>
            </div>
            <div className="grid gap-2.5">
              {section.items.map((item) => (
                <InsetRow key={item} title={item} />
              ))}
            </div>
          </GroupedSection>
        ))}
      </div>

      <div className="grid gap-3">
        {helpTopics.map((topic) => (
          <GroupedSection key={topic.title} className="space-y-2">
            <InsetRow className="bg-transparent px-0 py-0" title={topic.title} copy={topic.copy} />
          </GroupedSection>
        ))}
      </div>
    </Screen>
  )
}
