# Database setup for normalized Drizzle schema (fresh Neon)

This guide helps you apply the new normalized database schema to a fresh Neon Postgres database/branch and seed it with Nike products.

Recommended: use a fresh Neon database or a new branch in your existing Neon project to avoid conflicts with legacy tables or column types.

1) Create a fresh Neon database/branch
- In Neon console, create a new project or a new branch of your existing project.
- Copy the connection string (ensure SSL is enabled; Neon usually requires it).

2) Set environment variables
- Create/update .env at project root with:
  - DATABASE_URL=postgres://user:pass@host/db?sslmode=require
  - Optional (silence build warnings): BETTER_AUTH_SECRET=a-long-random-string

3) Enable pgcrypto (for UUID defaults)
- In Neon SQL editor (or psql), run:
  - CREATE EXTENSION IF NOT EXISTS "pgcrypto";

4) Apply the schema
Option A (simple)
- npm run db:push

Option B (using migration files)
- npm run db:generate
  - If drizzle-kit prompts about mapping new snake_case columns (e.g., products.category_id), choose “create column” for all newly introduced fields
- npm run db:migrate

5) Seed data
- npm run db:seed
What it does:
- Copies images from public/shoes to static/uploads/shoes
- Inserts filters (genders, colors, sizes), brand (Nike), categories, collections
- Inserts 15 Nike products with multiple variants and images

6) Verify
- See docs/sql/verification.sql for quick sanity checks
- Optional: run the app and hit GET /api/products to see seeded products

Common issues
- error: column "id" cannot be cast automatically to type uuid
  - Cause: attempting to alter an existing table’s primary key type on a legacy DB
  - Fix: use a fresh Neon DB/branch (recommended), then follow steps above

- relation "user" already exists
  - Cause: running migrations on an existing database that already has tables
  - Fix: use a fresh database/branch, or manually drop conflicting tables (not recommended for production) before applying schema

- drizzle-kit prompts about renames like “price › category_id”
  - Fix: always choose “create column” for new normalized snake_case fields to avoid incorrect renames from legacy columns
