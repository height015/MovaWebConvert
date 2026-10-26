# Mova Phase 3: Final Browser QA & Production-Readiness Assessment

**Document Status:** Production-Readiness Audit & Release Sign-Off Gate  
**Application:** Mova Website (`mova.ng`) — Static Vanilla HTML5 / CSS3 / ES6 Architecture  
**Canonical Generator:** [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs) · [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css) · [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js)  
**Companion Docs:** [`docs/UX_AUDIT.md`](file:///Users/joe/Documents/MovaWebConvert/docs/UX_AUDIT.md) · [`docs/UX_HANDOFF.md`](file:///Users/joe/Documents/MovaWebConvert/docs/UX_HANDOFF.md)

---

## 1. Executive Summary & Verification Methodology

This document records the comprehensive Phase 3 Quality Assurance, UX/UI, Accessibility, SEO, Performance, Security, and Content Integrity assessment of the Mova web platform prior to public production cutover.

### Verification Boundary (Completed vs. Manual Browser Execution)
Per engineering and security constraints, automated execution of `node build-vanilla.mjs` and `node server.mjs` was withheld during this pass. Every finding below is strictly categorized into:
1. **Completed Static & Codebase Verification (`[VERIFIED IN SOURCE]`):** Exhaustive line-by-line inspection of [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs), [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css), [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js), [`mova-website/server.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/server.mjs), asset inventories (`mova-website/brand/`, `mova-website/images/marketing/`, `mova-website/fonts/`), and user-provided browser screenshots (including `/safety/` emergency cards).
2. **Required Manual Rebuild & Live Browser Verification (`[MANUAL BROWSER CHECK REQUIRED]`):** Runtime checks that require running `node build-vanilla.mjs` (to propagate generator edits into the 27 static `.html` files) followed by `node server.mjs` in an interactive browser session.

---

## 2. Domain-by-Domain QA Findings (11 Core Focus Areas)

### 2.1 Navigation, Region Selector, Mobile Menu & Keyboard Focus Behavior
* **`[VERIFIED IN SOURCE]` Skip Navigation Link:** `.skip-link` in [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css#L158-L175) uses GPU-composited `transform: translateY(-200%)` → `transform: translateY(0)` on `:focus` / `:focus-visible` (eliminating `top` layout-property transitions) and targets `#main` on all 27 routes.
* **`[VERIFIED IN SOURCE]` Hidden-State Semantics (`.is-hidden`):** `#mobile-menu` and `#region-modal` in [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs#L218-L320) use the CSS class `.is-hidden` (`display: none` in [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css#L154-L156)) instead of inline `style="display: none;"`, eliminating 54 `inline-style-attribute` lint warnings across the 27 generated pages while keeping closed dialogs out of the accessibility tree.
* **`[VERIFIED IN SOURCE]` Focus Trapping & Keyboard Dismissal:** `createFocusTrap()` in [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js#L39-L84) traps `Tab` and `Shift+Tab` inside `#mobile-menu` and `#region-modal`, closes on `Escape`, locks background scroll (`document.body.classList.add('modal-open')`), and restores focus to the trigger button on close.
* **`[VERIFIED IN SOURCE]` Region Selector Badges & Keyboard Operability:** Replaced OS-dependent emoji flags (`🇳🇬`, `🇬🇭`, `🇰🇪`, `🇿🇦`, `🇬🇧`, `🌐`) with typographic ISO monogram badges (`NG`, `GH`, `KE`, `ZA`, `GB`, `GL`) styled via `.region-flag` and `.region-card-flag` (`aria-hidden="true"`), eliminating `lone-emoji-as-icon` and `emoji-in-ui` warnings. Each `.region-card` has `role="button"`, `tabindex="0"`, `aria-pressed`, and `Enter`/`Space` handlers.
* **`[MANUAL BROWSER CHECK REQUIRED]`:** Re-run `node build-vanilla.mjs`, open `http://localhost:3000`, press `Tab` through the header, open `#region-modal`, verify `Tab` cycles strictly within the modal, and press `Escape` to confirm focus returns to `#region-selector-open`.

### 2.2 Homepage Trip Simulator & Fare Calculations ("Choice Engine")
* **`[VERIFIED IN SOURCE]` Fare Formula & Mode Switching:** Implemented in [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js#L430-L535).
  * Base tariff formula: $\text{Base Fare} = \max(1200, \text{round}((850 + \text{km} \times 295) / 50) \times 50)$.
  * At default $12\text{ km}$: $\text{Base Fare} = \text{round}(4390 / 50) \times 50 = ₦4,400$; default user offer is $90\%$ rounded to nearest $₦50$ ($₦3,950$).
  * Mode switchers (`#mode-bid-btn` "Make an Offer" vs. `#mode-meter-btn` "Standard Fixed Fare") update `aria-pressed`, toggle the `#offer-controls-row` stepper (`±₦100` per click), and recalculate live driver match probability (`98% Instant Match` down to `42% Low Offer — Fewer Drivers`).
* **`[VERIFIED IN SOURCE]` Screen Reader Slider Announcements:** Distance slider (`#sim-distance-slider`) updates `aria-valuenow` and `aria-valuetext` (`"12 kilometers"`) on every `input` event.
* **`[MANUAL BROWSER CHECK REQUIRED]`:** Drag `#sim-distance-slider` from `2 km` to `45 km` and test `- ₦100` / `+ ₦100` buttons at `360px` and `1440px` viewports.

### 2.3 Driver Earnings Calculator & Interactive Service Demonstrations
* **`[VERIFIED IN SOURCE]` Driver Earnings Calculator (`/drive/`):** Implemented in [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js#L967-L1024).
  * Supports 3 vehicle tiers via `role="radio"` buttons (`.category-tier-btn`): `Mova Go` ($₦4,200$ avg. trip), `Mova Comfort` ($₦6,500$), and `Mova XL` ($₦9,800$).
  * Computes gross weekly fare ($\text{trips} \times \text{avgFare}$), Mova 10% platform fee ($0.10 \times \text{gross}$), net driver take-home ($0.90 \times \text{gross}$), and monthly savings vs. a 25% commission benchmark ($4 \times 0.15 \times \text{gross}$).
* **`[VERIFIED IN SOURCE]` Flagship Smartphone Interactive Showcase (`index.html`):**
  * 3 tabs (`#tab-btn-ride`, `#tab-btn-driver`, `#tab-btn-dispatch`) support click, `ArrowLeft`/`ArrowRight` keyboard navigation, and pause-on-hover auto-rotation (disabled when `prefers-reduced-motion: reduce` is active).
  * Interactive controls inside the phone (`Mova Go`/`Comfort`/`XL` pills, `±₦100` fare pill buttons, driver cashout button, `.dispatch-step` items, and `.phone-parcel-code` copy button) all carry keyboard `Enter`/`Space` support.

### 2.4 Courier (`/deliver/`) & Safety (`/safety/`) Pages
* **`[VERIFIED IN SOURCE]` Resolution of the 3-Card Emergency Grid Defect on `/safety/` (User Screenshot):**
  * **Root Cause:** In the user's screenshot of `/safety/` ("Direct emergency response at your fingertips"), the 3 cards (`In-App SOS Button`, `Share My Trip Link`, `24/7 Safety Command Hotline`) rendered in columns 1–3 of a 4-column grid (`.category-card-grid { grid-template-columns: repeat(4, 1fr); }`), leaving an empty 4th column on the right. Additionally, the 1st and 3rd cards shared the same shield icon.
  * **Fix Applied:** Added `.category-card-grid--3 { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }` and semantic top-border modifiers (`.category-card--accent-green`, `.category-card--accent-blue`, `.category-card--accent-rose`) in [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css#L2608-L2624), and updated [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs#L1318-L1354) so each card uses a distinct icon (`shield-fill` for In-App SOS, `path-duotone` for Share My Trip Link, `bell-fill` for 24/7 Safety Command Hotline) and spans the full 3-column container width evenly.
* **`[VERIFIED IN SOURCE]` Courier Page (`/deliver/`):** Features 3 distinct delivery vehicle tiers (`Express Bike` with `lightning-fill`, `Sedan Parcel` with `car-fill`, `Cargo Van & Truck` with `car-profile-fill`), 4-step OTP verification workflow, and B2B fleet dispatch benefits.

### 2.5 Layout Responsiveness, Overflow, Typography, Images & Interactive Controls
* **`[VERIFIED IN SOURCE]` Responsive Breakpoint Cascade (`360px`, `375px`, `430px`, `768px`, `1024px`, `1440px`):**
  * [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css) defines dedicated `@media` rules at `max-width: 1120px`, `1024px`, `960px`, `900px`, `768px`, `680px`, `640px`, and `480px`.
  * Horizontal overflow is prevented via `overflow-x: clip` on `.page-shell`, `min-width: 0` on flex/grid children, and scrollable `.comparison-table-wrap` containers (`overflow-x: auto; -webkit-overflow-scrolling: touch;`).
* **`[VERIFIED IN SOURCE]` Touch Target Compliance:** All buttons, header controls, hub filter pills (`.hub-pill-btn`), stepper controls (`.offer-step-btn`), and footer links meet or exceed the `44×44px` minimum touch target size.
* **`[VERIFIED IN SOURCE]` Typography & Local Self-Hosted Fonts:** `Plus Jakarta Sans` (`600`, `700`, `800`) and `Inter` (`400`, `500`, `600`) are self-hosted in `mova-website/fonts/` with `font-display: swap` and zero external Google Fonts dependencies.
* **`[VERIFIED IN SOURCE]` Animation & Glassmorphism Restraint:**
  * Fixed `animating-layout-properties` on `.footer-group a` ([`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css#L2450-L2458)) by replacing `transition: padding-left` with `transform: translateX(2px)`.
  * Replaced multi-comma `rgba(...)` stops in `.phone-screen-viewport::after`, `.phone-map-bg`, and `.public-steps article:not(:last-child)::after` with clean 2-stop hex-alpha gradients.
  * Restricted `backdrop-filter: blur(...)` to the 2 primary glassmorphic surfaces (`.site-header` and `.region-modal-backdrop`), replacing secondary blurs with high-contrast opaque/semi-opaque surfaces.

### 2.6 MapLibre Keyboard Accessibility & Visible Focus Indicators
* **`[VERIFIED IN SOURCE]` Scoped First-Party Focus Overrides:** Without modifying [`mova-website/css/maplibre-gl.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/maplibre-gl.css) or [`mova-website/js/maplibre-gl.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/maplibre-gl.js), [`mova-website/css/style.css`](file:///Users/joe/Documents/MovaWebConvert/mova-website/css/style.css#L1860-L1870) enforces high-visibility keyboard focus rings (`outline: 2px solid var(--mova-green-700); outline-offset: 2px; box-shadow: 0 0 0 4px rgba(0, 125, 80, 0.28);`) on:
  * `.mova-interactive-map .maplibregl-canvas:focus-visible`
  * `.mova-interactive-map .maplibregl-ctrl-group button:focus-visible`
  * `.mova-interactive-map .maplibregl-ctrl-attrib-button:focus-visible`
  * `.mova-interactive-map .maplibregl-popup-close-button:focus-visible`
  * `.mova-beacon-marker:focus-visible`
* **`[VERIFIED IN SOURCE]` Interactive Transit Hub Pills & Fallback:** Clicking any `.hub-pill-btn` (`All Lagos`, `Ikeja & Airport`, `Victoria Island`, `Lekki Phase 1`, `Yaba & Surulere`) flies the map to the hub coordinates (`flyTo` or instant `jumpTo` under `prefers-reduced-motion: reduce`) and opens the hub popup. If WebGL is unavailable, `renderFallbackMap()` renders a styled SVG fallback map.

### 2.7 SEO Metadata, Canonical URLs, Sitemap, `robots.txt` & Structured Data
* **`[VERIFIED IN SOURCE]` Meta Tags & Open Graph:** `renderHtmlShell()` in [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs#L112-L162) generates unique `<title>`, `<meta name="description">`, `<link rel="canonical">`, `<link rel="alternate" hreflang="en-ng">`, `<link rel="alternate" hreflang="x-default">`, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`), and Twitter Card (`summary_large_image`) tags for every page.
* **`[VERIFIED IN SOURCE]` JSON-LD Structured Data:** Homepage embeds valid `Organization` and `WebSite` Schema.org JSON-LD blocks.
* **`[VERIFIED IN SOURCE]` `robots.txt` & `sitemap.xml` Findings (See Risk R-02 below):**
  * `robots.txt` allows `/` and disallows `/legal/`, referencing `https://mova.ng/sitemap.xml`. However, `/en-ng/legal/` is not explicitly disallowed in `robots.txt` (though all legal HTML pages carry `<meta name="robots" content="noindex, follow">`).
  * `sitemap.xml` lists the 8 root marketing URLs (`https://mova.ng/`, `/ride`, `/drive`, `/deliver`, `/safety`, `/cities`, `/about`, `/help`) without trailing slashes, whereas internal links use directory trailing slashes (`/ride/`, `/drive/`, etc.) and `/en-ng/` localized URLs are omitted from `sitemap.xml`.

### 2.8 Core Web Vitals & Performance Opportunities
* **`[VERIFIED IN SOURCE]` Zero Render-Blocking External Requests:** CSS (`css/style.css`) and fonts (`fonts/*.woff2`) are local; `<script src="js/main.js" defer></script>` is deferred.
* **`[VERIFIED IN SOURCE]` Scoped MapLibre Loading:** `maplibre-gl.css` (`62 KB`) and `maplibre-gl.js` (`800 KB`) are loaded **only** on the homepage (`index.html` and `en-ng/index.html`) where `#mova-live-map` exists, keeping all 25 subpages lightweight.
* **`[VERIFIED IN SOURCE]` Image Dimensions & Lazy Loading:** All `<img>` tags declare explicit `width` and `height` attributes (preventing Cumulative Layout Shift / CLS). Hero images use `loading="eager"`, while below-the-fold images use `loading="lazy"`.
* **`[VERIFIED IN SOURCE]` Modern Image Format Opportunity (Non-Blocking):** The 5 marketing photographs in `mova-website/images/marketing/*.jpg` (`146 KB – 226 KB` each) are well-compressed JPEGs, and brand logos in `mova-website/brand/*.png` (`15 KB – 85 KB`) require PNG alpha transparency. Serving optional `<picture>` WebP/AVIF sources for the 5 marketing photos would save ~35–50% image transfer size on mobile networks.

### 2.9 Broken Links, Missing Assets & Browser Console Errors
* **`[VERIFIED IN SOURCE]` Asset & Link Integrity:** All internal links (`href`), image sources (`src`), font URLs, and SVG icon keys (`iconSvg(...)`) across `build-vanilla.mjs` resolve to existing files in `mova-website/`. The previously missing `thumbs-up-duotone` icon call on `/cities/` was replaced with `map-pin-fill`.
* **`[VERIFIED IN SOURCE]` Resilient Storage & Network Calls:** `safeGetStorage()` / `safeSetStorage()` wrap `localStorage` in `try/catch` blocks so private browsing or sandboxed iframes never throw `SecurityError`.

### 2.10 Privacy, Legal Content, Security Headers & Public Marketing Claims
This domain contains the primary **Launch Blockers** that require Product Owner, Legal Counsel, and DevOps sign-off before public production launch (detailed in Section 3 below):
1. **Unresolved Bracketed Legal Placeholders (`[LAUNCH BLOCKER LB-01]`):** All 4 legal templates (`/legal/terms/`, `/legal/ride/`, `/legal/delivery/`, `/legal/privacy/`) contain draft placeholders (`[MOVA LEGAL ENTITY]`, `[MOVA REGISTERED ADDRESS]`, `[MOVA COMPANY NUMBER]`, `[MOVA LEGAL EMAIL]`, `[MOVA PRIVACY EMAIL]`, `[MINIMUM USER AGE]`, `[GOVERNING LAW / JURISDICTION — COUNSEL TO CONFIRM]`, `[DATA RETENTION SCHEDULE — TO BE CONFIRMED]`) and display `"Nigeria Launch Draft v1 — Pending Final Legal Review"`.
2. **Marketing Scale & Geographic Claims vs. Launch Reality (`[LAUNCH BLOCKER LB-02]`):**
   * Homepage and `/cities/` accurately state Mova is launching first in **Lagos** (*"1 Live City: Lagos · More cities and countries coming soon"*).
   * However, `/ride/`, `/drive/`, and `/about/` still contain pre-populated scale metrics and multi-state operational claims (*"18,400+ active rides completed today"*, *"15,000+ drivers partner with Mova"*, *"₦485,000 avg. monthly net take-home in Lagos & Abuja"*, *"200 partner fuel stations across Lagos, Abuja, Port Harcourt, and Ibadan"*, *"5 driver support centers"*, *"CAC RC: 7284910"*, and full licensing in FCT, Rivers, and Ogun State).
   * **Payout Frequency Contradiction:** `/drive/` meta description and homepage showcase claim *"instant daily bank withdrawals"*, whereas `/drive/` body copy ("Weekly Bank Payouts") and `/help/` FAQ state payouts occur weekly every Monday.
3. **Client-Side Forms & Support Email Domain Alignment (`[LAUNCH BLOCKER LB-03]`):**
   * `#city-vote-form` on `/cities/` (`initCityFilters` in `js/main.js`) only resets the form and shows `#city-vote-success` locally in the browser without transmitting the vote to any backend API.
   * `#support-ticket-form` on `/help/` posts via `fetch('https://formsubmit.co/ajax/info@ridebymova.com')` and displays `info@ridebymova.com`, whereas `/deliver/` cites `business@mova.ng` and the site's canonical domain is `https://mova.ng`. Note: FormSubmit.co requires a one-time email activation click by the inbox owner of `info@ridebymova.com` before AJAX submissions are delivered.
4. **Production HTTP Security Headers (`[LAUNCH BLOCKER LB-04]`):**
   * [`mova-website/server.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/server.mjs) is a lightweight local preview server that only sets `X-Content-Type-Options: nosniff` and `Cache-Control: no-cache`. Production hosting (Cloudflare Pages / Nginx / CDN) must be configured with `Strict-Transport-Security`, `Content-Security-Policy`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and immutable caching for `/fonts/` and `/brand/`.
5. **Unconsented Third-Party GeoIP Lookup (`[RISK R-01]`):**
   * `initGeoIPAndLocale()` in [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js#L872-L890) calls `fetch('https://ipapi.co/json/')` on initial page load when `mova_region_manual` is unset. Under NDPA 2023 / GDPR, sharing visitor IP addresses with a third-party GeoIP vendor (`ipapi.co`) should either be replaced by first-party CDN edge headers (`CF-IPCountry`) or disclosed in the Privacy Policy.

### 2.11 Static-Site Generator Integrity & Root vs. Localized (`/en-ng/`) Consistency
* **`[VERIFIED IN SOURCE]` Generator Parity:** [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs) compiles all 13 root pages (`index.html`, `ride/`, `drive/`, `deliver/`, `safety/`, `cities/`, `about/`, `help/`, `legal/` + 4 subpages) and mirrors the exact same 13 pages into `en-ng/` with relative path prefix adjustment (`../`, `../../`, `../../../`), plus `404.html` (27 total HTML files), `js/main.js`, `robots.txt`, and `sitemap.xml`.
* **`[MANUAL BROWSER CHECK REQUIRED]` Rebuild Step Required:** Because `node build-vanilla.mjs` was not auto-executed during this session, the latest template updates in [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs) (`.is-hidden` classes, ISO monogram badges, `/safety/` 3-card classes) must be compiled into the 27 static HTML files by running `cd mova-website && node build-vanilla.mjs` before deploying.

---

## 3. Launch Blockers & Unresolved Risks Register

| ID | Severity | Category | Description & Affected Files | Required Remediation Before Launch |
| :--- | :--- | :--- | :--- | :--- |
| **LB-01** | **Blocker** | Legal & Compliance | Bracketed placeholders (`[MOVA LEGAL ENTITY]`, `[MOVA REGISTERED ADDRESS]`, `[MOVA COMPANY NUMBER]`, `[MOVA LEGAL EMAIL]`, `[MOVA PRIVACY EMAIL]`, `[MINIMUM USER AGE]`, `[GOVERNING LAW]`, `[DATA RETENTION SCHEDULE]`) in [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs#L2795-L3420). | Legal counsel must supply final entity registration details, replace all `[...]` tokens in `legalDocuments` in `build-vanilla.mjs`, and remove `"Pending Final Legal Review"` banners. |
| **LB-02** | **Blocker** | Marketing & Consumer Trust | Unverified operational scale claims on `/ride/`, `/drive/`, and `/about/` (*"18,400+ active rides today"*, *"15,000+ drivers"*, *"200 partner fuel stations"*, *"CAC RC: 7284910"*) and payout frequency contradiction (*"instant daily withdrawals"* vs. *"Weekly Bank Payouts every Monday"*). | Product/Marketing must align `/ride/`, `/drive/`, and `/about/` with launch-day reality (Lagos initial launch) and standardize driver payout schedule copy across `/drive/` and `/help/`. |
| **LB-03** | **Blocker** | Functional Backend / Forms | `#city-vote-form` on `/cities/` has no backend persistence (local UI reset only). `#support-ticket-form` on `/help/` posts to `formsubmit.co/ajax/info@ridebymova.com` (requires inbox activation and uses `ridebymova.com` instead of `mova.ng`). | Connect `#city-vote-form` and `#support-ticket-form` to verified first-party API endpoints (or confirm `info@ridebymova.com` / `support@mova.ng` FormSubmit activation). |
| **LB-04** | **Blocker** | Infrastructure & Security | [`mova-website/server.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/server.mjs) is a development preview server lacking HSTS, CSP, X-Frame-Options, Referrer-Policy, Permissions-Policy, Gzip/Brotli compression, and asset caching headers. | Deploy static output behind Cloudflare Pages / AWS CloudFront / Nginx with production security headers, or harden `server.mjs` if Node.js serves production traffic. |
| **R-01** | **Medium Risk** | Privacy & Rate Limits | Client-side `fetch('https://ipapi.co/json/')` in [`mova-website/js/main.js`](file:///Users/joe/Documents/MovaWebConvert/mova-website/js/main.js#L873) exposes visitor IP to a third-party service and is subject to free-tier rate limits (`1,000 req/day`). | Replace with CDN edge header detection or remove automatic remote GeoIP fetch (defaulting to `en-ng` with manual `#region-modal` selection). |
| **R-02** | **Medium Risk** | SEO & Indexing | `sitemap.xml` omits trailing slashes (`/ride` vs `/ride/`), omits `/en-ng/` localized URLs, and `robots.txt` disallows `/legal/` but not `/en-ng/legal/`. | Update `sitemap.xml` and `robots.txt` generator blocks in [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs#L4648-L4698) to use canonical trailing-slash URLs and add `Disallow: /en-ng/legal/`. |
| **R-03** | **Low Risk** | Performance / CWV | Marketing JPEGs (`images/marketing/*.jpg`, `146–226 KB`) do not yet have WebP/AVIF `<picture>` sources; commercial photography remains stock/placeholder-named. | Generate `.webp`/`.avif` variants for the 5 marketing hero images and replace with commissioned Lagos photography when available. |

---

## 4. Pre-Release Checklist & Manual Verification Commands

### Step 1: Compile Static Pages from Canonical Generator
Run the static generator to propagate all CSS/HTML/JS fixes in [`mova-website/build-vanilla.mjs`](file:///Users/joe/Documents/MovaWebConvert/mova-website/build-vanilla.mjs) to the 27 `.html` files and `js/main.js`:

```bash
cd mova-website
node build-vanilla.mjs
```

### Step 2: Launch Local Preview Server
```bash
cd mova-website
node server.mjs
```
Open `http://localhost:3000` in your browser.

### Step 3: Interactive Browser QA Checklist
- [ ] **Safety Page 3-Card Layout (`/safety/#emergency-hotline`):** Verify that `In-App SOS Button` (green top accent, shield icon), `Share My Trip Link` (blue top accent, route icon), and `24/7 Safety Command Hotline` (rose top accent, bell icon) span the full container width in an even 3-column grid at `1440px` and `1024px`, and stack cleanly at `375px`.
- [ ] **Header & Region Modal (`/` and `/en-ng/`):** Verify that the region button displays the `NG` monogram badge + `Nigeria (EN)`, opens `#region-modal` without inline-style FOUC, traps `Tab` focus, filters regions via `#region-search-input`, and closes on `Escape`.
- [ ] **Mobile Navigation Drawer (`360px` / `375px` / `430px`):** Open `#mobile-menu`, confirm background scroll is locked, verify all nav links and the mobile region button meet `44×44px` touch targets, and close via `Escape` or the close button.
- [ ] **Homepage Choice Engine & MapLibre Focus (`/`):** Test the distance slider (`2–45 km`) and `±₦100` offer buttons. Press `Tab` into `#mova-live-map` and verify that the map canvas, zoom `+`/`-` buttons, attribution button, and transit hub beacons show the `2px solid var(--mova-green-700)` focus ring.
- [ ] **Driver Earnings Calculator (`/drive/`):** Switch between `Mova Go`, `Mova Comfort`, and `Mova XL` radio buttons and drag `#drive-trips-slider` (`10–120 trips/week`). Confirm live Naira totals update accurately.
- [ ] **City Directory & Help Center (`/cities/`, `/help/`):** Filter cities by `Active Now (1)`, `NG Nigeria (7)`, and `International Roadmap (4)`. Search FAQs on `/help/` and verify the `#no-faq-results` empty state toggles cleanly via `.is-hidden`.
- [ ] **Sign-Off on Launch Blockers (`LB-01` through `LB-04`):** Confirm Legal, Product, and DevOps owners have resolved the bracketed legal placeholders, marketing scale claims, form endpoints, and production HTTP security headers prior to DNS cutover.

