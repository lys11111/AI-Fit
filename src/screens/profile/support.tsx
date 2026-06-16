import { CircleHelp, Info, MessageSquareText, Share2 } from 'lucide-react'

import { routes } from '@/app/routes'
import { GroupedSection, InteractiveRow, PageHeader, Screen } from '@/components/app/primitives'

export function ProfileSupportScreen() {
  return (
    <Screen dataScreen="profile-support">
      <PageHeader
        backTo={routes.app.profile}
        description="把帮助、反馈和分享放进一张顺手的支持页。"
        title="帮助与服务中心"
        variant="compact"
      />

      <GroupedSection className="space-y-3">
        <InteractiveRow helperText="常见问题、器械识别说明和训练计划使用建议。" icon={CircleHelp} title="帮助中心" to={routes.app.help} />
        <InteractiveRow
          helperText="了解 AI-FIT 的核心能力和产品信息。"
          icon={Info}
          title="关于我们"
          tone="indigo"
          to={routes.app.about}
        />
        <InteractiveRow
          helperText="告诉我们你在训练、识别或记录中遇到的问题。"
          icon={MessageSquareText}
          title="反馈问题"
          tone="amber"
          to={routes.app.supportFeedback}
        />
        <InteractiveRow
          helperText="把 AI-FIT 推荐给一起训练的朋友。"
          icon={Share2}
          title="推荐给好友"
          tone="mint"
          to={routes.app.invite}
        />
      </GroupedSection>
    </Screen>
  )
}
