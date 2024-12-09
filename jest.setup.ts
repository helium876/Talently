import { jest } from '@jest/globals'
import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'
import { loadEnvConfig } from '@next/env'

// Load environment variables
loadEnvConfig(process.cwd())

// Polyfill for encoding which isn't present globally in jsdom
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as any

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '',
}))

// Mock Next.js image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(() => null),
}))

// Mock Next.js server components
jest.mock('next/server', () => {
  class MockHeaders extends Map {
    append(key: string, value: string) {
      this.set(key, value)
      return true
    }
    delete(key: string): boolean {
      return super.delete(key)
    }
    get(key: string): string | null {
      return super.get(key) || null
    }
    has(key: string): boolean {
      return super.has(key)
    }
    set(key: string, value: string): this {
      super.set(key, value)
      return this
    }
  }

  class MockRequest {
    public url: string
    public method: string
    public headers: MockHeaders

    constructor(input: string | URL, init?: RequestInit) {
      this.url = input.toString()
      this.method = init?.method || 'GET'
      this.headers = new MockHeaders()
    }
  }

  return {
    NextResponse: {
      json: (jest.fn().mockImplementation(function(data: any, init?: { status?: number }) {
        return {
          status: init?.status || 200,
          json: async () => data,
        }
      }) as unknown as jest.Mock),
    },
    NextRequest: (jest.fn().mockImplementation((url: string | URL, init?: RequestInit) => 
      new MockRequest(url, init)) as unknown as jest.Mock),
  }
})

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks()
}) 