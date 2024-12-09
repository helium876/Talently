# Testing Documentation

## Overview
This document outlines the testing strategy and procedures for the Talently platform. We use a comprehensive testing approach that covers unit tests, integration tests, and end-to-end tests across multiple environments.

## Test Setup

### Prerequisites
```bash
# Install Playwright
npm install -D @playwright/test

# Install browsers
npx playwright install
```

### Test Structure
```
tests/
├── e2e/                 # End-to-end tests
│   ├── auth.test.ts     # Authentication tests
│   ├── booking.test.ts  # Booking flow tests
│   └── talent-management.test.ts
├── setup.ts             # Test setup and utilities
└── helpers.ts          # Common test helpers
```

## Running Tests

### Local Development
```bash
# Run all tests
npm test

# Run specific test file
npm test tests/e2e/auth.test.ts

# Run tests with UI mode
npm test -- --ui

# Generate and view report
npm run test:report
```

### Environment-Specific Testing
```bash
# QA Environment
npm run test:qa

# Staging Environment
npm run test:staging

# UAT Environment
npm run test:uat
```

## Test Scenarios

### Authentication Tests
- Complete signup flow
- Login with valid credentials
- Login with invalid credentials
- Password reset flow

### Talent Management Tests
- Create new talent
- Edit talent information
- Delete talent
- View booking requests

### Booking Tests
- Submit booking request
- Business views booking
- Update booking status

## Test Data

### Test Database
- Separate SQLite database for tests
- Automatically reset between test runs
- Seeded with test data when needed

### Test Users
```typescript
const TEST_BUSINESS = {
  name: 'Test Business',
  email: 'test@example.com',
  password: 'Password123!'
}

const TEST_TALENT = {
  name: 'John Doe',
  basicInfo: 'Professional photographer'
}
```

## Continuous Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
```

## Test Reports

### HTML Report
- Generated after each test run
- Screenshots of failures
- Test execution timeline
- Detailed error messages

### Trace Viewer
- Record test execution
- Debug test failures
- Network requests
- Console logs

## Best Practices

### Writing Tests
1. Use descriptive test names
2. One assertion per test when possible
3. Clean up test data after each run
4. Use page objects for complex pages
5. Keep tests independent

### Test Organization
1. Group related tests in describe blocks
2. Use beforeEach for common setup
3. Use helper functions for repeated actions
4. Comment complex test scenarios

### Error Handling
1. Test both success and failure cases
2. Verify error messages
3. Test form validation
4. Check edge cases

## Debugging Tests

### Common Issues
1. Timing issues
   - Use proper wait conditions
   - Avoid arbitrary delays
2. Selector problems
   - Use data-testid attributes
   - Keep selectors simple
3. State management
   - Clean up between tests
   - Isolate test data

### Debug Commands
```bash
# Run with debug logging
DEBUG=pw:api npm test

# Run with headed browser
npm test -- --headed

# Run with slow motion
npm test -- --slow-mo=1000
```

## Performance Testing

### Metrics
- Page load time
- Time to interactive
- API response time
- Resource usage

### Tools
- Playwright built-in timing
- Lighthouse integration
- Custom performance measurements

## Security Testing

### Areas Covered
1. Authentication
   - Session management
   - Password policies
   - Token handling
2. Authorization
   - Route protection
   - Resource access
3. Data validation
   - Input sanitization
   - File upload restrictions

## Accessibility Testing

### Tools
- Playwright accessibility tools
- WAVE integration
- Manual testing with screen readers

### Standards
- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader compatibility 