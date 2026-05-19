import { Aperture, Camera } from 'lucide-react'
import { Link } from 'react-router-dom'

import { routes } from '@/app/routes'
import { GroupedSection, InsetRow, PageHeader, Screen } from '@/components/app/primitives'
import { Button } from '@/components/ui/button'

const tips = ['对准餐盘整体，尽量别只拍局部', '如果有饮品，记得和主餐一起入镜', '拍完会先进入确认页，不会直接写回记录']

export function MealCaptureScreen() {
  return (
    <Screen dataScreen="meal-capture">
      <PageHeader backTo={routes.app.nutrition} title="拍照记录饮食" description="相机页也要服务产品目标：让你愿意真的去记。" variant="compact" />

      <GroupedSection className="space-y-4 border-[var(--border-strong)] bg-[var(--surface-raised)]">
        <div className="flex items-start gap-4">
          <div className="flex size-11 items-center justify-center rounded-[var(--radius-row)] bg-[var(--accent-amber-soft)] text-[var(--accent-amber-ink)]">
            <Camera className="size-5" />
          </div>
          <div className="space-y-2">
            <h2 className="text-[18px] leading-[24px] font-semibold text-[var(--text-primary)]">准备拍照识别</h2>
            <p className="text-[14px] leading-[21px] text-[var(--text-secondary)]">这里先用工具型提示帮助你把记录拍清楚，后面再去做识别确认和写回。</p>
          </div>
        </div>
        <div className="grid gap-2.5">
          {tips.map((tip) => (
            <InsetRow key={tip} title={tip} icon={Aperture} tone="amber" />
          ))}
        </div>
      </GroupedSection>

      <Button asChild className="w-full">
        <Link to={routes.app.mealConfirm}>继续到识别确认</Link>
      </Button>
    </Screen>
  )
}
