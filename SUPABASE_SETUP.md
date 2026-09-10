# PASHU SHIELD — Supabase Database Setup

This version is prepared to use Supabase PostgreSQL for persistent case data. If Supabase is not configured yet, the app falls back to browser local storage so the demo still runs.

## 1. Create a Supabase project

Create a project in Supabase, then open the project's **Connect** dialog and copy the Project URL and Publishable Key.

## 2. Create the database table

Open **SQL Editor** in the Supabase dashboard and run the complete contents of:

`supabase/schema.sql`

This creates the `cases` table, indexes, demo seed records, and demo-stage RLS policies.

## 3. Configure the React app

Copy `.env.example` to `.env.local` and fill in:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Never put a Supabase secret/service-role key in this browser app.

## 4. Install and run

```bash
npm install
npm run dev
```

## 5. Test persistence

1. Open the Farmer dashboard.
2. Submit a health report.
3. Send it to the veterinary dashboard.
4. Open Priority Cases.
5. Refresh the browser.
6. The submitted case should still be present because it is stored in Supabase.

### Security note

The included policies are intentionally simple for an SIH prototype. They allow demo-stage anonymous read/insert/update access. Before production deployment, add Supabase Auth and restrict rows with proper RLS policies tied to the authenticated user/role.
