import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.setItem('ows-toured', 'true')
    localStorage.setItem('ows-dark', 'false')
  })
  await page.reload()
})

test('home page loads with hero section', async ({ page }) => {
  await expect(page.locator('h1')).toContainText('cinematic')
  await expect(page.locator('.eyebrow')).toContainText('100% free')
})

test('hero has start recording and features buttons', async ({ page }) => {
  await expect(page.locator('.btn-primary')).toContainText('Start Recording')
  await expect(page.locator('.btn-ghost')).toContainText('See features')
})

test('nav links and dark mode toggle are visible on home', async ({ page }) => {
  await expect(page.locator('.nav-links')).toContainText('Features')
  await expect(page.locator('.nav-links')).toContainText('Studio')
  await expect(page.locator('.nav-links')).toContainText('Gallery')
  await expect(page.locator('.nav-links')).toContainText('About')
  await expect(page.locator('.nav-icon-btn')).toHaveCount(2)
})

test('mockup window with tilt renders', async ({ page }) => {
  await expect(page.locator('.hero-mock')).toBeVisible()
  await expect(page.locator('.mock-bar')).toBeVisible()
  await expect(page.locator('.mock-body')).toBeVisible()
})

test('all 9 feature cards are rendered', async ({ page }) => {
  await expect(page.locator('.card')).toHaveCount(9)
  await expect(page.locator('.card').first()).toContainText('Auto-Zoom')
  await expect(page.locator('.card').last()).toContainText('Instant Local Export')
})

test('feature card hover triggers pixel effect canvas', async ({ page }) => {
  const firstCard = page.locator('.card').first()
  await firstCard.scrollIntoViewIfNeeded()
  await firstCard.hover()
  await page.waitForTimeout(400)
  const canvas = firstCard.locator('canvas')
  await expect(canvas).toBeVisible()
})

test('scroll to features via anchor link', async ({ page }) => {
  await page.locator('.nav-links a').first().click()
  await expect(page.locator('#features')).toBeVisible()
})

test('navigate to studio via nav link', async ({ page }) => {
  await page.locator('.nav-links a').filter({ hasText: 'Studio' }).click()
  await expect(page.locator('h1')).toContainText('Recording Studio')
  await expect(page.locator('.record-btn')).toContainText('Share Screen')
})

test('navigate to studio via CTA button', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  await expect(page.locator('h1')).toContainText('Recording Studio')
})

test('navigate to features page', async ({ page }) => {
  await page.locator('.nav-links a').filter({ hasText: 'Features' }).click()
  await expect(page.locator('h2')).toContainText('No feature gates')
})

test('navigate to about page', async ({ page }) => {
  await page.locator('.nav-links a').filter({ hasText: 'About' }).click()
  await expect(page.locator('h2')).toContainText('Screen recording, reimagined')
})

test('studio page shows share screen prompt', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  await expect(page.locator('.stage-empty')).toContainText('Share Screen')
})

test('studio page has all control buttons visible', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  await expect(page.locator('.controls-left').first()).toBeVisible()
  await expect(page.locator('.icon-btn').first()).toBeVisible()
})

test('studio page has 8 settings groups (with quality, perf mode, reset)', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  await expect(page.locator('.setting-group')).toHaveCount(8)
})

test('background swatches are selectable', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  const swatches = page.locator('.swatch')
  await expect(swatches).toHaveCount(5)
  await swatches.nth(2).click()
  await expect(swatches.nth(2)).toHaveClass(/active/)
})

test('toggle switches work for auto-zoom and motion blur', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  const switches = page.locator('.switch')
  await switches.first().click()
  await expect(switches.first()).not.toHaveClass(/on/)
  await switches.first().click()
  await expect(switches.first()).toHaveClass(/on/)
})

test('padding slider adjusts value display', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  const slider = page.locator('.setting-group').nth(1).locator('input[type="range"]')
  await slider.fill('80')
  await expect(page.locator('.setting-group').nth(1).locator('label')).toContainText('80px')
})

test('hint row shows keyboard shortcuts', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  await expect(page.locator('.hint').first()).toContainText('Space')
  await expect(page.locator('.hint').nth(2)).toContainText('Z')
  await expect(page.locator('.hint').nth(3)).toContainText('B')
  await expect(page.locator('.hint').nth(1)).toContainText('P')
})

test('footer credit is visible on home', async ({ page }) => {
  await expect(page.locator('.footer')).toContainText('OpenWebScreen')
})

test('brand and title are present', async ({ page }) => {
  await expect(page.locator('.brand')).toContainText('OpenWebScreen')
  await expect(page).toHaveTitle('OpenWebScreen — Free Online Screen Recorder | No Signup, 100% Browser-Based')
})

test('navigate back home from studio via brand click', async ({ page }) => {
  await page.locator('.btn-primary').first().click()
  await page.locator('.brand').click()
  await expect(page.locator('.hero-simple')).toBeVisible()
})

test('section head renders on features', async ({ page }) => {
  await expect(page.locator('.section-head h2')).toContainText('All the polish')
  await expect(page.locator('.section-tag')).toContainText('Everything')
})
