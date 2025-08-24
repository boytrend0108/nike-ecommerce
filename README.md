# Nike E-commerce

## Database setup and seeding

- Ensure .env contains:
  - DATABASE_URL pointing to your Postgres/Neon instance (sslmode=require if needed)
  - Optional: BETTER_AUTH_SECRET to silence build warnings

- Apply schema:
  - npm run db:push
    - If you choose to generate migration files first: npm run db:generate
      - When prompted by drizzle-kit about mapping new snake_case columns (e.g., products.category_id), choose “create column” for all new fields introduced by the normalized schema.
    - Or apply migrations via: npm run db:migrate

- Seed data:
  - npm run db:seed
  - Or run both in one go: npm run db:setup

The seed will:
- Copy images from public/shoes to static/uploads/shoes
- Insert filters (genders, colors, sizes), brand (Nike), categories, collections
- Create 15 Nike products with multiple variants and images


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
