# Contributing to Talently

Thank you for your interest in contributing to Talently! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Code Style](#code-style)
4. [Making Changes](#making-changes)
5. [Testing](#testing)
6. [Documentation](#documentation)
7. [Pull Request Process](#pull-request-process)
8. [Code Review](#code-review)

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/talently.git
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/talently.git
   ```

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Code Style

### TypeScript Guidelines

- Use TypeScript for all new code
- Enable strict mode
- Define interfaces for all data structures
- Use enums for fixed sets of values
- Avoid `any` type

### Component Guidelines

- Use functional components with hooks
- Keep components small and focused
- Use TypeScript props interfaces
- Implement error boundaries
- Use proper prop naming

Example:
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant,
  size = 'md',
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={cn(
        buttonVariants({ variant, size })
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

### File Organization

- One component per file
- Use index files for exports
- Group related components
- Keep styles close to components

Example structure:
```
src/
└── components/
    └── ui/
        ├── button/
        │   ├── index.ts
        │   ├── button.tsx
        │   └── button.test.tsx
        └── card/
            ├── index.ts
            ├── card.tsx
            └── card.test.tsx
```

## Making Changes

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our code style guidelines

3. Commit your changes:
   ```bash
   git commit -m "feat: add new feature"
   ```
   Follow [Conventional Commits](https://www.conventionalcommits.org/) specification

4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

## Testing

### Required Tests

1. **Unit Tests**
   - Test individual components
   - Test utility functions
   - Test hooks

2. **Integration Tests**
   - Test component interactions
   - Test form submissions
   - Test API integrations

3. **E2E Tests**
   - Test critical user flows
   - Test authentication
   - Test error scenarios

Example test:
```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button variant="primary">Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(
      <Button variant="primary" onClick={handleClick}>
        Click me
      </Button>
    )
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- button.test.tsx

# Run E2E tests
npm run test:e2e
```

## Documentation

### Required Documentation

1. **Component Documentation**
   - Props interface
   - Usage examples
   - Edge cases
   - Performance considerations

2. **API Documentation**
   - Endpoints
   - Request/response formats
   - Error codes
   - Rate limits

3. **Database Schema**
   - Collections/tables
   - Relationships
   - Indexes
   - Constraints

Example documentation:
```typescript
/**
 * Button component with various styles and sizes.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="lg">
 *   Click me
 * </Button>
 * ```
 * 
 * @param props - Component props
 * @param props.variant - Button style variant
 * @param props.size - Button size
 * @param props.children - Button content
 * @param props.onClick - Click handler
 */
```

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Request review from maintainers
6. Address review feedback
7. Squash commits if requested

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing done

## Screenshots
If applicable

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
```

## Code Review

### Review Process

1. Automated checks must pass
2. Two approvals required
3. All comments must be resolved
4. Changes squashed if needed
5. Maintainer merges PR

### Review Checklist

- [ ] Code follows style guide
- [ ] Tests are comprehensive
- [ ] Documentation is updated
- [ ] No security issues
- [ ] Performance impact considered
- [ ] Breaking changes documented
``` 