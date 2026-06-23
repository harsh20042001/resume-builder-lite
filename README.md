# Resume Builder Lite

A lean, sellable resume builder. Create resumes in 5 global formats (ATS, US,
Europe, India, Fresher), preview live, and export clean PDFs. One-time ₹999
unlock — no subscriptions.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** for styling
- **Supabase** (Postgres + Auth) for data and magic-link sign-in
- **Razorpay** for one-time payments
- **@react-pdf/renderer** for PDF export
- **Anthropic API (Claude)** for the cover letter generator

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In the SQL Editor, paste and run `supabase/migrations/0001_init.sql`.
3. Go to Project Settings → API and copy your `URL`, `anon public` key, and
   `service_role` key.
4. Go to Authentication → Providers and make sure Email is enabled with
   "Magic Link" (it's on by default).
5. Go to Authentication → URL Configuration and add your local/deployed URL
   (e.g. `http://localhost:3000`, and later your production domain) plus
   `/auth/callback` as a redirect URL.

### 3. Create a Razorpay account

1. Go to [razorpay.com](https://razorpay.com) and sign up (test mode is fine
   to start).
2. Settings → API Keys → generate a key pair.
3. Settings → Webhooks → add a webhook pointing to
   `https://yourdomain.com/api/razorpay/webhook`, subscribed to the
   `payment.captured` event. Copy the webhook secret.
   - For local testing, use a tool like `ngrok` to expose `localhost:3000`
     and point the webhook there temporarily.

### 4. Get an Anthropic API key

Go to [console.anthropic.com](https://console.anthropic.com), create an API
key. This powers the cover letter generator only — the app works fine
without it, that one feature will just fail gracefully.

### 5. Set environment variables

```bash
cp .env.local.example .env.local
```

Fill in every value in `.env.local` from the steps above.

### 6. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000`.

## Project structure

```
app/
  (marketing)/        # landing page, pricing — public, no auth required
  (app)/               # dashboard, editor, preview, cover-letter — auth required
  api/                 # route handlers: PDF export, cover letter, Razorpay
  login/               # magic-link sign-in
  auth/callback/       # Supabase auth code exchange
components/
  editor/              # one form component per resume section
  templates/           # the format-driven document renderer
  ui/                  # shared Button, Modal, Badge, Field primitives
lib/
  formatConfig.ts      # the entire format rules engine — start here
  pdfDocument.tsx      # react-pdf version of the document renderer
  supabase/            # browser + server Supabase clients
types/
  resume.ts            # all resume data shapes
supabase/migrations/    # SQL schema + RLS policies
```

## How the format system works

`lib/formatConfig.ts` is the only place format-specific rules live. Each of
the 5 formats (ATS / US / Europe / India / Fresher) is a config object
defining section order, photo visibility, date format, and labels. Both
`components/templates/ResumeDocument.tsx` (on-screen preview) and
`lib/pdfDocument.tsx` (PDF export) read this same config — so adding a 6th
format later means adding one config entry, not new rendering logic.

Visual templates (Classic, Minimal, Modern, etc.) are a separate concern —
they only change fonts/colors/spacing, never section order or content rules.

## Deploying

This is built for [Vercel](https://vercel.com):

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add all the same environment variables from `.env.local` in the Vercel
   project settings.
4. Update your Razorpay webhook and Supabase redirect URLs to point at your
   production domain once deployed.

## Known simplifications (by design, for a lean MVP)

- Section data is stored as a single `jsonb` blob per resume rather than
  normalized tables — simpler schema, fewer joins, fine at this scale.
- Free-tier resume/format limits are enforced both in the UI and at the
  PDF-export API level, but not yet at the database level via a Postgres
  check constraint — fine for V1, consider adding if you see abuse.
- Only 2 of the 6 templates are fully differentiated by style in this build
  (Classic and Minimal have distinct treatments; the rest reuse the shared
  renderer with different color/weight tokens). Expand `TEMPLATE_STYLES` in
  `ResumeDocument.tsx` and the matching `styles` object in `pdfDocument.tsx`
  to give each template a more distinct layout.
