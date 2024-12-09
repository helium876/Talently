import { test, expect } from '@playwright/test'
import { setupTestDatabase, safeCleanup, waitForServer } from '../setup'
import { createTestBusiness } from '../helpers'

test.describe('Talent Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestDatabase()
    await waitForServer(page)
    await createTestBusiness(page)
  })

  test.afterEach(async () => {
    await safeCleanup()
  })

  test('create new talent', async ({ page }) => {
    await page.goto('/dashboard/talents/new')
    await page.waitForLoadState('networkidle')
    
    // Fill in talent form
    await page.waitForSelector('input[name="name"]')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('textarea[name="basicInfo"]', 'Professional photographer with 10 years of experience')
    
    // Upload image (mock)
    await page.setInputFiles('input[type="file"]', 'tests/fixtures/test-image.jpg')
    
    // Submit form
    await Promise.all([
      page.waitForURL('/dashboard/talents/**'),
      page.click('button[type="submit"]')
    ])
    
    // Should show talent information
    await expect(page.locator('text=John Doe')).toBeVisible()
    await expect(page.locator('text=Professional photographer')).toBeVisible()
  })

  test('edit talent', async ({ page }) => {
    // Create talent first
    await page.goto('/dashboard/talents/new')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('input[name="name"]')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('textarea[name="basicInfo"]', 'Professional photographer')
    
    await Promise.all([
      page.waitForURL('/dashboard/talents/**'),
      page.click('button[type="submit"]')
    ])
    
    // Go to edit page
    await Promise.all([
      page.waitForURL('/dashboard/talents/**/edit'),
      page.click('text=Edit')
    ])
    
    // Update information
    await page.waitForSelector('input[name="name"]')
    await page.fill('input[name="name"]', 'John Smith')
    await page.fill('textarea[name="basicInfo"]', 'Updated bio')
    
    await Promise.all([
      page.waitForURL('/dashboard/talents/**'),
      page.click('button[type="submit"]')
    ])
    
    // Should show updated information
    await expect(page.locator('text=John Smith')).toBeVisible()
    await expect(page.locator('text=Updated bio')).toBeVisible()
  })

  test('delete talent', async ({ page }) => {
    // Create talent first
    await page.goto('/dashboard/talents/new')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('input[name="name"]')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('textarea[name="basicInfo"]', 'Professional photographer')
    
    await Promise.all([
      page.waitForURL('/dashboard/talents/**'),
      page.click('button[type="submit"]')
    ])
    
    // Delete talent
    await page.click('button:has-text("Delete")')
    await page.click('button:has-text("Confirm")')
    
    // Should not show deleted talent
    await expect(page.locator('text=John Doe')).not.toBeVisible()
  })

  test('view booking requests', async ({ page }) => {
    // Create talent first
    await page.goto('/dashboard/talents/new')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('input[name="name"]')
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('textarea[name="basicInfo"]', 'Professional photographer')
    
    await Promise.all([
      page.waitForURL('/dashboard/talents/**'),
      page.click('button[type="submit"]')
    ])
    
    // Go to bookings tab
    await Promise.all([
      page.waitForURL('/dashboard/talents/**/bookings'),
      page.click('text=Booking Requests')
    ])
    
    // Should show empty state initially
    await expect(page.locator('text=No booking requests yet')).toBeVisible()
  })
}) 