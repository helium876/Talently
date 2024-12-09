import { test, expect } from '@playwright/test'
import { setupTestDatabase, safeCleanup, waitForServer } from '../setup'
import { createTestBusiness, createTestTalent } from '../helpers'

test.describe('Booking Flow', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestDatabase()
    await waitForServer(page)
    await createTestBusiness(page)
    await createTestTalent(page)
  })

  test.afterEach(async () => {
    await safeCleanup()
  })

  test('submit booking request', async ({ page }) => {
    // Go to public talent page
    await page.goto('/talents')
    await page.waitForLoadState('networkidle')
    
    await Promise.all([
      page.waitForURL('/talents/*'),
      page.click('text=John Doe')
    ])
    
    // Fill booking form
    await page.waitForSelector('input[name="clientName"]')
    await page.fill('input[name="clientName"]', 'Jane Smith')
    await page.fill('input[name="clientEmail"]', 'jane@example.com')
    await page.fill('textarea[name="message"]', 'Would like to book for a photoshoot')
    
    // Submit booking
    await Promise.all([
      page.waitForURL('/talents/*/booking-confirmation'),
      page.click('button[type="submit"]')
    ])
    
    // Should show confirmation
    await expect(page.locator('text=Booking Request Submitted')).toBeVisible()
  })

  test('business views and manages booking', async ({ page }) => {
    // Create a booking first
    await page.goto('/talents')
    await page.waitForLoadState('networkidle')
    
    await Promise.all([
      page.waitForURL('/talents/*'),
      page.click('text=John Doe')
    ])
    
    await page.waitForSelector('input[name="clientName"]')
    await page.fill('input[name="clientName"]', 'Jane Smith')
    await page.fill('input[name="clientEmail"]', 'jane@example.com')
    await page.fill('textarea[name="message"]', 'Would like to book for a photoshoot')
    
    await Promise.all([
      page.waitForURL('/talents/*/booking-confirmation'),
      page.click('button[type="submit"]')
    ])
    
    // Login as business
    await page.goto('/auth/login')
    await page.waitForLoadState('networkidle')
    
    await page.waitForSelector('input[name="email"]')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'Password123!')
    
    await Promise.all([
      page.waitForURL('/dashboard'),
      page.click('button[type="submit"]')
    ])
    
    // View booking in dashboard
    await page.goto('/dashboard/talents')
    await page.waitForLoadState('networkidle')
    
    await Promise.all([
      page.waitForURL('/dashboard/talents/*'),
      page.click('text=John Doe')
    ])
    
    await Promise.all([
      page.waitForURL('/dashboard/talents/*/bookings'),
      page.click('text=Booking Requests')
    ])
    
    // Verify booking details
    await expect(page.locator('text=Jane Smith')).toBeVisible()
    await expect(page.locator('text=jane@example.com')).toBeVisible()
    await expect(page.locator('text=Would like to book for a photoshoot')).toBeVisible()
  })
}) 