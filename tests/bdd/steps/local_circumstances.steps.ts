import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd()

Given('I select the {string} solar eclipse', async ({ page }, dateStr: string) => {
  const item = page.locator('.item').filter({ hasText: dateStr }).first()
  await item.click()
  await page.waitForTimeout(400)
})

Given('I choose the location {string} at {float}°N {float}°E', async ({ page }, _name: string, lat: number, lon: number) => {
  await page.fill('input[type="number"]:first-of-type', lat.toFixed(2))
  await page.fill('input[type="number"]:last-of-type', lon.toFixed(2))
  await page.keyboard.press('Tab')
  await page.waitForTimeout(300)
})

Given('I choose the location {string} at {float}°S {float}°E', async ({ page }, _name: string, lat: number, lon: number) => {
  await page.fill('input[type="number"]:first-of-type', (-lat).toFixed(2))
  await page.fill('input[type="number"]:last-of-type', lon.toFixed(2))
  await page.keyboard.press('Tab')
  await page.waitForTimeout(300)
})

Then('I see {string} status', async ({ page }, statusText: string) => {
  await expect(page.locator('.status-badge', { hasText: statusText })).toBeVisible()
})

Then('I see a totality duration greater than 0 seconds', async ({ page }) => {
  const el = page.locator('[data-testid="duration"]')
  await expect(el).toBeVisible()
  const text = await el.textContent()
  expect(text).toBeTruthy()
  expect(text).not.toBe('0s')
})

Then('I see contact times C1, C2, maximum, C3, C4', async ({ page }) => {
  await expect(page.locator('.timeline')).toBeVisible()
  // Timeline should have multiple phase entries
  const phases = page.locator('.phase')
  await expect(phases).toHaveCount(5)
})

Then('I see an obscuration percentage between 1% and 99%', async ({ page }) => {
  const el = page.locator('[data-testid="obscuration"]')
  await expect(el).toBeVisible()
  const text = (await el.textContent()) ?? ''
  const pct = parseFloat(text)
  expect(pct).toBeGreaterThan(1)
  expect(pct).toBeLessThan(100)
})

Then('I do not see C2 and C3 contact times', async ({ page }) => {
  // For partial-only observer, we have 3 phase entries (C1, max, C4)
  const phases = page.locator('.phase')
  const count = await phases.count()
  expect(count).toBeLessThan(5)
})

Then('I see the Sun altitude at maximum eclipse', async ({ page }) => {
  await expect(page.locator('[data-testid="sun-altitude"]')).toBeVisible()
})

Then('the altitude is greater than {int} degrees', async ({ page }, degrees: number) => {
  const el = page.locator('[data-testid="sun-altitude"]')
  const text = (await el.textContent()) ?? ''
  const alt = parseFloat(text)
  expect(alt).toBeGreaterThan(degrees)
})

Then('I see the sky darkening indicator', async ({ page }) => {
  await expect(page.locator('.sky-block')).toBeVisible()
})

Then('the sky condition is described as {string}', async ({ page }, desc: string) => {
  await expect(page.locator('.sky-desc', { hasText: desc })).toBeVisible()
})

Then('I see {string} or {string} status', async ({ page }, s1: string, s2: string) => {
  const badge = page.locator('.status-badge')
  const text = (await badge.textContent()) ?? ''
  expect(text.includes(s1) || text.includes(s2)).toBe(true)
})

Then('I see tooltip icons for obscuration and sun altitude', async ({ page }) => {
  const statGrid = page.locator('.stat-grid')
  const tooltipIcons = statGrid.locator('.tooltip-icon')
  const count = await tooltipIcons.count()
  expect(count).toBeGreaterThanOrEqual(2)
  for (let i = 0; i < count; i++) {
    const tooltip = await tooltipIcons.nth(i).getAttribute('data-tooltip')
    expect(tooltip).toBeTruthy()
  }
})
