import { expect, test, type Page } from '@playwright/test'

const storageKey = 'aifit-prototype-state-v1'
const desktop = { width: 1440, height: 1200 }
const mobile = { width: 390, height: 844 }

async function gotoMobile(page: Page, path: string) {
  await page.setViewportSize(mobile)
  await page.goto(path)
}

async function readPrototypeState(page: Page) {
  return page.evaluate((key) => JSON.parse(window.localStorage.getItem(key) ?? 'null'), storageKey)
}

async function resetPrototypeState(page: Page) {
  await gotoMobile(page, '/')
  await page.getByTestId('prototype-reset').click()
  await expect(page.getByText('已恢复到测试初始状态')).toBeVisible()
}

test.describe('visual shells', () => {
  test('welcome desktop screenshot', async ({ page }) => {
    await page.setViewportSize(desktop)
    await page.goto('/')
    await expect(page).toHaveScreenshot('welcome-desktop.png', { fullPage: true, maxDiffPixels: 600 })
  })

  test('welcome mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/')
    await expect(page).toHaveScreenshot('welcome-mobile.png', { fullPage: true })
  })

  test('home mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/home')
    await expect(page.locator('[data-screen="home"]')).toHaveScreenshot('home-mobile.png')
  })

  test('training mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/training')
    await expect(page.locator('[data-screen="training"]')).toHaveScreenshot('training-mobile.png')
  })

  test('nutrition mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/nutrition')
    await expect(page.locator('[data-screen="nutrition"]')).toHaveScreenshot('nutrition-mobile.png')
  })

  test('profile mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/profile')
    await expect(page.locator('[data-screen="profile"]')).toHaveScreenshot('profile-mobile.png')
  })

  test('community mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/community')
    await expect(page.locator('[data-screen="community"]')).toHaveScreenshot('community-mobile.png')
  })

  test('notifications mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/notifications')
    await expect(page.locator('[data-screen="notifications"]')).toHaveScreenshot('notifications-mobile.png')
  })

  test('profile account mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/profile/account')
    await expect(page.locator('[data-screen="profile-account"]')).toHaveScreenshot('profile-account-mobile.png')
  })

  test('profile support mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/profile/support')
    await expect(page.locator('[data-screen="profile-support"]')).toHaveScreenshot('profile-support-mobile.png')
  })

  test('meal confirm mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/meal-confirm')
    await expect(page.locator('[data-screen="meal-confirm"]')).toHaveScreenshot('meal-confirm-mobile.png')
  })

  test('workout summary mobile screenshot', async ({ page }) => {
    await gotoMobile(page, '/app/summary')
    await expect(page.locator('[data-screen="workout-summary"]')).toHaveScreenshot('workout-summary-mobile.png')
  })
})

test.describe('navigation and accessibility', () => {
  test('bottom navigation marks current route', async ({ page }) => {
    await gotoMobile(page, '/app/training')

    const nav = page.locator('nav[aria-label]')
    await expect(nav).toBeVisible()
    await expect(nav.locator('a[href="/app/training"]')).toHaveClass(/bg-\[var\(--state-selected\)\]/)
  })

  test('notification bell opens notifications from home and profile', async ({ page }) => {
    await gotoMobile(page, '/app/home')
    await page.getByTestId('notification-bell').click()
    await expect(page.locator('[data-screen="notifications"]')).toBeVisible()

    await gotoMobile(page, '/app/profile')
    await page.getByTestId('notification-bell').click()
    await expect(page.locator('[data-screen="notifications"]')).toBeVisible()
  })

  test('info tips open on hover and tap without triggering navigation', async ({ page }) => {
    await page.setViewportSize(desktop)
    await page.goto('/app/profile')

    const headerTipTrigger = page.locator('[data-screen="profile"] header [data-slot="info-tip-trigger"]').first()
    await headerTipTrigger.hover()
    await expect(page.locator('[data-slot="info-tip-panel"]').filter({ hasText: /./ }).first()).toBeVisible()

    await gotoMobile(page, '/app/profile')
    const accountRow = page.locator('a[href="/app/profile/account"]').nth(1)
    await accountRow.locator('[data-slot="info-tip-trigger"]').click()
    await expect(accountRow.locator('[data-slot="info-tip-panel"]')).toBeVisible()
    await expect(page).toHaveURL('/app/profile')
    await page.mouse.click(5, 5)
    await expect(accountRow.locator('[data-slot="info-tip-panel"]')).not.toBeVisible()

    await gotoMobile(page, '/app/training')
    const workoutTile = page.locator('a[href="/app/workout"]')
    await workoutTile.locator('[data-slot="info-tip-trigger"]').click()
    await expect(workoutTile.locator('[data-slot="info-tip-panel"]')).toBeVisible()
    await expect(page).toHaveURL('/app/training')
  })

  test('info tip tap does not toggle the related switch', async ({ page }) => {
    await gotoMobile(page, '/app/profile/notification-settings')

    const coachSwitch = page.getByRole('switch').nth(0)
    const before = (await coachSwitch.getAttribute('aria-checked')) ?? 'false'

    const infoTrigger = page.locator('[data-screen="notification-settings"] [data-slot="info-tip-trigger"]').nth(1)
    await infoTrigger.click()
    await expect(page.locator('[data-screen="notification-settings"] [data-slot="info-tip-panel"]').nth(1)).toBeVisible()
    await expect(coachSwitch).toHaveAttribute('aria-checked', before)
  })

  test('profile hub and community links open their routed screens', async ({ page }) => {
    await gotoMobile(page, '/app/profile')

    await page.locator('a[href="/app/profile/account"]').first().click()
    await expect(page.locator('[data-screen="profile-account"]')).toBeVisible()

    await gotoMobile(page, '/app/profile')
    await page.locator('a[href="/app/profile/support"]').first().click()
    await expect(page.locator('[data-screen="profile-support"]')).toBeVisible()

    await gotoMobile(page, '/app/community')
    await page.locator('a[href="/app/community/buddy-match"]').click()
    await expect(page.locator('[data-screen="buddy-match"]')).toBeVisible()

    await gotoMobile(page, '/app/community')
    await page.locator('a[href="/app/community/chat-draft"]').click()
    await expect(page.locator('[data-screen="chat-draft"]')).toBeVisible()
  })

  test('feedback textarea can receive focus', async ({ page }) => {
    await gotoMobile(page, '/app/feedback')
    const field = page.locator('#feedback-note')
    await field.click()
    await expect(field).toBeFocused()
  })
})

