# Mova Public Website Launch Readiness

## Technical

- [x] `npm ci` clean install
- [x] `npm run lint`
- [x] `npm run typecheck`
- [x] `npm run build`
- [x] Production `npm start` smoke test
- [x] Public route direct-load and refresh checks
- [x] Branded 404
- [x] `robots.txt` and `sitemap.xml`
- [x] Security response headers
- [x] Mobile navigation and body-scroll behavior
- [x] Mobile snap carousels
- [x] Reduced-motion final states
- [x] No known Mova console/runtime errors
- [x] No page-level horizontal overflow in verified viewports
- [x] Responsive production smoke at 360, 390, 768, 1024, 1280, and 1440px
- [x] Production metadata, canonical, and Open Graph smoke checks
- [x] Production map, Driver Match, Driver Opportunity, and App Showcase review
- [x] Production reduced-motion review
- [x] Production dependency tree review

## Content and Assets

- [ ] Approved Hero desktop/mobile photography
- [ ] Approved Rider photography
- [ ] Approved Driver photography
- [ ] Approved Courier photography
- [ ] Approved social/Open Graph asset

## Configuration

- [ ] Final production domain in `NEXT_PUBLIC_SITE_URL`
- [ ] Final iOS App Store URL
- [ ] Final Android Google Play URL
- [ ] Approved Driver onboarding URL
- [ ] Approved Courier onboarding URL
- [x] Missing acquisition URLs degrade to truthful internal fallbacks

## Legal

- [ ] Approved Privacy Policy
- [ ] Approved Terms
- [x] Pending legal routes remain `noindex`

## Deployment

- [x] Node-compatible production start command: `npm start`
- [x] Build command: `npm run build`
- [x] Runtime port uses the hosting `PORT` environment variable
- [x] Staging indexing policy is environment-aware
- [ ] HTTPS and final DNS/domain verification

## Post-deployment

- [ ] Homepage smoke test on final domain
- [ ] Secondary route smoke test on final domain
- [ ] Canonical and Open Graph domain verification
- [ ] Store and onboarding CTA verification
- [ ] Production console/network review
- [x] Local production console/network review

## Notes

The public website is intentionally static/server-rendered and does not require the operational Mova API for normal content rendering. The production dependency audit currently reports a PostCSS advisory inherited through the pinned Next.js version; resolving it requires a breaking Next.js upgrade and should be handled as a separate dependency-maintenance task.

Final photography, legal copy, store URLs, onboarding URLs, and production domain are external launch inputs, not fabricated by this repository.