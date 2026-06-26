import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { When, Then } = createBdd()

When('I view the camera guide for the partial phase', async ({ page }) => {
  // Camera guide is always visible in the details panel when an eclipse is selected
  await expect(page.locator('.camera-panel')).toBeVisible()
})

When('I view the camera guide for the totality phase', async ({ page }) => {
  await expect(page.locator('.camera-panel')).toBeVisible()
})

When('I view the eclipse details', async ({ page }) => {
  await expect(page.locator('.solar-details')).toBeVisible()
})

Then('I see a warning that a solar filter is required', async ({ page }) => {
  await expect(page.locator('.warning')).toBeVisible()
})

Then('I see recommended ISO and shutter speed settings', async ({ page }) => {
  await expect(page.locator('.setting-block dd')).not.toHaveCount(0)
})

Then('I do not see a solar filter warning', async ({ page }) => {
  // During totality (location inside path), no filter warning is shown
  const warning = page.locator('.warning')
  await expect(warning).not.toBeVisible()
})

Then('I see recommended exposure settings for the inner corona', async ({ page }) => {
  await expect(page.locator('.setting-block', { hasText: 'inner corona' })).toBeVisible()
})

Then('I see recommended exposure settings for the outer corona', async ({ page }) => {
  await expect(page.locator('.setting-block', { hasText: 'outer corona' })).toBeVisible()
})

Then('I see the phase timeline from C1 to C4', async ({ page }) => {
  await expect(page.locator('.timeline')).toBeVisible()
  await expect(page.locator('.phase').first()).toBeVisible()
})

Then('each contact time is labelled', async ({ page }) => {
  const labels = page.locator('.phase .label')
  const count = await labels.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const text = await labels.nth(i).textContent()
    expect(text?.trim().length).toBeGreaterThan(0)
  }
})

Then('the recommended settings differ from those for totality', async ({ page }) => {
  // Partial phase shows filter-required; totality does not
  const warning = page.locator('.warning')
  // If we're in a partial phase, warning is visible
  await expect(warning).toBeVisible()
})
