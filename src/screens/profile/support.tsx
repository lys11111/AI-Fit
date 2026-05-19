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
        <InteractiveRow helperText="常见问题、识别说明和原型使用范围。" icon={CircleHelp} title="帮助中心" to={routes.app.help} />
        <InteractiveRow
          helperText="当前原型版本、核心能力和阶段说明。"
          icon={Info}
          title="关于我们"
          tone="indigo"
          to={routes.app.about}
        />
        <InteractiveRow
          helperText="把这轮体验里的卡点写回来，原型也应该能承接。"
          icon={MessageSquareText}
          title="反馈问题"
          tone="amber"
          to={routes.app.supportFeedback}
        />
        <InteractiveRow
          helperText="演示邀请动作、分享渠道和完成状态。"
          icon={Share2}
          title="推荐给好友"
          tone="mint"
          to={routes.app.invite}
        />
      </GroupedSection>
    </Screen>
  )
}
