# Visual Asset Audit

The homepage currently uses local JPEG marketing assets and HTML/CSS product UI. The JPEGs were visually inspected for obvious anatomy, vehicle, package, crop, and edge defects at their source dimensions.

| Section | Asset | Dimensions | Max current render | Status | Action |
| --- | --- | ---: | ---: | --- | --- |
| Hero | `public/images/marketing/hero-mobility-placeholder.jpg` | 1600x1200 | approximately 570x570 CSS px | PASS at current size; MARGINAL as a long-term master | Replace before campaign launch with a 2400-3200px long-edge approved master preserving the right-side rider/car composition and left negative space. |
| Rider / Ecosystem Ride | `public/images/marketing/rider-placeholder.jpg` | 1600x1066 | approximately 570x430 CSS px major image; approximately 350px mobile card | PASS at current size; MARGINAL as a long-term master | Replace before campaign launch with a 1800-2600px approved master preserving the rider-led vehicle crop. |
| Driver / Ecosystem Drive | `public/images/marketing/driver-placeholder.jpg` | 1600x1200 | approximately 570x440 CSS px | PASS at current size; MARGINAL as a long-term master | Replace before campaign launch with a 1800-2600px approved master preserving driver, steering wheel, and dashboard detail. |
| Courier / Ecosystem Deliver | `public/images/marketing/courier-placeholder.jpg` | 1600x1200 | approximately 570x440 CSS px | PASS at current size; MARGINAL as a long-term master | Replace before campaign launch with a 1800-2600px approved master preserving courier, parcel, bicycle, and street context. |
| Markets | `public/maps/lagos-urban-map.svg` | vector | responsive 4:3 map | PASS | Retain. Geographic data and attribution are documented in `public/maps/README.md`. |
| Product UI | App Showcase and section mockups | HTML/CSS/SVG | responsive | PASS | Retain as vector/text UI; do not rasterize. |
| Brand | `public/brand/mova-logo-web.png` | 900x300 | approximately 120px wide | PASS | Retain official logo. |
| Email brand | `public/mova-bimi.svg` | SVG Tiny PS, square | email-client controlled | Prepared | Static square M mark derived from supplied vector artwork; publish the BIMI DNS record only after confirming DMARC enforcement. See `docs/bimi-setup.md`. |

## Replacement briefs

### Hero

Premium realistic commercial photography of a contemporary African/Nigerian rider naturally entering a clean modern sedan in a credible urban Nigerian environment. Keep the subject and vehicle on the right to preserve the approved overlay composition and negative space on the left. Use natural daylight, realistic hands, hair, clothing, windows, wheels, reflections, and vehicle geometry. Avoid generated text, fake branding, warped vehicles, luxury-chauffeur styling, and anatomy defects. Target a genuine 2400-3200px long-edge master with a matching mobile crop.

### Rider

Premium realistic everyday urban mobility photography showing a contemporary African/Nigerian rider in or beside a clean modern vehicle. Preserve the approved rider-led crop and room for the status overlay. Use natural expressions, hands, vehicle interior, and city context. Target a genuine 1800-2600px long-edge master.

### Driver

Premium realistic driver-acquisition photography showing a confident contemporary African/Nigerian driver seated in a clean modern vehicle. Preserve room for the opportunity UI overlay. Show credible hands, steering wheel, dashboard, mirrors, windows, and vehicle geometry. Target a genuine 1800-2600px long-edge master.

### Courier

Premium realistic urban courier photography showing a professional African/Nigerian courier handling a parcel beside a credible bicycle or delivery vehicle. Preserve room for the tracking/status overlay. Ensure hands, package, straps, bicycle geometry, clothing, and street context are coherent. Target a genuine 1800-2600px long-edge master.

These assets are visually usable for the current implementation but remain placeholder-named and below the preferred master-source targets. They should receive human creative approval and replacement before public launch; no arbitrary external or copyrighted images were downloaded.
