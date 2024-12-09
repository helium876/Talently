# Talently

A platform for managing talent bookings and scheduling.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Testing**: Jest & Playwright
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: Secret for NextAuth.js
- `NEXTAUTH_URL`: URL for NextAuth.js

## Project Structure

- `src/app/*`: App router pages and layouts
- `src/components/*`: React components
- `src/lib/*`: Utility functions and configurations
- `src/models/*`: Mongoose models
- `src/hooks/*`: Custom React hooks
- `src/types/*`: TypeScript type definitions

## Testing

- Run unit tests: `npm test`
- Run E2E tests: `npm run test:e2e`

## License

MIT
