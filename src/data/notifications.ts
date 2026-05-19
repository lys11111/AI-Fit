export type NotificationItem = {
  id: string
  title: string
  copy: string
  time: string
  category: 'coach' | 'nutrition' | 'community'
}

export const notificationSeed: NotificationItem[] = [
  {
    id: 'coach-adjustment',
    title: '教练提醒已更新',
    copy: '今天的背部训练强度下调 15%，重点放回技术质量。',
    time: '刚刚',
    category: 'coach',
  },
  {
    id: 'meal-window',
    title: '训练前加餐窗口开启',
    copy: '建议在 90 分钟内补一份轻碳水，今晚手感会更稳。',
    time: '12 分钟前',
    category: 'nutrition',
  },
  {
    id: 'buddy-match',
    title: '附近有一个高匹配训练搭子',
    copy: '李沐阳和你的晚间训练偏好高度重合，可以先发一条轻量私聊。',
    time: '2 小时前',
    category: 'community',
  },
]
