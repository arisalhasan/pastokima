# Pastokima website and owner dashboard

The restaurant website runs on Vercel. Supabase provides verified owner sign-in, PostgreSQL content/history, a private media bucket, and the `pastokima-cms` Edge Function.

## Build and test

Use Node.js 22 or later. Run `npm ci`, `npm run build:vercel`, `node validate-pages.mjs`, and `npm test`.

The build generates `public/` and the shared content model in `generated/`. Original media and authored styles are under `dist/assets` and `dist/*.css`; these are source inputs and must remain tracked. `server/worker.mjs` and its tests preserve the previous prototype behavior as a regression reference; Vercel uses `api/site.mjs` and Supabase uses `server/edge-entry.mjs`.

## Owner access

The owner portal is `/owner/`. Public sign-up is disabled. Accounts must be created in Supabase Auth, have a confirmed email matching an enabled `cms_owners` row, and complete authenticator-based MFA. Every backend operation verifies the access token with Supabase Auth and checks that the session still exists. Client-supplied Sites identity headers are ignored.

Browser roles cannot access CMS tables or transactional functions. Only the Edge Function's managed service credential can access them; no service credential is stored in this repository or required in Vercel. The public project URL/key in `site-config.json` are deliberately publishable.

## Storage and publishing

Uploads go directly to the authenticated Supabase function, avoiding Vercel's request-body limit. They are validated and stored in the private `restaurant-media` bucket. Owners receive short-lived URLs for previews. Only media referenced in published content can be accessed through the public media endpoint. Published media redirects support storage-served video byte ranges.

All content changes use an actor-bound, ten-minute proposal followed by explicit confirmation. Database transactions reject stale writes and repeated confirmations are idempotent. Content history is retained for 30 days. Deleting a media upload is permanent and blocked while published content or an active proposal references it.

## Deployment

Deploy the generated `generated/edge.mjs` to the `pastokima-cms` Supabase Edge Function. The gateway JWT switch is disabled because the function serves public restaurant content; the function itself verifies tokens, owner access, MFA and live sessions before all protected actions. Exact preview origins must be added to the function configuration before testing writes there. Never allow every `vercel.app` origin.

Vercel builds from the GitHub branch. Preview and production share this one restaurant database: do not publish test edits into it; use transaction-rolled-back fixtures or restore any deliberately approved change. The original production deployment remains available for rollback.

Before production promotion, verify owner sign-in/MFA, preview/publish/restore, a photo and video upload, and desktop/mobile public pages. Confirm the authorised owner account and privacy contact details.
