# Mova Website

Phase 1 public marketing site for Mova, built with pure **Vanilla HTML5, modern CSS3, and JavaScript** (zero framework dependencies, maximum performance, pure web standards).

## Local Development

You can run the site in any of the following ways:

### Option 1: Built-in zero-dependency Node server
```bash
npm run dev
# or: node server.mjs
```
Then open `http://localhost:3000` in your browser.

### Option 2: Direct browser opening
Open `index.html` directly in any web browser without needing any server at all.

### Option 3: Any static web server
```bash
npx serve .
# or: python3 -m http.server 3000
```

## Rebuilding from Source

If you ever wish to modify site copy, legal text, or templates programmatically, you can run:
```bash
npm run build
# or: node build-vanilla.mjs
```
This regenerates all static HTML pages, updates inline SVG icons, and refreshes sitemap/robots.

## Project Structure

```
├── index.html            # Main homepage
├── ride/index.html       # Ride with Mova page
├── drive/index.html      # Drive with Mova page
├── deliver/index.html    # Mova Delivery page
├── safety/index.html     # Safety at Mova page
├── cities/index.html     # Mova Markets / Footprint page
├── about/index.html      # About Mova page
├── help/index.html       # Mova Help center
├── legal/
│   ├── index.html        # Legal Center index
│   ├── terms/index.html  # General Terms of Use
│   ├── ride/index.html   # Ride Terms
│   ├── delivery/index.html # Delivery & Courier Terms
│   └── privacy/index.html# Privacy Policy
├── 404.html              # Custom Not Found error page
├── robots.txt            # Search engine directives
├── sitemap.xml           # XML sitemap for SEO
├── css/
│   └── style.css         # Complete vanilla CSS with custom properties & animations
├── js/
│   └── main.js           # Vanilla JS for mobile nav, animations & interactive elements
├── brand/                # Brand logos, animated SVGs, favicons
├── images/marketing/     # High-resolution marketing photography
├── maps/                 # Urban map vector assets
├── docs/                 # Operational, legal, and launch documentation
├── server.mjs            # Zero-dependency local dev server
└── build-vanilla.mjs     # Standalone static page compiler
```

## Features & Highlights

- **Pure Web Standards**: Zero runtime dependencies, no bundler overhead, instant page loads.
- **Rich Aesthetics**: Custom gradient treatments, micro-animations, glassmorphism, tailored color palettes.
- **Responsive Design**: Fluid typography, desktop navigation, and a slide-out mobile drawer with keyboard escape and focus trap.
- **Interactive UI**: Working offer counter (`+`/`-`), interactive FAQ accordion, viewport-triggered animations.
- **SEO & Social Optimized**: Comprehensive Open Graph tags, Twitter Card tags, canonical links, and Schema.org JSON-LD structured data.
- **Complete Legal Center**: All Nigeria Launch Draft legal documents with sticky Table of Contents navigation.
