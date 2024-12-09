import { jest, describe, test, expect } from '@jest/globals'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import { ErrorBanner } from '@/components/ui/error-banner'

jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('?error=Test%20error%20message'),
}))

describe('ErrorBanner Component', () => {
  test('renders correctly with error message', () => {
    const { container } = render(<ErrorBanner />)
    expect(container).toMatchSnapshot()
  })

  test('renders nothing when no error present', () => {
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockImplementation(
      () => new URLSearchParams('')
    )
    const { container } = render(<ErrorBanner />)
    expect(container.firstChild).toBeNull()
  })

  test('decodes URI encoded error message', () => {
    jest.spyOn(require('next/navigation'), 'useSearchParams').mockImplementation(
      () => new URLSearchParams('?error=Test%20error%20message')
    )
    const { getByText } = render(<ErrorBanner />)
    expect(getByText('Test error message')).toBeInTheDocument()
  })

  test('matches error banner styling', () => {
    const { container } = render(<ErrorBanner />)
    expect(container.firstChild).toHaveClass('rounded-md', 'bg-red-50', 'p-4', 'mb-6')
  })

  test('includes error icon', () => {
    const { container } = render(<ErrorBanner />)
    const icon = container.querySelector('svg')
    expect(icon).toHaveClass('h-5', 'w-5', 'text-red-400')
  })
}) 