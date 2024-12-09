import { Page, expect } from '@playwright/test'
import { logger } from '@/lib/logger'

interface TestUser {
  email: string
  password: string
  businessName: string
}

interface TestTalent {
  name: string
  basicInfo: string
}

export class TestHelper {
  constructor(private page: Page) {}

  private async waitForNavigation(url: string, timeout = 10000) {
    try {
      await this.page.waitForURL(url, { timeout })
    } catch (error) {
      logger.error(`Navigation timeout waiting for ${url}:`, error as Error)
      throw new Error(`Failed to navigate to ${url}: ${(error as Error).message}`)
    }
  }

  private async fillForm(selectors: Record<string, string>) {
    for (const [field, value] of Object.entries(selectors)) {
      try {
        const selector = `[name="${field}"]`
        await this.page.waitForSelector(selector, { state: 'visible', timeout: 5000 })
        await this.page.fill(selector, value)
      } catch (error) {
        logger.error(`Error filling form field ${field}:`, error as Error)
        throw new Error(`Failed to fill form field ${field}: ${(error as Error).message}`)
      }
    }
  }

  private async submitFormAndWait(submitButtonText: string, expectedUrl: string) {
    try {
      await Promise.all([
        this.page.waitForURL(expectedUrl, { timeout: 10000 }),
        this.page.click(`button:has-text("${submitButtonText}")`)
      ])
    } catch (error) {
      logger.error(`Form submission error:`, error as Error)
      throw new Error(`Failed to submit form: ${(error as Error).message}`)
    }
  }

  async createTestBusiness(data?: Partial<TestUser>): Promise<TestUser> {
    const testUser: TestUser = {
      email: `test${Date.now()}@example.com`,
      password: 'Password123!',
      businessName: 'Test Business',
      ...data
    }

    try {
      logger.info('Creating test business...', { email: testUser.email })
      
      await this.page.goto('/auth/signup')
      await this.page.waitForLoadState('networkidle')

      await this.fillForm({
        businessName: testUser.businessName,
        email: testUser.email,
        password: testUser.password
      })

      await this.submitFormAndWait('Sign up', '/dashboard')
      
      // Verify business was created
      await expect(this.page.locator(`text=${testUser.businessName}`)).toBeVisible()
      logger.info('Test business created successfully')

      return testUser
    } catch (error) {
      logger.error('Failed to create test business:', error as Error)
      throw error
    }
  }

  async createTestTalent(data?: Partial<TestTalent>): Promise<TestTalent> {
    const testTalent: TestTalent = {
      name: 'John Doe',
      basicInfo: 'Professional photographer',
      ...data
    }

    try {
      logger.info('Creating test talent...', { name: testTalent.name })
      
      await this.page.goto('/dashboard/talents/new')
      await this.page.waitForLoadState('networkidle')

      await this.fillForm({
        name: testTalent.name,
        basicInfo: testTalent.basicInfo
      })

      await this.submitFormAndWait('Create', '/dashboard/talents/**')
      
      // Verify talent was created
      await expect(this.page.locator(`text=${testTalent.name}`)).toBeVisible()
      logger.info('Test talent created successfully')

      return testTalent
    } catch (error) {
      logger.error('Failed to create test talent:', error as Error)
      throw error
    }
  }

  async login(email: string, password: string) {
    try {
      logger.info('Logging in...', { email })
      
      await this.page.goto('/auth/login')
      await this.page.waitForLoadState('networkidle')

      await this.fillForm({
        email,
        password
      })

      await this.submitFormAndWait('Sign in', '/dashboard')
      logger.info('Login successful')
    } catch (error) {
      logger.error('Login failed:', error as Error)
      throw error
    }
  }

  async logout() {
    try {
      await this.page.click('button:has-text("Sign out")')
      await this.waitForNavigation('/')
      logger.info('Logout successful')
    } catch (error) {
      logger.error('Logout failed:', error as Error)
      throw error
    }
  }

  async verifyToast(message: string, timeout = 5000) {
    try {
      await this.page.waitForSelector(`text=${message}`, { timeout })
      logger.info('Toast message verified:', { message })
    } catch (error) {
      logger.error('Failed to verify toast:', error as Error)
      throw new Error(`Toast message "${message}" not found: ${(error as Error).message}`)
    }
  }

  async verifyErrorMessage(message: string, timeout = 5000) {
    try {
      await this.page.waitForSelector(`text=${message}`, { timeout })
      logger.info('Error message verified:', { message })
    } catch (error) {
      logger.error('Failed to verify error message:', error as Error)
      throw new Error(`Error message "${message}" not found: ${(error as Error).message}`)
    }
  }
} 