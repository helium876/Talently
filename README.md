# Talently

A talent management and booking platform built with Next.js.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXTAUTH_URL`: Full URL of your application
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js

## Deployment on Vercel

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Create a new project on [Vercel](https://vercel.com)

3. Import your Git repository

4. Configure environment variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add all required environment variables from `.env.example`

5. Deploy:
   - Vercel will automatically deploy when you push to your main branch
   - You can also manually deploy from the Vercel dashboard

## Features

- User authentication with NextAuth.js
- Talent management
- Booking system
- Dashboard with analytics
- Profile management
- Responsive design

## Tech Stack

- Next.js 14
- TypeScript
- MongoDB & Mongoose
- NextAuth.js
- Tailwind CSS
- Radix UI Components
- Zod for validation

## Development

```bash
# Run development server
npm run dev

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Run linter
npm run lint
```

## License

MIT
