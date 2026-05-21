# Truffle Consultant Profiles — Local Prototype

Step 1 of the rebuild. React + Vite + TypeScript app that renders the consultant
detail page in both Truffle and WWPS themes, with masked contact fields and a
working reveal modal. Data is hardcoded for now; Supabase + auth land in later steps.

## Quick start

From a Windows terminal in this folder:

    npm install
    npm run dev

Then open the URL Vite prints (usually http://localhost:5173) in your browser.

## What's here

- Directory page at `/` — lists the seeded consultants.
- Consultant detail page at `/consultants/:id` — full profile, theme-aware.
- Theme toggle in the top-right of the nav — flips between Truffle and WWPS.
- Reveal modal — click any masked field to open it. Prototype password: WWPS2026
- Two seeded consultants:
  - sidumisile-siziba (active, fully populated)
  - template-consultant (draft, placeholder text in every field — what the empty
    editor will look like when admins create a new consultant)

## Brand tokens

CSS variables on <html data-theme="..."> — see src/index.css for the full palette.

Truffle theme: Oxford Blue hero, Cyclamen->Veronica->Indigo gradient.
WWPS theme:    Black hero, Lime->Teal->Deep blue gradient.

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 3
- React Router 7
- Tabler Icons

## Not yet built (future steps)

Auth, admin visibility matrix, CV upload + AI extraction, Word .docx download,
comments, shortlist, audit log. All come in later build steps.
