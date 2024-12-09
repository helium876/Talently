# Talently Platform Documentation

## Overview
Talently is a SaaS platform that enables businesses to showcase and manage their talents, allowing clients to discover and book services. This documentation covers the technical implementation, testing procedures, and deployment processes.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Testing Strategy](#testing-strategy)
4. [Deployment Pipeline](#deployment-pipeline)
5. [API Documentation](#api-documentation)

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- SQLite (for development)

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Initialize database
npx prisma db push

# Start development server
npm run dev
```

## Architecture

### Technology Stack
- **Frontend**: Next.js 15.x with React 19
- **Styling**: TailwindCSS
- **Database**: SQLite (Development) / PostgreSQL (Production)
- **ORM**: Prisma
- **Authentication**: Custom JWT implementation

### Key Components
1. **Authentication System**
   - JWT-based session management
   - Secure password hashing with bcrypt
   - Password reset functionality

2. **Business Dashboard**
   - Profile management
   - Talent CRUD operations
   - Booking request management

3. **Public Pages**
   - Talent listings
   - Booking request submission
   - Business profiles

## Testing Strategy

### Test Environments

1. **QA Environment**
   - URL: http://qa.example.com
   - Purpose: Initial testing and bug catching
   - Database: Separate QA database
   - Run tests: `npm run test:qa`

2. **Staging Environment**
   - URL: http://staging.example.com
   - Purpose: Production-like testing
   - Database: Production clone
   - Run tests: `npm run test:staging`

3. **UAT Environment**
   - URL: http://uat.example.com
   - Purpose: Client acceptance testing
   - Database: Production clone
   - Run tests: `npm run test:uat`

### Test Categories

1. **End-to-End Tests**
   ```bash
   # Run all E2E tests
   npm test
   
   # Run specific test suite
   npm test tests/e2e/auth.test.ts
   ```

2. **Test Coverage**
   - Authentication flows
   - Business operations
   - Talent management
   - Booking processes
   - Error handling

### Test Reports
- HTML reports are generated after each test run
- View reports: `npm run test:report`
- Reports include screenshots of failures
- Trace files for debugging

## Deployment Pipeline

### Development → QA
1. Code push to development branch
2. Automated tests run
3. Deploy to QA environment
4. Run QA test suite
5. Manual QA testing

### QA → Staging
1. QA approval
2. Merge to staging branch
3. Deploy to staging environment
4. Run staging test suite
5. Performance testing

### Staging → UAT
1. Staging approval
2. Deploy to UAT environment
3. Run UAT test suite
4. Client testing and feedback

### UAT → Production
1. Client approval
2. Merge to main branch
3. Deploy to production
4. Smoke tests
5. Monitoring

## API Documentation

### Server Actions
All interactions use Next.js Server Actions for enhanced security:

1. **Authentication**
   - `signUp(formData)`
   - `login(formData)`
   - `requestPasswordReset(formData)`
   - `resetPassword(formData)`

2. **Talent Management**
   - `createTalent(formData)`
   - `updateTalent(formData)`
   - `deleteTalent(id)`

3. **Booking**
   - `submitBookingRequest(formData)`
   - `updateBookingStatus(id, status)`

### Data Models

1. **Business**
   ```prisma
   model Business {
     id               String    @id @default(cuid())
     email            String    @unique
     password         String
     name             String
     logoPath         String?
     resetToken       String?   @unique
     resetTokenExpires DateTime?
     createdAt        DateTime  @default(now())
     updatedAt        DateTime  @updatedAt
     talents          Talent[]
   }
   ```

2. **Talent**
   ```prisma
   model Talent {
     id          String   @id @default(cuid())
     name        String
     basicInfo   String
     imagePath   String?
     businessId  String
     business    Business @relation(fields: [businessId], references: [id])
     bookings    BookingRequest[]
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```

3. **BookingRequest**
   ```prisma
   model BookingRequest {
     id          String   @id @default(cuid())
     clientName  String
     clientEmail String
     message     String
     status      String   @default("pending")
     talentId    String
     talent      Talent   @relation(fields: [talentId], references: [id])
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
   }
   ```