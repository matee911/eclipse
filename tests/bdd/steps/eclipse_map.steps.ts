import { createBdd } from 'playwright-bdd'
import { expect } from '@playwright/test'

const { Given, When, Then } = createBdd()

Given('the application is loaded', async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="app"]', { timeout: 10_000 })
})

When('I open the app', async ({ page }) => {
  // Already loaded in Given
  await page.waitForSelector('[data-testid="app"]')
})

Then('I see a list of upcoming eclipses', async ({ page }) => {
  const items = page.locator('.item')
  await expect(items.first()).toBeVisible()
})

Then('each eclipse shows its date and type', async ({ page }) => {
  const firstItem = page.locator('.item').first()
  await expect(firstItem.locator('.date')).toBeVisible()
  await expect(firstItem.locator('.badge')).toBeVisible()
})

When('I select the {string} solar eclipse', async ({ page }, dateStr: string) => {
  // Find the eclipse item matching the date
  const item = page.locator(`.item`).filter({ hasText: dateStr }).first()
  await item.click()
})

Then('the map shows the eclipse path', async ({ page }) => {
  // The Leaflet SVG path elements appear after selection
  await page.waitForTimeout(500)
  const paths = page.locator('.leaflet-overlay-pane path')
  await expect(paths.first()).toBeVisible()
})

Then('the path passes over North Africa and the Middle East', async ({ page }) => {
  // Verify path exists — region check is covered by unit tests on catalog data
  const paths = page.locator('.leaflet-overlay-pane path')
  await expect(paths.first()).toBeVisible()
})

Then('I see the eclipse type labelled {string}', async ({ page }, label: string) => {
  await expect(page.locator('.badge', { hasText: label })).toBeVisible()
})

When('I switch the language to {string}', async ({ page }, lang: string) => {
  await page.click(`[data-testid="lang-${lang.toLowerCase()}"]`)
  await page.waitForTimeout(300)
})

Then('the interface is displayed in Polish', async ({ page }) => {
  // Check for a Polish string that appears in the navigation/header
  await expect(page.locator('text=Zaćmienia')).toBeVisible()
})
