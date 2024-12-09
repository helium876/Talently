import { jest, describe, test, expect } from '@jest/globals'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import React from 'react'

describe('Button Component', () => {
  test('renders button with text', () => {
    const { getByText } = render(<Button>Click me</Button>)
    expect(getByText('Click me')).toBeInTheDocument()
  })

  test('handles click events', async () => {
    const handleClick = jest.fn()
    const { getByText } = render(<Button onClick={handleClick}>Click me</Button>)
    
    await userEvent.click(getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies variant classes correctly', () => {
    const { container } = render(<Button variant="destructive">Delete</Button>)
    expect(container.firstChild).toHaveClass('bg-destructive')
  })

  test('applies size classes correctly', () => {
    const { container } = render(<Button size="sm">Small</Button>)
    expect(container.firstChild).toHaveClass('h-9')
  })

  test('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Click me</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  test('is disabled when disabled prop is true', () => {
    const { getByText } = render(<Button disabled>Disabled</Button>)
    expect(getByText('Disabled')).toBeDisabled()
  })

  test('combines className prop with default classes', () => {
    const { container } = render(
      <Button className="custom-class">Custom</Button>
    )
    expect(container.firstChild).toHaveClass('custom-class')
    expect(container.firstChild).toHaveClass('inline-flex')
  })
}) 