# CollegeDiscover

Track B submission (College Discovery Platform), built as a full-stack MVP.

The goal of this project is simple: help students discover colleges, compare options side by side, and make better decisions using structured data.

## What this app includes

- College listing with search, filters, sorting, and pagination
- College detail pages with overview, courses, placements, and reviews
- Side-by-side comparison for up to 3 colleges
- Predictor tool (exam + rank/score based recommendations)
- Authentication (register/login/logout using JWT in httpOnly cookies)
- Saved colleges
- Saved comparison sets (for logged-in users)

## Stack

- Frontend: Next.js, React, TypeScript, TailwindCSS
- Backend: Next.js API routes (Node runtime)
- Database: PostgreSQL + Prisma ORM
- Auth: `jose` + `bcryptjs`
- Validation: `zod`

## Local setup

### 1) Install dependencies

```bash
npm install
```

### 2) Create env file

Create `.env` from `.env.example` and set:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/college_discovery"
JWT_SECRET="replace-with-a-long-random-secret"
```

If you are using Neon:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/college_discovery?sslmode=require"
```

### 3) Push schema and seed data

```bash
npm run db:push
npm run db:seed
```

### 4) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

Demo login:
- email: `demo@example.com`
- password: `demo1234`

## Main API routes

- `GET /api/colleges` - search/filter/sort/paginated list
- `GET /api/colleges/[slug]` - college details
- `GET /api/predictor` - recommendations by exam + rank/score
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/saved`
- `POST /api/saved`
- `DELETE /api/saved/[collegeId]`
- `GET /api/comparisons`
- `POST /api/comparisons`

## Architecture notes

- I kept frontend + backend in one Next.js codebase to move fast and keep context switching low.
- Prisma is used for type-safe querying and schema evolution.
- API responses include validation and graceful error cases for malformed input and auth failures.
- Seed script is idempotent for core college/course/placement data so repeated seeding does not keep duplicating child rows.

## Assignment mapping (Track B)

Implemented strongly:
- Feature 1: College Listing + Search
- Feature 2: College Detail Page
- Feature 3: Compare Colleges
- Feature 4: Predictor Tool
- Feature 6: Authentication + Saved Items

Not implemented in this version:
- Feature 5: Q&A / Discussion

The assignment asks for any 3 to 4 features done well; this project covers more than that with full-stack integration.

## Deployment

Recommended: Vercel + Neon Postgres

1. Push repo to GitHub
2. Import on Vercel
3. Create Neon Postgres database
4. Add `DATABASE_URL` and `JWT_SECRET` in Vercel project settings
5. Deploy

## Submission checklist

- [ ] Live URL
- [ ] GitHub repository URL
- [ ] 5-10 minute Loom walkthrough (architecture, feature demo, edge cases, tradeoffs)
