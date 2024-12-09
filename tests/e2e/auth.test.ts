import { test, expect } from '@playwright/test'
import { TestHelper } from '../helpers'
import { logger } from '@/lib/logger'
import { User } from '@/lib/db/models'

test.describe('Authentication', () => {
  let helper: TestHelper

  test.beforeEach(async ({ page }) => {
    helper = new TestHelper(page)
    await helper.setupTestDatabase()
  })

  test.afterEach(async () => {
    await helper.cleanup()
  })

  test('should allow user to login with valid credentials', async ({ page }) => {
    // Create test user
    const testUser = new User({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User'
    })
    await testUser.save()

    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/auth/login')
    await page.fill('input[name="email"]', 'wrong@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.locator('text=Invalid credentials')).toBeVisible()
  })
}) 