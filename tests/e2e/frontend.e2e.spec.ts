import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/AFCEA Rocky Mountain/)
    const heading = page.locator('h1').first()
    await expect(heading).toBeVisible()
  })

  test('can load events page', async ({ page }) => {
    await page.goto('http://localhost:3000/events')
    await expect(page.locator('h1').first()).toContainText(/Events/i)
  })

  test('can load leadership page', async ({ page }) => {
    await page.goto('http://localhost:3000/leadership')
    await expect(page.locator('h1').first()).toContainText(/Leadership/i)
  })
})