test.describe('prototype state flows', () => {
  test('login request code updates and persists auth state', async ({ page }) => {
    await gotoMobile(page, '/login')

    await page.locator('#login-phone').fill('138 0000 1234')
    await page.getByTestId('request-code-button').click()

    await page.waitForFunction((key) => {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw).auth.status === 'sent' : false
    }, storageKey)

    const state = await readPrototypeState(page)
    expect(state.auth.phone).toBe('138 0000 1234')
    expect(state.auth.cooldownEndsAt).toBeTruthy()
    expect(state.auth.lastSentAt).toBeTruthy()

    await page.reload()
    await expect(page.locator('#login-phone')).toHaveValue('138 0000 1234')
    await expect(page.getByTestId('request-code-button')).toBeDisabled()
  })

  test('onboarding choices flow into plan preview and home', async ({ page }) => {
    await resetPrototypeState(page)
    await gotoMobile(page, '/login')
    await page.getByRole('link', { name: '继续进入问卷' }).click()

    await page.getByRole('button', { name: '增肌推进' }).click()
    await page.getByRole('button', { name: '每周 5 次' }).click()
    await page.getByRole('button', { name: '晨间训练' }).click()
    await page.getByRole('button', { name: '30 分钟' }).click()
    await page.getByRole('button', { name: '居家轻器械' }).click()
    await page.getByRole('button', { name: '回程速度' }).click()
    await page.getByRole('link', { name: '继续生成训练计划' }).click()

    await expect(page).toHaveURL('/plan-loading')
    await page.getByRole('link', { name: '查看计划预览' }).click()
    await expect(page).toHaveURL('/plan-preview')

    await expect(page.getByRole('heading', { name: /回程速度/ })).toBeVisible()
    await expect(page.getByText('晨间训练 · 30 分钟')).toBeVisible()

    let state = await readPrototypeState(page)
    expect(state.onboardingProfile.goal).toBe('增肌推进')
    expect(state.onboardingProfile.preferredWindow).toBe('晨间训练')
    expect(state.onboardingProfile.sessionDuration).toBe('30 分钟')
    expect(state.plan.focusPreference).toBe('回程速度')
    expect(state.plan.title).toContain('回程速度')

    await page.getByRole('link', { name: '进入首页' }).click()
    await expect(page).toHaveURL('/app/home')
    await expect(page.getByText('回程速度', { exact: false }).first()).toBeVisible()

    state = await readPrototypeState(page)
    expect(state.profileSettings.trainingPreferences.equipmentPreference).toBe('居家轻器械')
  })

  test('notifications can be marked read, cleared, and restored', async ({ page }) => {
    await gotoMobile(page, '/app/notifications')

    await page.getByTestId('notification-item-coach-adjustment').click()
    await page.waitForFunction(
      ({ key, id }) => {
        const raw = window.localStorage.getItem(key)
        if (!raw) {
          return false
        }
        const item = JSON.parse(raw).notifications.items.find((entry: { id: string; readAt: string | null }) => entry.id === id)
        return Boolean(item?.readAt)
      },
      { key: storageKey, id: 'coach-adjustment' },
    )

    let state = await readPrototypeState(page)
    expect(state.notifications.items.find((item: { id: string }) => item.id === 'coach-adjustment')?.readAt).toBeTruthy()

    await page.getByTestId('notifications-clear').click()
    await page.waitForFunction((key) => {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw).notifications.items.length === 0 : false
    }, storageKey)

    state = await readPrototypeState(page)
    expect(state.notifications.items).toHaveLength(0)

    await page.getByTestId('notifications-restore').click()
    await page.waitForFunction((key) => {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw).notifications.items.length === 3 : false
    }, storageKey)

    state = await readPrototypeState(page)
    expect(state.notifications.items).toHaveLength(3)
  })

  test('meal recognition writes back into nutrition state and home', async ({ page }) => {
    await resetPrototypeState(page)
    await gotoMobile(page, '/app/meal-confirm')

    const before = await readPrototypeState(page)

    await page.getByTestId('save-meal-recognition').click()
    await expect(page).toHaveURL('/app/nutrition')

    await page.waitForFunction((key) => {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw).nutrition.recognitionSaved : false
    }, storageKey)

    const after = await readPrototypeState(page)
    expect(before.nutrition.recognitionSaved).toBe(false)
    expect(after.nutrition.recognitionSaved).toBe(true)
    expect(after.nutrition.lastSavedMealAt).toBeTruthy()
    expect(after.nutrition.mealRecords).toHaveLength(before.nutrition.mealRecords.length + 1)

    await gotoMobile(page, '/app/home')
    await expect(page.getByText('饮食已同步')).toBeVisible()
  })

  test('training feedback writes through to summary, assessment, and home', async ({ page }) => {
    const note = `Playwright note ${Date.now()}`

    await resetPrototypeState(page)
    await gotoMobile(page, '/app/feedback')
    await page.getByRole('button', { name: '8' }).click()
    await page.locator('#feedback-note').fill(note)
    await page.getByTestId('save-training-feedback').click()

    await expect(page).toHaveURL('/app/summary')
    await page.waitForFunction(
      ({ key, noteValue }) => {
        const raw = window.localStorage.getItem(key)
        return raw ? JSON.parse(raw).training.lastFeedback?.note === noteValue : false
      },
      { key: storageKey, noteValue: note },
    )

    const state = await readPrototypeState(page)
    expect(state.training.lastFeedback?.note).toBe(note)
    expect(state.training.lastFeedback?.rpe).toBe(8)

    await page.getByRole('link', { name: '查看明日调整建议' }).click()
    await expect(page.locator('[data-screen="plan-assessment"]')).toBeVisible()
    await expect(page.getByText('回到首页继续使用')).toBeVisible()

    await page.getByRole('link', { name: '回到首页继续使用' }).click()
    await expect(page.locator('[data-screen="home"]')).toBeVisible()
    await expect(page.getByText(note)).toBeVisible()
  })

  test('personal info saves and survives reload', async ({ page }) => {
    const name = `Playwright ${Date.now()}`

    await gotoMobile(page, '/app/profile/personal-info')
    await page.locator('#personal-info-name').fill(name)
    await page.locator('#personal-info-city').fill('Hangzhou')
    await page.locator('#personal-info-bio').fill('Prototype persistence check')
    await page.getByTestId('save-personal-info').click()

    await page.waitForFunction(
      ({ key, nextName }) => {
        const raw = window.localStorage.getItem(key)
        return raw ? JSON.parse(raw).profileSettings.personalInfo.name === nextName : false
      },
      { key: storageKey, nextName: name },
    )

    const state = await readPrototypeState(page)
    expect(state.profileSettings.personalInfo.name).toBe(name)
    expect(state.profileSettings.personalInfo.city).toBe('Hangzhou')

    await page.reload()
    await expect(page.locator('#personal-info-name')).toHaveValue(name)
    await expect(page.locator('#personal-info-city')).toHaveValue('Hangzhou')
    await expect(page.locator('#personal-info-bio')).toHaveValue('Prototype persistence check')
  })

  test('welcome reset restores the prototype baseline', async ({ page }) => {
    const note = `Reset me ${Date.now()}`

    await gotoMobile(page, '/app/feedback')
    await page.locator('#feedback-note').fill(note)
    await page.getByTestId('save-training-feedback').click()
    await gotoMobile(page, '/app/meal-confirm')
    await page.getByTestId('save-meal-recognition').click()

    await resetPrototypeState(page)
    const state = await readPrototypeState(page)

    expect(state.auth.status).toBe('idle')
    expect(state.onboardingProfile.lastCompletedAt).toBeNull()
    expect(state.training.lastFeedback).toBeNull()
    expect(state.nutrition.recognitionSaved).toBe(false)
    expect(state.nutrition.lastSavedMealAt).toBeNull()
    expect(state.plan.focusPreference).toBe('背部发力')
  })
})
