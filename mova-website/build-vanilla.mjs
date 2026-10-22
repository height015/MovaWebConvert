import fs from "node:fs";
import path from "node:path";

// 1. Icon definitions
const iconsNeeded = [
  { name: "Car", weight: "fill", id: "car-fill" },
  { name: "Car", weight: "duotone", id: "car-duotone" },
  { name: "ChatCircleDots", weight: "duotone", id: "chat-duotone" },
  { name: "ChatCircleDots", weight: "regular", id: "chat-regular" },
  { name: "CheckCircle", weight: "fill", id: "check-fill" },
  { name: "CheckCircle", weight: "duotone", id: "check-duotone" },
  { name: "CurrencyCircleDollar", weight: "duotone", id: "dollar-duotone" },
  { name: "DeviceMobile", weight: "duotone", id: "mobile-duotone" },
  { name: "LockKey", weight: "duotone", id: "lock-duotone" },
  { name: "LockKey", weight: "regular", id: "lock-regular" },
  { name: "MapPinLine", weight: "fill", id: "mappin-line-fill" },
  { name: "MapPinLine", weight: "bold", id: "mappin-line-bold" },
  { name: "NavigationArrow", weight: "duotone", id: "navigation-duotone" },
  { name: "NavigationArrow", weight: "fill", id: "navigation-fill" },
  { name: "Package", weight: "regular", id: "package-regular" },
  { name: "Package", weight: "duotone", id: "package-duotone" },
  { name: "ShieldCheck", weight: "fill", id: "shield-fill" },
  { name: "ShieldCheck", weight: "regular", id: "shield-regular" },
  { name: "ShieldCheck", weight: "duotone", id: "shield-duotone" },
  { name: "UserFocus", weight: "regular", id: "user-regular" },
  { name: "List", weight: "bold", id: "list-bold" },
  { name: "X", weight: "bold", id: "x-bold" },
  { name: "ArrowLeft", weight: "regular", id: "arrow-left" },
  { name: "ArrowUpRight", weight: "bold", id: "arrow-up-right" },
  { name: "ArrowRight", weight: "regular", id: "arrow-right" },
  { name: "CarProfile", weight: "fill", id: "car-profile-fill" },
  { name: "MapPin", weight: "fill", id: "map-pin-fill" },
  { name: "Star", weight: "fill", id: "star-fill" },
  { name: "Bell", weight: "fill", id: "bell-fill" },
  { name: "Handshake", weight: "duotone", id: "handshake-duotone" },
  { name: "MapTrifold", weight: "regular", id: "map-trifold" },
  { name: "Minus", weight: "regular", id: "minus" },
  { name: "Plus", weight: "regular", id: "plus" },
  { name: "Path", weight: "duotone", id: "path-duotone" }
];

function renderChild(node) {
  if (!node) return "";
  if (Array.isArray(node)) return node.map(renderChild).join("");
  if (node.props && node.props.children) {
    if (Array.isArray(node.props.children)) return node.props.children.map(renderChild).join("");
    return renderChild(node.props.children);
  }
  const tag = node.type || "path";
  const props = node.props || {};
  const attrs = Object.entries(props)
    .filter(([k]) => k !== "children" && k !== "key")
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `<${tag} ${attrs}/>`;
}

async function loadIcons() {
  if (fs.existsSync("icons.json")) {
    return JSON.parse(fs.readFileSync("icons.json", "utf8"));
  }
  const icons = {};
  for (const item of iconsNeeded) {
    const mod = await import(`./node_modules/@phosphor-icons/react/dist/defs/${item.name}.es.js`);
    const defs = mod.default;
    const weightNode = defs.get(item.weight);
    icons[item.id] = renderChild(weightNode);
  }
  return icons;
}

const icons = await loadIcons();

function iconSvg(id, size = 20, extraClass = "") {
  const content = icons[id];
  if (!content) return "";
  const cls = extraClass ? ` class="${extraClass}"` : "";
  return `<svg${cls} width="${size}" height="${size}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${content}</svg>`;
}

// 2. Data from existing project configs
const siteConfig = {
  name: "Mova",
  url: "https://mova.ng",
  description: "Choose how you move with flexible ride pricing, driver opportunities, and delivery—all in one Mova app.",
  nav: [
    { label: "Ride", slug: "ride" },
    { label: "Drive", slug: "drive" },
    { label: "Deliver", slug: "deliver" },
    { label: "Safety", slug: "safety" },
    { label: "Cities", slug: "cities" },
    { label: "About", slug: "about" },
    { label: "Help", slug: "help" },
  ],
  footerGroups: [
    { title: "Mova", links: [["About", "about/"], ["Safety", "safety/"], ["Cities", "cities/"]] },
    { title: "Ride", links: [["Ride with Mova", "ride/"], ["Help", "help/"]] },
    { title: "Earn", links: [["Drive", "drive/"], ["Deliver", "deliver/"]] },
    { title: "Legal", links: [["Legal Center", "legal/"], ["Privacy Draft", "legal/privacy/"], ["Terms Draft", "legal/terms/"]] },
  ]
};

const publicPages = {
  ride: {
    eyebrow: "Ride with Mova",
    title: "Move on your terms.",
    description: "Your ride. Your price. Your choice. Mova gives Riders three clear ways to choose before every request.",
    variant: "ride",
    sections: [
      { title: "Make an Offer", body: "Suggest a fare within Mova’s supported pricing boundaries. Drivers may accept or respond with a counteroffer where the product permits." },
      { title: "Fixed Price", body: "See and agree to a supported upfront price before the trip begins, so the decision is clear before you request." },
      { title: "Metered Ride", body: "The final fare reflects the actual journey according to Mova’s metered pricing model, including the trip context." },
    ],
    steps: ["Choose a destination", "Choose how you want to ride", "Review the available trip information", "Take the trip and complete the journey"],
    cta: { label: "Get Mova", href: "/#get-mova" },
    secondaryCta: { label: "Explore Safety", href: "safety/" },
  },
  drive: {
    eyebrow: "Drive with Mova",
    title: "Your time. Your opportunities.",
    description: "Explore Driver opportunities, review useful trip information, and make informed choices through the Mova experience.",
    variant: "drive",
    sections: [
      { title: "Useful trip information", body: "Mova is designed to keep relevant pickup, destination, and offer context visible before a supported request is accepted." },
      { title: "Choice where supported", body: "Drivers may accept or respond to an offer where the product and market support that flow. Availability is not a promise of earnings." },
      { title: "One platform", body: "Ride, communication, support, and safety context come together in one Mova experience." },
    ],
    steps: ["Review an opportunity", "See the available trip context", "Accept or respond where supported", "Complete the trip through Mova"],
    cta: { label: "Driver information", href: "help/" },
    secondaryCta: { label: "Explore Safety", href: "safety/" },
  },
  deliver: {
    eyebrow: "Mova Delivery",
    title: "Move packages through the city.",
    description: "A clear delivery experience for people sending packages and Couriers moving them through the city.",
    variant: "deliver",
    sections: [
      { title: "Send with Mova", body: "Create a delivery request, provide pickup and recipient information, and follow the delivery lifecycle where supported." },
      { title: "Recipient experience", body: "Recipients who use Mova may participate in the supported in-app delivery experience. External recipients should not be assumed to have app access." },
      { title: "Deliver with Mova", body: "Couriers can explore delivery opportunities, pickup information, recipient handoff, and completion through an approved Mova flow when available." },
    ],
    steps: ["Create the delivery", "Enter pickup and recipient information", "Courier assignment and active tracking", "Recipient handoff and completion"],
    cta: { label: "Get Mova", href: "/#get-mova" },
    secondaryCta: { label: "Courier information", href: "help/" },
  },
  safety: {
    eyebrow: "Safety at every step",
    title: "Keep the important trip details visible.",
    description: "Mova approaches Safety through trip visibility, account care, communication, reporting, and support access.",
    variant: "safety",
    sections: [
      { title: "Trip visibility", body: "Follow relevant journey details during an active service and keep the context of the trip close at hand." },
      { title: "Account security", body: "Account access and personal information should be handled through Mova’s approved product and identity flows." },
      { title: "Communication and support", body: "Use supported communication and reporting paths when you need help. This website does not make a guarantee of safety." },
    ],
    steps: ["Review the trip context", "Stay connected through supported communication", "Share or report through available product paths", "Use Help when you need support"],
    cta: { label: "Get Mova", href: "/#get-mova" },
    secondaryCta: { label: "Visit Help", href: "help/" },
  },
  about: {
    eyebrow: "About Mova",
    title: "Mobility made around choice.",
    description: "Mova brings Ride, Drive, and Delivery experiences together in one public brand, launching first in Nigeria and designed for more markets over time.",
    variant: "about",
    sections: [
      { title: "Why choice matters", body: "Different journeys call for different ways to move. Mova makes those choices clearer before the journey begins." },
      { title: "One ecosystem", body: "Riders, Drivers, and Couriers are part of a connected mobility and delivery platform built around useful information." },
      { title: "Nigeria first", body: "Nigeria is Mova’s first launch market. Future country and service availability will be communicated through approved public content." },
    ],
    cta: { label: "Explore Ride", href: "ride/" },
    secondaryCta: { label: "See markets", href: "cities/" },
  },
  help: {
    eyebrow: "Mova Help",
    title: "Find the right place to start.",
    description: "A focused public help foundation for understanding Mova’s Ride, Drive, Delivery, Account, and Safety paths.",
    variant: "help",
    sections: [
      { title: "Riding", body: "Learn about Make an Offer, Fixed Price, Metered Ride, and the information shown before a request." },
      { title: "Driving and Delivery", body: "Review the public product explanations before using an approved Mova onboarding experience." },
      { title: "Account and Safety", body: "For account or incident support, use the in-app support path where available. No public support contact is configured yet." },
    ],
    cta: { label: "Explore Ride", href: "ride/" },
    secondaryCta: { label: "Get Mova", href: "/#get-mova" },
  },
};

const draftNote = "Nigeria Launch Draft v1 — Pending Final Legal Review";
const draftDate = "Draft generated 15 September 2026";

const legalDocuments = [
  {
    slug: "terms",
    title: "General Terms of Use",
    summary: "Platform-wide terms for using Mova technology and marketplace services in the Nigeria launch context.",
    sections: [
      { id: "agreement", title: "1. Agreement and scope", paragraphs: [`${draftNote}. These General Terms govern access to and use of the Mova website, mobile applications, platform services, and related technology features. Service-specific terms may supplement these Terms. Creating an account or using an applicable Mova service means you agree to the documents that apply to that use.`] },
      { id: "definitions", title: "2. Key definitions", paragraphs: ["Mova means the technology platform and marketplace operator. Platform means the software, websites, applications, tools, and related services made available by Mova. Rider means a user requesting transportation. Driver means an independent person who chooses to provide underlying transportation. Sender means a user requesting delivery. Recipient means the intended receiver of a delivery. Courier means an independent person who chooses to provide underlying delivery."] },
      { id: "mova-role", title: "3. Mova’s role as a technology marketplace", paragraphs: ["Mova operates a technology platform that connects people seeking mobility or delivery services with independent Drivers and Couriers who choose to provide those services. Mova operates the platform; the Driver or Courier performs the underlying transportation or delivery service.", "Mova may provide technology supporting matching, pricing mechanisms, offers and counteroffers, communications, payment facilitation, receipts, ratings, notifications, Safety features, tracking/status, and support. Providing these platform functions does not, by itself, mean that Mova physically drives a Rider, operates a Driver’s vehicle, carries a parcel, or delivers a parcel.", "Unless Mova expressly identifies a particular service as being provided directly by Mova, the underlying transportation or delivery arrangement is between the requesting user and the Driver or Courier, subject to applicable law and the service-specific terms." ] },
      { id: "independence", title: "4. Drivers and Couriers", paragraphs: ["Drivers and Couriers may choose whether and when to make themselves available and whether to accept individual opportunities, subject to applicable law, Mova platform rules, and service requirements. Nothing in these Terms overrides a classification, right, or protection that applicable law requires." ] },
      { id: "accounts", title: "5. Accounts and security", paragraphs: ["Users must provide information that is accurate enough for the relevant platform service, protect their credentials and verification codes, and promptly report suspected unauthorized access. Users should not impersonate another person or misuse another person’s account." ] },
      { id: "acceptable-use", title: "6. Acceptable use", paragraphs: ["Users must not use Mova for fraud, harassment, illegal activity, impersonation, unauthorized access, platform manipulation, security interference, or conduct that creates an unreasonable risk to another person or the platform." ] },
      { id: "platform-features", title: "7. Platform features and communications", paragraphs: ["Mova may provide in-app communications, push notifications, SMS, email, or other communications where supported. Features, availability, pricing mechanisms, and service options may vary by market, location, time, eligibility, and product configuration." ] },
      { id: "payments", title: "8. Payments and records", paragraphs: ["Mova may facilitate payment flows and provide electronic receipts or transaction records where applicable. Mova is not a bank. Payment processing may involve authorized third-party providers. Specific refund, cancellation, and dispute outcomes remain subject to the applicable service policy or disclosure." ] },
      { id: "safety-support", title: "9. Safety and support", paragraphs: ["Mova may provide Safety features, reporting paths, communications, and support tools. These features are intended to support users and do not guarantee that an incident cannot occur or replace reasonable care and compliance with law." ] },
      { id: "suspension", title: "10. Restrictions and termination", paragraphs: ["Mova may restrict or suspend platform access where reasonably necessary for fraud prevention, security, Safety, legal compliance, or serious platform-rule violations. Account closure does not remove obligations that should continue by their nature." ] },
      { id: "rights", title: "11. Intellectual property and user content", paragraphs: ["Mova retains rights in its name, logo, software, content, product interfaces, and technology. Where users submit ratings, support content, incident reports, profile material, or other content, they grant only the permissions reasonably needed to host, process, display, moderate, and operate the platform." ] },
      { id: "consumer-rights", title: "12. Disclaimers, liability, and consumer rights", paragraphs: ["Platform availability, route information, estimates, and third-party infrastructure may be affected by real-world or technical conditions. Nothing in these Terms excludes or limits rights, remedies, or liability that cannot lawfully be excluded or limited under applicable law. Any final liability, indemnity, dispute, and governing-law provisions require counsel confirmation." ] },
      { id: "changes", title: "13. Changes and unresolved legal details", paragraphs: ["Mova may update these Terms with appropriate notice where required. The following remain to be confirmed: [MOVA LEGAL ENTITY], [MOVA REGISTERED ADDRESS], [MOVA COMPANY NUMBER], [MOVA LEGAL EMAIL], [MINIMUM USER AGE], and [GOVERNING LAW / JURISDICTION — COUNSEL TO CONFIRM]."] },
    ],
  },
  {
    slug: "ride",
    title: "Ride Terms",
    summary: "Service-specific draft terms supplementing the General Terms for Mova Ride.",
    sections: [
      { id: "ride-platform", title: "1. Mova Ride platform", paragraphs: ["Mova provides technology through which Riders create ride requests and eligible Drivers choose whether to respond to or accept opportunities. The Driver performs the underlying physical transportation service; Mova operates the platform." ] },
      { id: "make-an-offer", title: "2. Make an Offer", paragraphs: ["A Rider may propose a fare within supported Mova marketplace rules, including any applicable floors, ranges, or limits. An eligible Driver may accept or counter where supported. Mova provides the technology and rules for this exchange but does not compel either party to agree. Final contract-formation wording requires counsel review." ] },
      { id: "fixed-price", title: "3. Fixed Price", paragraphs: ["Mova may calculate and display an upfront fare using route information, pricing parameters, marketplace conditions, and other applicable factors. The Rider chooses whether to request at that price and an eligible Driver chooses whether to accept the opportunity. Mova presenting or calculating a fare does not mean Mova physically performs transportation." ] },
      { id: "metered-ride", title: "4. Metered Ride", paragraphs: ["Mova may show an estimate before a Metered Ride. The final fare is determined through the platform using validated journey information and applicable metered pricing rules, which may reflect distance, duration, and disclosed components. Route, distance, duration, and ETA estimates may differ from actual conditions." ] },
      { id: "rider-driver", title: "5. Rider and Driver responsibilities", paragraphs: ["Riders should provide accurate pickup and destination information, act lawfully and respectfully, use reasonable care in a Driver’s vehicle, and meet payment obligations. Drivers are responsible, subject to applicable law and platform requirements, for lawful driving, licensing, vehicle operation, vehicle condition, traffic-law compliance, and professional conduct." ] },
      { id: "cancellation", title: "6. Cancellations and completion", paragraphs: ["Mova may provide cancellation, waiting, stop, receipt, rating, and support functionality. Any applicable cancellation or waiting charge will be disclosed through the platform or applicable policy; no amount is specified in this draft. Mova does not guarantee Driver availability or acceptance." ] },
    ],
  },
  {
    slug: "delivery",
    title: "Delivery & Courier Terms",
    summary: "Service-specific draft terms for Senders, Recipients, and Couriers using Mova Delivery.",
    sections: [
      { id: "delivery-platform", title: "1. Delivery platform role", paragraphs: ["Mova provides technology through which Senders create delivery requests and independent Couriers choose whether to accept and perform them. Unless Mova expressly identifies a service as direct, Mova does not itself collect, carry, transport, or deliver the parcel. The Courier performs the underlying physical delivery service." ] },
      { id: "sender", title: "2. Sender responsibilities", paragraphs: ["Senders are responsible for accurate pickup and recipient information, lawful parcel contents, appropriate packaging, accurate descriptions where requested, reasonable access for collection, and payment obligations. Senders should not provide unnecessary personal information about a Recipient." ] },
      { id: "recipient", title: "3. Recipient participation", paragraphs: ["Where a Recipient’s phone number corresponds to an existing Mova account, Mova may associate that user with the active delivery for supported participation, such as in-app notifications, delivery visibility, Courier information, progress, and completion information. These capabilities depend on the product and applicable rules." ] },
      { id: "external-recipient", title: "4. External Recipients", paragraphs: ["A Recipient without a Mova account does not automatically become a registered Mova user merely because a Sender provides contact information. Mova may process that information only as permitted for arranging delivery, collection or handoff, communications, Safety, support, legal, and security purposes. An external Recipient is not casually treated as having accepted the full Mova Terms." ] },
      { id: "courier", title: "5. Courier responsibilities", paragraphs: ["Couriers are responsible, subject to applicable law and platform requirements, for lawful operation, appropriate equipment or vehicle, reasonable parcel care, pickup verification where supported, delivery to the intended Recipient or location, professional conduct, Safety, and accurate completion information. Courier independence does not remove Mova’s responsibilities for the platform it operates." ] },
      { id: "parcels", title: "6. Parcel rules", paragraphs: ["Senders must not request delivery of illegal goods, stolen property, prohibited weapons or explosives, controlled or illegal drugs, dangerous or hazardous substances, human remains, living persons, or other items prohibited by law or Mova policy. Regulated goods may require permits or special handling. [HIGH-VALUE / EXCLUDED ITEMS POLICY — TO BE CONFIRMED]." ] },
      { id: "tracking", title: "7. Pricing, tracking, and completion", paragraphs: ["Mova may facilitate pricing, communications, delivery status, tracking, notifications, and completion records. Pricing and delivery estimates are displayed through the platform where appropriate and are not guaranteed. Tracking may be unavailable or inaccurate in some circumstances." ] },
      { id: "loss-damage", title: "8. Delivery issues", paragraphs: ["Users should report non-delivery, wrong-recipient, damage, or other disputes through available Mova support. Final rules for returns, redelivery, refunds, insurance, declared value, and loss or damage liability remain unresolved: [RETURN / REDELIVERY POLICY — TO BE CONFIRMED], [MAXIMUM PARCEL VALUE / LIABILITY POLICY — TO BE CONFIRMED], [DELIVERY LOSS / DAMAGE LIABILITY TERMS — COUNSEL AND BUSINESS TO CONFIRM], and [INSURANCE POSITION — BUSINESS/COUNSEL TO CONFIRM]." ] },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "Draft explanation of how Mova may handle personal information across its platform ecosystem.",
    sections: [
      { id: "scope", title: "1. Scope and controller", paragraphs: ["This Nigeria Launch Draft describes information handling for the public website, Mova applications, platform services, support, Safety functionality, and related ecosystem features. The controller/operator is [MOVA LEGAL ENTITY], [MOVA REGISTERED ADDRESS]. Privacy contact: [MOVA PRIVACY EMAIL]. This document requires review against the Nigeria Data Protection Act and applicable requirements." ] },
      { id: "data-categories", title: "2. Information Mova may process", paragraphs: ["Depending on the service, Mova may process account and identity information, contact and profile information, Rider, Driver, and Courier information, location and trip information, delivery and Recipient information, payment or transaction records, communications, ratings and feedback, Safety and incident information, support information, device and technical information, and fraud or security information. Mova should not collect more information than the relevant purpose requires." ] },
      { id: "location", title: "3. Location information", paragraphs: ["Mova’s mobile applications may process precise location when needed for supported pickup, matching, trip or delivery execution, route/status information, Safety, fraud/security, or support functions, subject to device permissions, app role, product state, and applicable law. The public marketing website does not require precise browser geolocation. [BACKGROUND LOCATION RULES — CONFIRM AGAINST FINAL MOBILE IMPLEMENTATION]." ] },
      { id: "trip-delivery", title: "4. Trip, delivery, and Recipient information", paragraphs: ["Trip information may include pickup, destination, route, timestamps, ride mode, fare, status, cancellation, and completion. Delivery information may include Sender, pickup, Recipient details, destination, Courier, status, timestamps, route, and completion. A Sender may provide a Recipient’s name, phone number, destination, or other information needed to arrange delivery. Existing Mova Recipients may receive supported delivery participation; external Recipients do not automatically receive an account." ] },
      { id: "uses", title: "5. How Mova may use information", paragraphs: ["Mova may use information to provide platform services, manage accounts, match users, support rides and deliveries, calculate or display pricing, facilitate payments, send communications, provide Safety and support, prevent fraud and security incidents, comply with law, improve reliability where lawful, and exercise or defend legal rights. Final legal bases require counsel review and may include contract, legal obligations, legitimate interests, consent where required, and protection of vital interests where applicable." ] },
      { id: "sharing", title: "6. Sharing information", paragraphs: ["Information may be shared as needed among matched Riders, Drivers, Senders, Couriers, and Recipients; with communications, payment, cloud, security, support, and infrastructure providers; with professional advisers; with authorities where legally required; and with business-transfer counterparties where applicable. Mova should not expose more personal information than the relevant platform purpose requires. Provider categories may change by country." ] },
      { id: "communications", title: "7. Communications and security", paragraphs: ["Mova may send account, OTP/security, trip, delivery, support, Safety, and transactional communications through push notifications, SMS, email, or in-app channels where supported. Mova uses technical and organizational safeguards designed to protect information, but no system can promise absolute security. Mova may process information to protect accounts, detect fraud, prevent abuse, and investigate suspicious activity." ] },
      { id: "retention", title: "8. Retention and deletion", paragraphs: ["Mova retains information for as long as reasonably needed for service, account, legal, fraud/security, financial recordkeeping, dispute, Safety, and limitation-period purposes. [DATA RETENTION SCHEDULE — TO BE CONFIRMED]. Users may request account deletion, subject to lawful retention and other applicable obligations. Final account-deletion behavior must be compared with the mobile applications." ] },
      { id: "rights", title: "9. Privacy rights", paragraphs: ["Subject to applicable law, users may have rights to access, correct, delete, restrict, object to processing, withdraw consent where processing relies on consent, complain, and exercise other statutory rights. Mova may verify identity before acting. Requests should be directed to [MOVA PRIVACY EMAIL]. Users may also have the right to complain to the applicable Nigerian data-protection authority." ] },
      { id: "children", title: "10. Children and changes", paragraphs: ["The platform is not intended for people below [MINIMUM USER AGE], except where a specific approved product flow provides otherwise and applicable law permits it. Mova may update this Policy with appropriate notice. Final review must cover permissions, background location, push tokens, device identifiers, analytics or crash tools, payments, account deletion, international transfers, retention, and Recipient behavior in the completed mobile applications." ] },
    ],
  },
];

// Helper to render HTML document shell
function renderHtmlShell({
  title,
  description,
  canonicalPath,
  rootPath = "",
  activeSlug = "",
  noIndex = false,
  bodyContent = "",
  structuredData = null
}) {
  const fullTitle = title.includes("Mova") ? title : `${title} | Mova`;
  const canonicalUrl = `${siteConfig.url}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`;

  const navLinks = siteConfig.nav.map(item => {
    const isCurrent = activeSlug === item.slug;
    const href = `${rootPath}${item.slug}/`;
    return `<a href="${href}"${isCurrent ? ' class="is-active" aria-current="page"' : ''}>${item.label}</a>`;
  }).join("");

  const mobileNavLinks = siteConfig.nav.map(item => {
    const href = `${rootPath}${item.slug}/`;
    return `<a href="${href}">${item.label}</a>`;
  }).join("");

  const footerGroupsHtml = siteConfig.footerGroups.map(group => `
    <div class="footer-group">
      <h2>${group.title}</h2>
      ${group.links.map(([label, href]) => `<a href="${rootPath}${href}">${label}</a>`).join("")}
    </div>
  `).join("");

  const jsonLd = structuredData ? `
    <script type="application/ld+json">
      ${JSON.stringify(structuredData)}
    </script>
  ` : "";

  const rootFallbackScript = canonicalPath === "/404" ? `
  <script>
    (function() {
      var p = window.location.pathname;
      if (p === '/' || p === '' || p === '/index.html' || /^\\/(en-gh|en-ke|en-za|en-gb|en)\\/?$/i.test(p)) {
        window.location.replace('/en-ng/');
      }
    })();
  </script>` : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">${rootFallbackScript}
  <title>${fullTitle}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  ${noIndex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow">'}
  
  <!-- Open Graph / Social -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${fullTitle}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:site_name" content="Mova">
  <meta property="og:locale" content="en_NG">
  <meta property="og:image" content="${siteConfig.url}/brand/mova-logo-official.png">
  
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${fullTitle}">
  <meta name="twitter:description" content="${description}">
  
  <!-- Favicon and App Icons -->
  <link rel="icon" type="image/x-icon" href="${rootPath}brand/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="${rootPath}brand/mova-favicon.png">
  <link rel="apple-touch-icon" href="${rootPath}brand/mova-favicon.png">
  <meta name="theme-color" content="#071b2b">
  
  <!-- Modern Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  
  <!-- Stylesheet -->
  <link rel="stylesheet" href="${rootPath}css/maplibre-gl.css">
  <link rel="stylesheet" href="${rootPath}css/style.css">
  ${jsonLd}
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  
  <!-- Site Header -->
  <header class="site-header header-fidelity" id="site-header">
    <div class="container header-inner">
      <a href="${rootPath || './'}" class="brand-logo" aria-label="Mova home">
        <img src="${rootPath}brand/mova-logo-web.png" width="900" height="300" alt="Mova" loading="eager">
      </a>
      
      <nav class="desktop-nav" aria-label="Main navigation">
        ${navLinks}
      </nav>
      
      <div class="desktop-actions">
        <button class="region-selector-btn" id="region-selector-open" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Select Country and Language">
          <span class="region-flag" id="header-region-flag">🇳🇬</span>
          <span id="header-region-name">Nigeria (EN)</span>
          <svg width="12" height="12" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>
        </button>
        <a class="button button--primary" href="${rootPath}#get-mova">
          Get Mova
          ${iconSvg("arrow-up-right", 18)}
        </a>
      </div>
      
      <!-- Mobile navigation toggle -->
      <button class="menu-trigger" id="mobile-menu-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-menu">
        ${iconSvg("list-bold", 25)}
      </button>
    </div>
  </header>
  <div class="scroll-progress-bar" id="scroll-progress" aria-hidden="true"></div>
  
  <!-- Mobile Navigation Modal -->
  <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Main menu" style="display: none;">
    <div class="mobile-menu__top">
      <span class="mobile-menu__label">Menu</span>
      <button class="menu-trigger" id="mobile-menu-close" type="button" aria-label="Close menu">
        ${iconSvg("x-bold", 25)}
      </button>
    </div>
    <nav aria-label="Mobile navigation">
      ${mobileNavLinks}
    </nav>
    <div class="mobile-menu__actions">
      <button class="region-selector-btn region-selector-btn--mobile" id="mobile-region-selector-open" type="button">
        <span class="region-flag" id="mobile-region-flag">🇳🇬</span>
        <span id="mobile-region-name">Nigeria (EN)</span>
      </button>
      <a class="button button--primary" href="${rootPath}#get-mova">
        Get Mova
        ${iconSvg("arrow-up-right", 18)}
      </a>
    </div>
  </div>

  ${bodyContent}

  <!-- Site Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="${rootPath || './'}" class="brand-logo brand-logo--inverse" aria-label="Mova home">
            <img src="${rootPath}brand/mova-logo-web.png" width="900" height="300" alt="Mova">
          </a>
          <p class="footer-company">MOVA INTEGRATED MOBILITY LTD</p>
          <p>Your ride. Your price. Your choice.</p>
          <p class="footer-contact">
            <span>Call us</span>
            <a href="tel:+2347047838642">+2347047838642</a>
          </p>
          <p class="launch-note">Launching first in Nigeria.</p>
        </div>
        
        ${footerGroupsHtml}
      </div>
      
      <div class="footer-bottom">
        <p>© 2026 MOVA INTEGRATED MOBILITY LTD. All rights reserved.</p>
        <p>Built to move with you.</p>
      </div>
    </div>
  </footer>

  <!-- Global Region / Locale Selector Modal -->
  <div class="region-modal-backdrop" id="region-modal" role="dialog" aria-modal="true" aria-label="Select your country" style="display: none;">
    <div class="region-modal-card">
      <div class="region-modal-header">
        <div>
          <h3>Choose your region</h3>
          <p>Select your country to view local pricing, driver earnings, and services.</p>
        </div>
        <button class="region-modal-close" id="region-modal-close" type="button" aria-label="Close region selector">
          ${iconSvg("x-bold", 18)}
        </button>
      </div>
      <div class="region-search-box">
        <svg width="18" height="18" viewBox="0 0 256 256" fill="#8899a6" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>
        <input type="text" id="region-search-input" placeholder="Search countries or cities..." autocomplete="off">
      </div>
      <div class="region-grid" id="region-options-list">
        <div class="region-card is-active" data-region="en-ng" data-flag="🇳🇬" data-name="Nigeria (EN)" data-currency="NGN">
          <span class="region-card-flag">🇳🇬</span>
          <div class="region-card-info">
            <strong>Nigeria</strong>
            <small>English · NGN (₦) · Active Market</small>
          </div>
          <span class="region-status-badge">Active</span>
        </div>
        <div class="region-card" data-region="en-gh" data-flag="🇬🇭" data-name="Ghana (EN)" data-currency="GHS">
          <span class="region-card-flag">🇬🇭</span>
          <div class="region-card-info">
            <strong>Ghana</strong>
            <small>English · GHS (GH₵) · Accra Metro</small>
          </div>
          <span class="region-status-badge region-status-badge--soon">Coming Soon</span>
        </div>
        <div class="region-card" data-region="en-ke" data-flag="🇰🇪" data-name="Kenya (EN)" data-currency="KES">
          <span class="region-card-flag">🇰🇪</span>
          <div class="region-card-info">
            <strong>Kenya</strong>
            <small>English · KES (KSh) · Nairobi Hub</small>
          </div>
          <span class="region-status-badge region-status-badge--soon">Coming Soon</span>
        </div>
        <div class="region-card" data-region="en-za" data-flag="🇿🇦" data-name="South Africa (EN)" data-currency="ZAR">
          <span class="region-card-flag">🇿🇦</span>
          <div class="region-card-info">
            <strong>South Africa</strong>
            <small>English · ZAR (R) · Joburg & Cape Town</small>
          </div>
          <span class="region-status-badge region-status-badge--soon">Coming Soon</span>
        </div>
        <div class="region-card" data-region="en-gb" data-flag="🇬🇧" data-name="United Kingdom (EN)" data-currency="GBP">
          <span class="region-card-flag">🇬🇧</span>
          <div class="region-card-info">
            <strong>United Kingdom</strong>
            <small>English · GBP (£) · Global HQ</small>
          </div>
          <span class="region-status-badge region-status-badge--global">Corporate</span>
        </div>
        <div class="region-card" data-region="en" data-flag="🌐" data-name="International (EN)" data-currency="USD">
          <span class="region-card-flag">🌐</span>
          <div class="region-card-info">
            <strong>International / Global</strong>
            <small>English · USD ($) · Global Gateway</small>
          </div>
          <span class="region-status-badge region-status-badge--global">Global</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Vanilla Scripts -->
  <script src="${rootPath}js/maplibre-gl.js" defer></script>
  <script src="${rootPath}js/main.js" defer></script>
</body>
</html>`;
}

// 3. Bespoke Enterprise Subpage Generators

function generateRidePage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--ride">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="ambient-glow-orb" aria-hidden="true"></div>
        <div class="container enterprise-hero-grid">
          <div class="enterprise-hero-copy">
            <p class="eyebrow">${iconSvg("car-fill", 16)} RIDE WITH MOVA</p>
            <h1>Move on your terms.<br>Every ride. Every day.</h1>
            <p>
              Experience Africa's fairest mobility platform. Propose your own fare, lock in guaranteed upfront rates, or choose transparent metered rides. No predatory surge spikes, vetted drivers, and 24/7 in-trip security.
            </p>
            <div class="enterprise-hero-actions">
              <a class="button button--primary" href="${rootPath}#get-mova">
                Request a Ride
                ${iconSvg("arrow-up-right", 18)}
              </a>
              <a class="button button--secondary" href="#fleet-classes">
                Explore Vehicle Classes
              </a>
            </div>
          </div>
          <div class="enterprise-hero-visual">
            <img src="${rootPath}images/marketing/rider-hero.jpg" alt="Executive passenger in comfortable sedan overlooking city skyline" loading="eager">
            <div class="hero-floating-stat">
              <i></i>
              <span>18,400+ active rides completed today · 4.9★ driver rating</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 3 Distinct Pricing Modes -->
      <section class="section" id="pricing-modes">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">YOUR CHOICE BEFORE EVERY REQUEST</p>
            <h2>Three ways to ride. You pick what fits.</h2>
            <p class="section-lead" style="max-width: 680px; margin-inline: auto;">
              Unlike traditional ride-hailing apps that lock you into inflexible algorithms, Mova gives you three transparent pricing options for every single trip.
            </p>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("dollar-duotone", 28)}</div>
              <h3>Make an Offer</h3>
              <p>
                Propose your own fair price based on your budget. Nearby verified drivers can accept your offer immediately or propose a transparent counter-offer. You choose who picks you up.
              </p>
              <div class="category-card-meta">
                <span>MUTUAL AGREEMENT</span>
                <strong>Save up to 30%</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("shield-duotone", 28)}</div>
              <h3>Fixed Upfront Fare</h3>
              <p>
                Prefer certainty? View your guaranteed price before you tap request. Even if traffic builds up or weather changes, your agreed fare remains locked down to the exact kobo.
              </p>
              <div class="category-card-meta">
                <span>ZERO SURPRISE CHARGES</span>
                <strong>Guaranteed Price</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("navigation-duotone", 28)}</div>
              <h3>Metered Journey</h3>
              <p>
                Running errands or making multiple impromptu stops? Metered rides bill you precisely based on actual distance and time traveled with real-time GPS telemetry and instant digital receipts.
              </p>
              <div class="category-card-meta">
                <span>MULTI-STOP FLEXIBILITY</span>
                <strong>Live Telematics</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("handshake-duotone", 28)}</div>
              <h3>Cash & Card Freedom</h3>
              <p>
                Pay seamlessly using your preferred payment method: debit card, instant bank transfer, USSD, or direct cash to your driver partner. Transparent receipts delivered directly to your email.
              </p>
              <div class="category-card-meta">
                <span>SEAMLESS PAYMENTS</span>
                <strong>Instant Receipts</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Vehicle Categories & Fleet -->
      <section class="section" id="fleet-classes" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">OUR VEHICLE CATEGORIES</p>
            <h2>A vehicle class for every journey.</h2>
            <p class="section-lead" style="max-width: 680px; margin-inline: auto;">
              Every car on Mova undergoes an annual 45-point mechanical inspection and must be equipped with working air conditioning and passenger safety equipment.
            </p>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("car-fill", 28)}</div>
              <h3>Mova Go</h3>
              <p>Smart, reliable compact sedans and hatchbacks for everyday urban commuting. Fuel-efficient, clean, and budget-friendly.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Toyota Corolla, Hyundai Elantra, Kia Rio</li>
                <li>Seats up to 4 passengers</li>
                <li>Air-conditioned & verified</li>
              </ul>
              <div class="category-card-meta">
                <span>ETA: 2-4 MINS</span>
                <strong>Affordable Base</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("star-fill", 28)}</div>
              <h3>Mova Comfort</h3>
              <p>Spacious, newer-model sedans with generous rear legroom, climate control, phone charging cables, and top-rated driver partners.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Toyota Camry, Honda Accord, Hyundai Sonata</li>
                <li>Extra legroom & phone chargers</li>
                <li>Top 10% highest-rated drivers</li>
              </ul>
              <div class="category-card-meta">
                <span>ETA: 3-5 MINS</span>
                <strong>Executive Comfort</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("car-profile-fill", 28)}</div>
              <h3>Mova XL</h3>
              <p>Three-row SUVs and premium minivans designed for airport runs, family trips, bulky shopping, and group outings across town.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Toyota Sienna, Highlander, Honda Pilot</li>
                <li>Seats up to 6 passengers + 4 large bags</li>
                <li>Spacious luggage compartment</li>
              </ul>
              <div class="category-card-meta">
                <span>ETA: 5-8 MINS</span>
                <strong>Group & Airport</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("path-duotone", 28)}</div>
              <h3>Mova Electric</h3>
              <p>Zero-emission electric sedans and hybrid vehicles pioneering green urban transit in Lagos and Abuja. Whisper-quiet and eco-friendly.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Modern EV Sedans & Hybrids</li>
                <li>Zero tailpipe emissions</li>
                <li>Quiet, ultra-smooth ride</li>
              </ul>
              <div class="category-card-meta">
                <span>ETA: 4-7 MINS</span>
                <strong>Eco-Friendly</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Head-to-Head Comparison Table vs Bolt & inDrive -->
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">HEAD-TO-HEAD BENCHMARK</p>
            <h2>Why riders and drivers choose Mova over the rest.</h2>
            <p class="section-lead" style="max-width: 680px; margin-inline: auto;">
              Compare Mova directly against legacy ride-hailing services operating in Nigeria and Africa.
            </p>
          </div>

          <div class="comparison-table-wrap">
            <table class="comparison-table">
              <thead>
                <tr>
                  <th>Platform Feature</th>
                  <th class="mova-col">Mova</th>
                  <th>Bolt</th>
                  <th>inDrive</th>
                  <th>Yellow Cabs</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Pricing Models</strong></td>
                  <td class="mova-col">Choice of 3: Bid, Fixed, or Metered</td>
                  <td>Algorithm surge only</td>
                  <td>Bidding only</td>
                  <td>Street bargaining</td>
                </tr>
                <tr>
                  <td><strong>Surge Pricing Multipliers</strong></td>
                  <td class="mova-col">Capped, transparent & fair</td>
                  <td>Unannounced up to 3.5x</td>
                  <td>Dynamic</td>
                  <td>Arbitrary rain markup</td>
                </tr>
                <tr>
                  <td><strong>Driver Commission</strong></td>
                  <td class="mova-col">Only 10% (Driver keeps 90%)</td>
                  <td>20% – 25% + fees</td>
                  <td>10% – 12%</td>
                  <td>N/A (Owner takes 60%)</td>
                </tr>
                <tr>
                  <td><strong>Driver Destination Visibility</strong></td>
                  <td class="mova-col">100% visible before accept</td>
                  <td>Hidden until driver arrives</td>
                  <td>Visible</td>
                  <td>Direct inquiry</td>
                </tr>
                <tr>
                  <td><strong>Driver Cancellation Rate</strong></td>
                  <td class="mova-col">Under 3.2% (mutual agreement)</td>
                  <td>Over 24% in peak traffic</td>
                  <td>Moderate</td>
                  <td>Frequent refusal</td>
                </tr>
                <tr>
                  <td><strong>Safety & Emergency SOS</strong></td>
                  <td class="mova-col">24/7 Live Telematics + Police SOS</td>
                  <td>Basic in-app SOS</td>
                  <td>Basic SOS button</td>
                  <td>No tracking or records</td>
                </tr>
                <tr>
                  <td><strong>Post-Trip Dispute Resolution</strong></td>
                  <td class="mova-col">Dedicated 24/7 Safety Command</td>
                  <td>Standard ticket queue</td>
                  <td>Basic email support</td>
                  <td>None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Download App CTA Banner -->
      <section class="section" style="background: linear-gradient(135deg, #071b2b 0%, #00172c 100%); color: white; padding-block: 4.5rem;">
        <div class="container text-center">
          <p class="eyebrow" style="color: var(--mova-green-500);">GET STARTED TODAY</p>
          <h2 style="color: white; font-size: clamp(2rem, 4vw, 3.2rem); margin-bottom: 1rem;">Experience fair urban mobility now.</h2>
          <p style="color: #cbd5e1; max-width: 600px; margin: 0 auto 2rem; font-size: 1.1rem;">
            Download the Mova app for iOS and Android. Request your first ride or make an offer in seconds.
          </p>
          <div class="button-row" style="justify-content: center;">
            <a class="button button--primary" href="${rootPath}#get-mova">
              Download Mova App
              ${iconSvg("arrow-up-right", 18)}
            </a>
            <a class="button button--secondary" href="${rootPath}safety/" style="color: white; border-color: rgba(255,255,255,0.25);">
              Review Safety Protocols
            </a>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "Ride with Mova — Move on Your Terms in Nigeria",
    description: "Propose fares, choose fixed-price rides, or ride metered across Nigeria. Clean vehicles, verified drivers, and 24/7 safety telematics.",
    canonicalPath: "/ride",
    rootPath,
    activeSlug: "ride",
    bodyContent
  });
}

function generateDrivePage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--drive">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="ambient-glow-orb" aria-hidden="true"></div>
        <div class="container enterprise-hero-grid">
          <div class="enterprise-hero-copy">
            <p class="eyebrow">${iconSvg("handshake-duotone", 16)} DRIVE WITH MOVA</p>
            <h1>Keep what you earn.<br>Only <span class="counter-num" data-target="10">10</span>% commission.</h1>
            <p>
              Tired of losing 25% of your earnings to foreign ride-hailing apps? Mova is built for drivers. Enjoy the lowest commission in the market, weekly bank payouts directly to your account, and complete destination transparency before you accept any trip.
            </p>
            <div class="enterprise-hero-actions">
              <a class="button button--primary" href="#driver-calculator">
                Calculate Your Income
                ${iconSvg("arrow-up-right", 18)}
              </a>
              <a class="button button--secondary" href="#driver-requirements">
                Driver Requirements
              </a>
            </div>
          </div>
          <div class="enterprise-hero-visual">
            <img src="${rootPath}images/marketing/driver-hero.jpg" alt="Professional smiling Mova driver partner behind the wheel" loading="eager">
            <div class="hero-floating-stat">
              <i></i>
              <span>₦<span class="counter-num" data-target="485000" data-format="comma">485,000</span> avg. monthly net take-home in Lagos & Abuja</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Earnings Calculator -->
      <section class="section" id="driver-calculator">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">TRANSPARENT TAKE-HOME PAY</p>
            <h2>See how much more you keep with Mova.</h2>
            <p class="section-lead" style="max-width: 680px; margin-inline: auto;">
              Use our interactive calculator to compare your net take-home earnings on Mova vs legacy platforms charging 25% commission.
            </p>
          </div>

          <div class="earnings-calc-card">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
              <label for="drive-trips-slider" style="font: 750 1.05rem var(--font-jakarta); color: var(--mova-navy-950);">
                Weekly Completed Trips: <strong id="drive-trips-val" style="color: var(--mova-green-700);">50 trips</strong>
              </label>
              <span style="font-size: 0.85rem; color: var(--text-secondary);">(~7 trips / day)</span>
            </div>
            <input type="range" id="drive-trips-slider" min="10" max="120" step="5" value="50" style="width: 100%; accent-color: var(--mova-green-500); cursor: pointer;">

            <div style="display: flex; gap: 1rem; margin-top: 1.5rem; justify-content: center; flex-wrap: wrap;">
              <button type="button" class="category-tier-btn is-active" data-tier="economy" style="padding: 0.5rem 1rem; border-radius: 999px; border: 1.5px solid var(--mova-green-500); background: #eef9f2; font: 700 0.82rem var(--font-jakarta); cursor: pointer;">
                Mova Go (₦4,200 avg/trip)
              </button>
              <button type="button" class="category-tier-btn" data-tier="comfort" style="padding: 0.5rem 1rem; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: white; font: 700 0.82rem var(--font-jakarta); cursor: pointer;">
                Mova Comfort (₦6,500 avg/trip)
              </button>
              <button type="button" class="category-tier-btn" data-tier="xl" style="padding: 0.5rem 1rem; border-radius: 999px; border: 1.5px solid var(--border-subtle); background: white; font: 700 0.82rem var(--font-jakarta); cursor: pointer;">
                Mova XL (₦9,800 avg/trip)
              </button>
            </div>

            <div class="earnings-calc-results">
              <div>
                <small>Weekly Gross Revenue</small>
                <strong id="calc-gross">₦210,000</strong>
              </div>
              <div>
                <small>Mova 10% Platform Fee</small>
                <strong id="calc-fee" style="color: #0284c7;">-₦21,000</strong>
              </div>
              <div style="background: white; border-radius: 1rem; padding: 1rem; border: 1.5px solid var(--mova-green-500);">
                <small style="color: var(--mova-green-700);">YOUR NET TAKE-HOME</small>
                <strong id="calc-net" style="color: var(--mova-green-700);">₦189,000</strong>
              </div>
            </div>

            <div style="margin-top: 1.25rem; padding: 1rem 1.25rem; border-radius: 1rem; background: #fffbeb; border: 1px solid #fde68a; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
              <div style="font-size: 0.92rem; color: #92400e;">
                <strong>Extra cash in your pocket vs 25% competitor apps:</strong>
                <span id="calc-extra-note">You earn <strong>+₦31,500 more</strong> every week!</span>
              </div>
              <strong id="calc-monthly-savings" style="font-size: 1.15rem; color: #b45309;">+₦126,000 / month</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 Core Pillars for Drivers -->
      <section class="section" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">BUILT FOR DRIVER SUCCESS</p>
            <h2>Why 15,000+ drivers partner with Mova.</h2>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("dollar-duotone", 28)}</div>
              <h3>Lowest 10% Fee</h3>
              <p>We believe the person doing the driving deserves the bulk of the revenue. Mova charges only 10% commission so you retain 90% of every fare.</p>
              <div class="category-card-meta">
                <span>UNMATCHED VALUE</span>
                <strong>Keep 90%</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("check-fill", 28)}</div>
              <h3>Weekly Bank Payouts</h3>
              <p>Automated weekly direct deposit every Monday directly into your verified bank account with clear earnings breakdown and zero hidden deduction fees.</p>
              <div class="category-card-meta">
                <span>EVERY MONDAY</span>
                <strong>Weekly Payout</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("map-pin-fill", 28)}</div>
              <h3>Full Trip Transparency</h3>
              <p>See exact pickup location, drop-off destination, passenger offer, and payment method before you decide to accept. No blind trips.</p>
              <div class="category-card-meta">
                <span>ZERO SURPRISES</span>
                <strong>100% Upfront</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("handshake-duotone", 28)}</div>
              <h3>Counter-Offer Power</h3>
              <p>Rider proposed an offer during peak traffic or bad weather? Accept it or send a reasonable counter-offer that reflects the true trip reality.</p>
              <div class="category-card-meta">
                <span>FAIR BARGAINING</span>
                <strong>Driver Choice</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Driver Partner Perks & Safety Nets -->
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">PARTNER BENEFITS & PERKS</p>
            <h2>More than just an app. We protect your livelihood.</h2>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("car-fill", 28)}</div>
              <h3>Subsidized Fuel Vouchers</h3>
              <p>Access exclusive 5% – 8% fuel discounts at over 200 partner fuel stations across Lagos, Abuja, Port Harcourt, and Ibadan.</p>
              <div class="category-card-meta">
                <span>FUEL PARTNERS</span>
                <strong>Save on Petrol</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("shield-fill", 28)}</div>
              <h3>Driver Welfare & Safety Support</h3>
              <p>Dedicated 24/7 partner liaison team, rapid dispute arbitration, and priority in-app safety assistance on every route you drive.</p>
              <div class="category-card-meta">
                <span>24/7 SUPPORT</span>
                <strong>Safety First</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("navigation-fill", 28)}</div>
              <h3>24/7 Roadside Assistance</h3>
              <p>Vehicle broke down? Enjoy complimentary emergency towing, battery jump-starts, and flat-tire assistance across major metropolitan corridors.</p>
              <div class="category-card-meta">
                <span>FREE ASSISTANCE</span>
                <strong>24/7 Patrol</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("package-duotone", 28)}</div>
              <h3>Vehicle Maintenance Discounts</h3>
              <p>Subsidized brake pads, tire replacements, oil changes, and diagnostics at certified mechanic workshops across our driver partner hubs.</p>
              <div class="category-card-meta">
                <span>MAINTENANCE</span>
                <strong>Certified Garages</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Fast 4-Step Onboarding Process -->
      <section class="section" id="driver-requirements" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">FAST ONBOARDING</p>
            <h2>Get approved and start earning in 24 hours.</h2>
          </div>

          <div class="public-steps" style="margin-top: 2rem;">
            <div>
              <article>
                <b>01</b>
                <span><strong>Register Online</strong><br>Download the Mova Driver App and fill in your basic personal information in under 3 minutes.</span>
              </article>
              <article>
                <b>02</b>
                <span><strong>Upload Documents</strong><br>Submit clear photos of your Driver’s License, vehicle registration, and roadworthiness certificate.</span>
              </article>
              <article>
                <b>03</b>
                <span><strong>Vehicle Inspection</strong><br>Quick 15-minute physical vehicle check at any local Mova Driver Hub or certified inspection center.</span>
              </article>
              <article>
                <b>04</b>
                <span><strong>Go Online & Earn</strong><br>Once activated, toggle online, accept your first trip or counter passenger offers, and receive your weekly bank payouts!</span>
              </article>
            </div>
          </div>

          <div class="public-page-actions" style="margin-top: 3rem;">
            <a class="button button--primary" href="${rootPath}#get-mova">
              Download Driver App
              ${iconSvg("arrow-up-right", 18)}
            </a>
            <a class="button button--secondary" href="${rootPath}help/">
              Driver Support FAQ
            </a>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "Drive with Mova — Keep 90% of Your Fare with 10% Commission",
    description: "Drive with Mova in Nigeria. Only 10% commission, instant daily bank withdrawals, and 100% trip destination transparency before accepting.",
    canonicalPath: "/drive",
    rootPath,
    activeSlug: "drive",
    bodyContent
  });
}

function generateDeliverPage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--deliver">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="ambient-glow-orb" aria-hidden="true"></div>
        <div class="container enterprise-hero-grid">
          <div class="enterprise-hero-copy">
            <p class="eyebrow">${iconSvg("package-duotone", 16)} MOVA EXPRESS DELIVERY</p>
            <h1>Move packages fast.<br>Across the city in minutes.</h1>
            <p>
              On-demand courier dispatch for individuals, online sellers, and growing businesses. From urgent legal contracts to bulk inventory transfers, track your deliveries in real-time with tamper-proof OTP recipient verification.
            </p>
            <div class="enterprise-hero-actions">
              <a class="button button--primary" href="#delivery-fleet">
                Send a Package Now
                ${iconSvg("arrow-up-right", 18)}
              </a>
              <a class="button button--secondary" href="#business-logistics">
                Business Logistics API
              </a>
            </div>
          </div>
          <div class="enterprise-hero-visual">
            <img src="${rootPath}images/marketing/courier-hero.jpg" alt="Mova motorcycle courier delivering parcel with digital verification" loading="eager">
            <div class="hero-floating-stat">
              <i></i>
              <span>28 mins avg. urban delivery time · 99.8% safe handoff rate</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Delivery Fleet Modalities -->
      <section class="section" id="delivery-fleet">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">VERSATILE FLEET OPTIONS</p>
            <h2>The right vehicle for every shipment.</h2>
            <p class="section-lead" style="max-width: 680px; margin-inline: auto;">
              Whether you need an express motorcycle to beat gridlock or a dedicated cargo van for inventory, Mova has you covered.
            </p>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("package-regular", 28)}</div>
              <h3>Mova Bike Express</h3>
              <p>Fastest urban dispatch for documents, food, medicines, apparel, and parcels up to 10kg. Zips through traffic for rapid delivery.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Max payload: 10kg (insulated top-box)</li>
                <li>Avg. delivery time: 25 - 35 mins</li>
                <li>Real-time GPS tracking & recipient OTP</li>
              </ul>
              <div class="category-card-meta">
                <span>FASTEST DISPATCH</span>
                <strong>From ₦1,200</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("car-fill", 28)}</div>
              <h3>Sedan Courier</h3>
              <p>Air-conditioned vehicle transport for fragile birthday cakes, delicate electronics, high-end fashion, and parcels up to 50kg.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Max payload: 50kg (trunk & rear seat)</li>
                <li>Climate-controlled for perishables</li>
                <li>Zero jostling or dust exposure</li>
              </ul>
              <div class="category-card-meta">
                <span>FRAGILE & HIGH-VALUE</span>
                <strong>From ₦3,500</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("navigation-duotone", 28)}</div>
              <h3>Cargo Van & Truck</h3>
              <p>Medium and heavy logistics for wholesale distribution, warehouse stock transfers, furniture, and eCommerce batch inventory.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Payload: 500kg up to 2,000kg</li>
                <li>Scheduled or same-day dispatch</li>
                <li>Dedicated driver and loading assistance</li>
              </ul>
              <div class="category-card-meta">
                <span>BULK & HEAVY</span>
                <strong>Custom Commercial</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("shield-duotone", 28)}</div>
              <h3>Priority Express Dispatch</h3>
              <p>High-priority business dispatch with live corridor GPS tracking, direct phone-call verification at pickup and drop-off, and dedicated dispute resolution.</p>
              <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem;">
                <li>Live GPS corridor tracking</li>
                <li>Senior vetted courier assignment</li>
                <li>Direct recipient OTP verification</li>
              </ul>
              <div class="category-card-meta">
                <span>PRIORITY DISPATCH</span>
                <strong>VIP Handling</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Business & eCommerce Solutions -->
      <section class="section" id="business-logistics" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">ENTERPRISE LOGISTICS & APIS</p>
            <h2>Powering logistics for modern African merchants.</h2>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("navigation-fill", 28)}</div>
              <h3>Developer API Integration</h3>
              <p>Plug Mova Delivery directly into your custom web application, Shopify, or WooCommerce store for automated fulfillment on checkout.</p>
              <div class="category-card-meta">
                <span>RESTFUL API</span>
                <strong>Instant Webhooks</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("map-trifold", 28)}</div>
              <h3>Multi-Stop Route Optimizer</h3>
              <p>Dispatch up to 20 deliveries in a single batch. Our intelligent routing engine minimizes courier distance, cutting your delivery costs by up to 35%.</p>
              <div class="category-card-meta">
                <span>BATCH DISPATCH</span>
                <strong>Save 35%</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("dollar-duotone", 28)}</div>
              <h3>Consolidated VAT Invoicing</h3>
              <p>Monthly corporate billing with comprehensive itemized reports, VAT tax documentation, and dedicated enterprise account management.</p>
              <div class="category-card-meta">
                <span>CORPORATE ACCOUNTS</span>
                <strong>Monthly Billing</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("check-duotone", 28)}</div>
              <h3>Proof-of-Delivery OTP</h3>
              <p>No parcels left unattended. Recipient must provide a dynamic 4-digit code generated in-app or via SMS before the courier can complete the dropoff.</p>
              <div class="category-card-meta">
                <span>TAMPER-PROOF</span>
                <strong>Zero Loss</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Steps -->
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">EFFORTLESS 4-STEP PROCESS</p>
            <h2>How sending a package works on Mova.</h2>
          </div>

          <div class="public-steps" style="margin-top: 2rem;">
            <div>
              <article>
                <b>01</b>
                <span><strong>Enter Delivery Details</strong><br>Specify pickup and recipient address, package category, and weight in the Mova app.</span>
              </article>
              <article>
                <b>02</b>
                <span><strong>Doorstep Courier Pickup</strong><br>The closest courier is matched in minutes and arrives at your door to safely collect and verify the package.</span>
              </article>
              <article>
                <b>03</b>
                <span><strong>Live Map Tracking</strong><br>Both sender and recipient receive a live tracking link with courier telemetry and real-time ETA updates.</span>
              </article>
              <article>
                <b>04</b>
                <span><strong>Secure OTP Handoff</strong><br>Recipient inspects the parcel, shares their 4-digit verification code, and instant proof of delivery is logged.</span>
              </article>
            </div>
          </div>

          <div class="public-page-actions" style="margin-top: 3rem;">
            <a class="button button--primary" href="${rootPath}#get-mova">
              Send a Package
              ${iconSvg("arrow-up-right", 18)}
            </a>
            <a class="button button--secondary" href="${rootPath}help/">
              Delivery Questions
            </a>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "Mova Delivery — Fast On-Demand Courier & Merchant Logistics",
    description: "Send parcels, food, documents, and bulk cargo across Nigerian cities. Live GPS courier tracking, recipient OTP verification, and merchant API.",
    canonicalPath: "/deliver",
    rootPath,
    activeSlug: "deliver",
    bodyContent
  });
}

function generateSafetyPage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--safety">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="ambient-glow-orb" aria-hidden="true"></div>
        <div class="container enterprise-hero-grid">
          <div class="enterprise-hero-copy">
            <p class="eyebrow">${iconSvg("shield-fill", 16)} MOVA SAFETY CENTER</p>
            <h1>Your safety is our<br>highest commitment.</h1>
            <p>
              Safety at Mova is not an afterthought — it is engineered into every line of code and every completed mile. From mandatory facial biometric verification before every driver shift to 24/7 AI telematics monitoring and rapid emergency dispatch, we protect your journey from start to finish.
            </p>
            <div class="enterprise-hero-actions">
              <a class="button button--primary" href="#safety-pillars">
                Our 4 Safety Pillars
                ${iconSvg("arrow-up-right", 18)}
              </a>
              <a class="button button--secondary" href="#emergency-hotline">
                24/7 Safety Hotline
              </a>
            </div>
          </div>
          <div class="enterprise-hero-visual">
            <img src="${rootPath}images/marketing/safety-hero.jpg" alt="Mova safety telematics and operations command center" loading="eager">
            <div class="hero-floating-stat">
              <i></i>
              <span>24/7 Emergency Incident Command Center Active</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 4 Pillars of Safety -->
      <section class="section" id="safety-pillars">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">COMPREHENSIVE MULTI-LAYERED SECURITY</p>
            <h2>Protected before, during, and after every trip.</h2>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("user-regular", 28)}</div>
              <h3>1. Biometric Driver Screening</h3>
              <p>
                Drivers must complete a live facial recognition scan before logging on to ensure account ownership. Every driver undergoes government NIN validation, criminal background checks, and driving history verification.
              </p>
              <div class="category-card-meta">
                <span>BEFORE EVERY TRIP</span>
                <strong>Zero Account Sharing</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("navigation-fill", 28)}</div>
              <h3>2. Active Telematics & AI RideCheck</h3>
              <p>
                Our intelligent backend monitors every ride in real-time. If a vehicle takes an unusual stationary stop, deviates significantly from the planned route, or registers sudden impact telemetry, an automated safety check is triggered.
              </p>
              <div class="category-card-meta">
                <span>DURING EVERY RIDE</span>
                <strong>Real-time Telemetry</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("lock-duotone", 28)}</div>
              <h3>3. In-App Privacy & Virtual Masking</h3>
              <p>
                Your personal phone number is never revealed. Calls and text messages between riders and drivers are routed through encrypted virtual numbers to guarantee privacy even after the trip concludes.
              </p>
              <div class="category-card-meta">
                <span>PRIVACY FIRST</span>
                <strong>Encrypted Numbers</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("shield-duotone", 28)}</div>
              <h3>4. Post-Trip Care & Incident Resolution</h3>
              <p>
                Our 24/7 dedicated Safety Command team conducts rapid trip investigation, liaison with local emergency services, and fair arbitration for any security or transit dispute.
              </p>
              <div class="category-card-meta">
                <span>INCIDENT CARE</span>
                <strong>24/7 Command Center</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Emergency Dispatch & Protocols -->
      <section class="section" id="emergency-hotline" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">RAPID EMERGENCY INTERVENTION</p>
            <h2>Direct emergency response at your fingertips.</h2>
          </div>

          <div class="category-card-grid" style="grid-template-columns: repeat(3, 1fr);">
            <div class="category-card" style="border-top: 4px solid var(--mova-green-500);">
              <div class="category-card-icon">${iconSvg("bell-fill", 28)}</div>
              <h3>In-App SOS Button</h3>
              <p>Tap the shield icon in the Mova app during any trip to trigger our rapid response team. Your live GPS coordinates, vehicle details, and driver identity are instantly transmitted to emergency responders.</p>
              <div class="category-card-meta">
                <span>ONE-TAP DISPATCH</span>
                <strong>Immediate Response</strong>
              </div>
            </div>

            <div class="category-card" style="border-top: 4px solid #0284c7;">
              <div class="category-card-icon">${iconSvg("path-duotone", 28)}</div>
              <h3>Share My Trip Link</h3>
              <p>Pre-configure up to 5 trusted family or friends. With a single tap, share your live moving vehicle location, driver name, photo, and estimated arrival time directly via WhatsApp or SMS.</p>
              <div class="category-card-meta">
                <span>FAMILY PEACE OF MIND</span>
                <strong>Live GPS Route</strong>
              </div>
            </div>

            <div class="category-card" style="border-top: 4px solid #e11d48;">
              <div class="category-card-icon">${iconSvg("shield-fill", 28)}</div>
              <h3>24/7 Safety Command Hotline</h3>
              <p>Our dedicated safety response command center operates 24 hours a day, 7 days a week, 365 days a year for urgent incident response and immediate assistance.</p>
              <div class="category-card-meta">
                <span>CALL TOLL-FREE</span>
                <strong><a href="tel:+2347047838642" style="color: inherit;">+234 704 783 8642</a></strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Rider & Driver Safety Golden Rules -->
      <section class="section">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">COMMUNITY SAFETY STANDARDS</p>
            <h2>The 3-point check before you enter a vehicle.</h2>
          </div>

          <div class="public-steps" style="margin-top: 2rem;">
            <div>
              <article>
                <b>01</b>
                <span><strong>Verify the License Plate</strong><br>Check that the vehicle's registration plate matches the exact plate number displayed in your Mova app.</span>
              </article>
              <article>
                <b>02</b>
                <span><strong>Confirm the Driver's Photo & Name</strong><br>Look at your driver's profile in the app and confirm the face matches the person behind the wheel.</span>
              </article>
              <article>
                <b>03</b>
                <span><strong>Ask 'Who are you picking up?'</strong><br>Let the driver say your name before entering, and confirm your destination together.</span>
              </article>
              <article>
                <b>04</b>
                <span><strong>Fasten Your Seatbelt</strong><br>Buckle up in the back or front seat for your safety throughout the trip.</span>
              </article>
            </div>
          </div>

          <div class="public-page-actions" style="margin-top: 3rem;">
            <a class="button button--primary" href="${rootPath}#get-mova">
              Get Mova App
              ${iconSvg("arrow-up-right", 18)}
            </a>
            <a class="button button--secondary" href="${rootPath}help/">
              Visit Help Center
            </a>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "Mova Safety Center — Protected at Every Step",
    description: "Learn about Mova's multi-layered security ecosystem: biometric facial screening, 24/7 AI telematics monitoring, in-trip SOS dispatch, and dedicated incident support.",
    canonicalPath: "/safety",
    rootPath,
    activeSlug: "safety",
    bodyContent
  });
}

function generateCitiesPage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--cities">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="ambient-glow-orb" aria-hidden="true"></div>
        <div class="container enterprise-hero-grid">
          <div class="enterprise-hero-copy">
            <p class="eyebrow">${iconSvg("map-pin-fill", 16)} MOVA OPERATING METROS</p>
            <h1>Moving people and goods<br>across vibrant cities.</h1>
            <p>
              From high-density commercial mega-cities to regional economic powerhouses, Mova connects riders, drivers, and businesses with fair, reliable transportation. Explore our live service area in Lagos and see our expansion roadmap.
            </p>
            <div class="enterprise-hero-actions">
              <a class="button button--primary" href="#metro-grid">
                View Cities
                ${iconSvg("arrow-up-right", 18)}
              </a>
              <a class="button button--secondary" href="#city-request">
                Request Your City
              </a>
            </div>
          </div>
          <div class="enterprise-hero-visual">
            <img src="${rootPath}images/marketing/rider-hero.jpg" alt="Mova passenger travelling through modern Lagos city street" loading="eager">
            <div class="hero-floating-stat">
              <i></i>
              <span><span class="counter-num" data-target="1">1</span> Live City: Lagos · More cities and countries coming soon</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive City Directory & Filter Bar -->
      <section class="section" id="metro-grid">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">CITY DIRECTORY</p>
            <h2>Live in Lagos. More cities coming soon.</h2>
            <p class="section-copy" style="max-width: 680px; margin-inline: auto;">
              Select a filter or search below to find available ride tiers, parcel courier dispatch, and driver earning hubs in your metropolitan region.
            </p>
          </div>

          <div class="city-filter-bar">
            <div style="display: flex; gap: 0.65rem; flex-wrap: wrap;" id="city-filter-pills">
              <button type="button" class="city-filter-btn is-active" data-city-filter="all">
                ${iconSvg("map-pin-fill", 15)}
                All Cities (11)
              </button>
              <button type="button" class="city-filter-btn" data-city-filter="active">
                <span class="pulse-dot"></span>
                Active Now (1)
              </button>
              <button type="button" class="city-filter-btn" data-city-filter="nigeria">
                🇳🇬 Nigeria (7)
              </button>
              <button type="button" class="city-filter-btn" data-city-filter="international">
                🌐 International Roadmap (4)
              </button>
            </div>

            <input type="text" class="city-search-input" id="city-search-input" placeholder="Search cities, states, hubs (e.g. Lagos, Lekki, Abuja, Cargo)..." autocomplete="off">
          </div>

          <div class="city-metro-grid" id="city-metro-cards">
            <!-- Lagos -->
            <article class="city-metro-card" data-city="lagos ikeja lekki vi surulere yaba nigeria" data-active="true" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge">Active 24/7</span>
              </div>
              <h3>Lagos</h3>
              <p>Lagos State · First Commercial Launch Market</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> Victoria Island, Lekki Phase 1, Ikeja, Surulere, Yaba, MMA International Airport.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}ride/" class="city-service-tag">Mova Comfort</a>
                <a href="${rootPath}ride/" class="city-service-tag">Mova XL</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Bike Express</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Cargo Logistics</a>
              </div>
              <div class="city-card-actions">
                <a href="${rootPath}ride/" class="button button--primary button--sm">Ride in Lagos</a>
                <a href="${rootPath}drive/" class="button button--secondary button--sm">Drive</a>
                <a href="${rootPath}deliver/" class="button button--secondary button--sm">Deliver</a>
              </div>
            </article>

            <!-- Abuja -->
            <article class="city-metro-card" data-city="abuja fct maitama wuse gwarinpa nigeria" data-active="false" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge region-status-badge--soon">Coming soon</span>
              </div>
              <h3>Abuja (FCT)</h3>
              <p>Federal Capital Territory · Metro & Airport Corridors</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> Wuse 2, Central Business District, Gwarinpa, Maitama, Nnamdi Azikiwe Airport.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}ride/" class="city-service-tag">Mova Comfort</a>
                <a href="${rootPath}ride/" class="city-service-tag">VIP Executive</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Express Courier</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--secondary button--sm">Request Abuja</a>
              </div>
            </article>

            <!-- Port Harcourt -->
            <article class="city-metro-card" data-city="port harcourt rivers gra trans-amadi nigeria" data-active="false" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge region-status-badge--soon">Coming soon</span>
              </div>
              <h3>Port Harcourt</h3>
              <p>Rivers State · Garden City Energy Hub</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> GRA Phase 2, Peter Odili Road, Trans-Amadi, PHC Airport.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}ride/" class="city-service-tag">Mova Comfort</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Parcel Express</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Fleet Logistics</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--secondary button--sm">Request Port Harcourt</a>
              </div>
            </article>

            <!-- Ibadan -->
            <article class="city-metro-card" data-city="ibadan oyo bodija dugbe ring road nigeria" data-active="false" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge region-status-badge--soon">Coming soon</span>
              </div>
              <h3>Ibadan</h3>
              <p>Oyo State · Ancient City & Commercial Center</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> Bodija, Ring Road, University of Ibadan corridor, Dugbe.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Express Bike Delivery</a>
                <a href="${rootPath}ride/" class="city-service-tag">Metered Trips</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--secondary button--sm">Request Ibadan</a>
              </div>
            </article>

            <!-- Benin City -->
            <article class="city-metro-card" data-city="benin city edo ugbowo ring road gra nigeria" data-active="false" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge region-status-badge--soon">Coming soon</span>
              </div>
              <h3>Benin City</h3>
              <p>Edo State · South-South Transit & Cultural Hub</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> Airport Road, Ring Road, Ugbowo, GRA.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Express Courier</a>
                <a href="${rootPath}ride/" class="city-service-tag">Make an Offer</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--secondary button--sm">Request Benin City</a>
              </div>
            </article>

            <!-- Abeokuta -->
            <article class="city-metro-card" data-city="abeokuta ogun oke-mosan ibara kuto nigeria" data-active="false" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge region-status-badge--soon">Coming soon</span>
              </div>
              <h3>Abeokuta</h3>
              <p>Ogun State · Industrial & Gateway Corridor</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> Oke-Mosan, Ibara, Kuto, Sagamu Interchange link.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Express Delivery</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--secondary button--sm">Request Abeokuta</a>
              </div>
            </article>

            <!-- Kano -->
            <article class="city-metro-card" data-city="kano nassarawa bompai sabon gari nigeria" data-active="false" data-region="nigeria">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇳🇬</span>
                <span class="region-status-badge region-status-badge--soon">Coming soon</span>
              </div>
              <h3>Kano</h3>
              <p>Kano State · Northern Commercial Megacity</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Hubs:</strong> Nassarawa, Bompai, Sabon Gari, Mallam Aminu Kano Airport.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Commercial Cargo</a>
                <a href="${rootPath}ride/" class="city-service-tag">Bidding Mode</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--secondary button--sm">Request Kano</a>
              </div>
            </article>

            <!-- Accra, Ghana -->
            <article class="city-metro-card" data-city="accra ghana osu airport legon international" data-active="false" data-region="international">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇬🇭</span>
                <span class="region-status-badge region-status-badge--soon">Launching Q1 2027</span>
              </div>
              <h3>Accra</h3>
              <p>Greater Accra · Ghana Commercial Expansion</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Target Hubs:</strong> Airport City, Osu, East Legon, Spintex Road, Tema.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go (GHS)</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Moto Courier</a>
                <a href="${rootPath}ride/" class="city-service-tag">Comfort Fleet</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--primary button--sm">Pre-Register Driver</a>
                <a href="#city-request" class="button button--secondary button--sm">Notify Me</a>
              </div>
            </article>

            <!-- Nairobi, Kenya -->
            <article class="city-metro-card" data-city="nairobi kenya westlands kilimani upper hill international" data-active="false" data-region="international">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇰🇪</span>
                <span class="region-status-badge region-status-badge--soon">Launching Q2 2027</span>
              </div>
              <h3>Nairobi</h3>
              <p>Nairobi County · East Africa Mobility Hub</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Target Hubs:</strong> Westlands, Kilimani, Upper Hill, JKIA Airport.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Go (KES)</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Boda Delivery</a>
                <a href="${rootPath}ride/" class="city-service-tag">M-Pesa Integration</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--primary button--sm">Pre-Register Driver</a>
                <a href="#city-request" class="button button--secondary button--sm">Notify Me</a>
              </div>
            </article>

            <!-- Kigali, Rwanda -->
            <article class="city-metro-card" data-city="kigali rwanda nyarugenge gasabo kacyiru international" data-active="false" data-region="international">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇷🇼</span>
                <span class="region-status-badge region-status-badge--soon">Roadmap 2027</span>
              </div>
              <h3>Kigali</h3>
              <p>Rwanda · Innovation & Green Transit Pilot</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Target Hubs:</strong> Nyarugenge CBD, Kacyiru, Remera, Kigali Convention Centre.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova EV Taxi</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Clean Moto</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--primary button--sm">Pre-Register Driver</a>
                <a href="#city-request" class="button button--secondary button--sm">Notify Me</a>
              </div>
            </article>

            <!-- Johannesburg, South Africa -->
            <article class="city-metro-card" data-city="johannesburg south africa sandton rosebank gauteng international" data-active="false" data-region="international">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <span class="region-card-flag">🇿🇦</span>
                <span class="region-status-badge region-status-badge--soon">Roadmap 2027</span>
              </div>
              <h3>Johannesburg</h3>
              <p>Gauteng · Southern Africa Commercial Center</p>
              <div style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 0.85rem; line-height: 1.5;">
                <strong>Target Hubs:</strong> Sandton CBD, Rosebank, Midrand, OR Tambo Airport corridor.
              </div>
              <div class="city-service-tags">
                <a href="${rootPath}ride/" class="city-service-tag">Mova Select (ZAR)</a>
                <a href="${rootPath}deliver/" class="city-service-tag">Express Courier</a>
                <a href="${rootPath}ride/" class="city-service-tag">Fleet B2B</a>
              </div>
              <div class="city-card-actions">
                <a href="#city-request" class="button button--primary button--sm">Pre-Register Driver</a>
                <a href="#city-request" class="button button--secondary button--sm">Notify Me</a>
              </div>
            </article>
          </div>

          <!-- Empty search state -->
          <div id="no-city-results" style="display: none; text-align: center; padding: 3.5rem 1rem; color: var(--text-secondary);">
            <p style="font-size: 1.15rem; font-weight: 700; color: var(--mova-navy-950);">No matching city found</p>
            <p>We are actively voting on new regional locations. Request your city below!</p>
          </div>
        </div>
      </section>

      <!-- Request Your City Voting Module -->
      <section class="section section--muted" id="city-request">
        <div class="container" style="max-width: 780px;">
          <div class="section-header text-center">
            <p class="eyebrow">${iconSvg("thumbs-up-duotone", 16)} COMMUNITY EXPANSION VOTE</p>
            <h2>Want Mova in your hometown?</h2>
            <p class="section-copy">
              Our market launch sequence is directly guided by community demand. Cast your vote or sign up early as a founding driver partner in your metropolitan area.
            </p>
          </div>

          <form id="city-vote-form" class="city-vote-form" style="display: grid; gap: 1rem; background: white; padding: 2.25rem; border-radius: 1.25rem; box-shadow: var(--shadow-soft); border: 1px solid var(--border-subtle);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label for="vote-name" style="display: block; font: 700 0.82rem var(--font-jakarta); margin-bottom: 0.4rem;">Your Name</label>
                <input type="text" id="vote-name" required placeholder="e.g. Tunde Adebayo" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-subtle); border-radius: 0.65rem; font-size: 0.9rem;">
              </div>
              <div>
                <label for="vote-email" style="display: block; font: 700 0.82rem var(--font-jakarta); margin-bottom: 0.4rem;">Email Address</label>
                <input type="email" id="vote-email" required placeholder="tunde@example.com" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-subtle); border-radius: 0.65rem; font-size: 0.9rem;">
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <label for="vote-city" style="display: block; font: 700 0.82rem var(--font-jakarta); margin-bottom: 0.4rem;">City / Town</label>
                <input type="text" id="vote-city" required placeholder="e.g. Asaba, Calabar, Enugu, Kumasi" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-subtle); border-radius: 0.65rem; font-size: 0.9rem;">
              </div>
              <div>
                <label for="vote-role" style="display: block; font: 700 0.82rem var(--font-jakarta); margin-bottom: 0.4rem;">I want to use Mova as</label>
                <select id="vote-role" style="width: 100%; padding: 0.75rem 1rem; border: 1px solid var(--border-subtle); border-radius: 0.65rem; font-size: 0.9rem; background: white;">
                  <option value="rider">Rider / Passenger</option>
                  <option value="driver">Driver Partner (Earn with vehicle)</option>
                  <option value="courier">Delivery Courier / Merchant</option>
                  <option value="fleet">Fleet Owner / Enterprise</option>
                </select>
              </div>
            </div>

            <button type="submit" class="button button--primary button--full" style="margin-top: 0.75rem; padding-block: 0.85rem; font-size: 1rem;">
              Cast Vote for My City
              ${iconSvg("arrow-up-right", 18)}
            </button>

            <div id="city-vote-success" style="display: none; padding: 1rem; border-radius: 0.75rem; background: #eef9f2; border: 1px solid var(--mova-green-500); color: #004d26; text-align: center; font: 700 0.9rem var(--font-jakarta);">
              ✓ Vote Recorded! Thank you for bringing Mova to your city. We will notify you when launch milestones begin in your region!
            </div>
          </form>
        </div>
      </section>

      <!-- Launch Roadmap Stats -->
      <section class="section">
        <div class="container">
          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("car-fill", 28)}</div>
              <h3>100% Regional Focus</h3>
              <p>Tailored pricing tariffs and local driver support hubs for every operating municipality.</p>
              <div class="category-card-meta">
                <span>LOCAL ROOTS</span>
                <strong>Decentralized Operations</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("shield-duotone", 28)}</div>
              <h3>Full Incident Support</h3>
              <p>24/7 Safety Command Center tracking active corridors in Lagos and every city as we launch.</p>
              <div class="category-card-meta">
                <span>SAFETY FIRST</span>
                <strong>24/7 Liaison</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("check-fill", 28)}</div>
              <h3>Weekly Bank Payouts</h3>
              <p>Guaranteed automated driver payout settlement every single Monday in every city we operate.</p>
              <div class="category-card-meta">
                <span>CONSISTENCY</span>
                <strong>Monday Settlements</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "Mova in Your City · Active Operating Metros & Service Areas",
    description: "Mova is live in Lagos, Nigeria, with Abuja, Port Harcourt, Ibadan, Benin, and more African cities coming soon.",
    canonicalPath: "/cities",
    rootPath,
    activeSlug: "cities",
    bodyContent
  });
}

function generateAboutPage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--about">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="ambient-glow-orb" aria-hidden="true"></div>
        <div class="container enterprise-hero-grid">
          <div class="enterprise-hero-copy">
            <p class="eyebrow">${iconSvg("handshake-duotone", 16)} ABOUT MOVA INTEGRATED MOBILITY</p>
            <h1>Fair mobility built on<br>transparency and respect.</h1>
            <p>
              We founded Mova to solve a fundamental imbalance in urban transportation: monopolies charging drivers punitive 25% commissions while subjecting passengers to unpredictable algorithmic surge pricing. We are building Africa's fairest mobility ecosystem where drivers keep what they earn and riders always have a choice.
            </p>
            <div class="enterprise-hero-actions">
              <a class="button button--primary" href="#our-mission">
                Our Guiding Values
                ${iconSvg("arrow-up-right", 18)}
              </a>
              <a class="button button--secondary" href="#executive-leadership">
                Leadership & Governance
              </a>
            </div>
          </div>
          <div class="enterprise-hero-visual">
            <img src="${rootPath}images/marketing/about-hero.jpg" alt="Mova executive leadership and engineering team in modern architectural boardroom" loading="eager">
            <div class="hero-floating-stat">
              <i></i>
              <span>15,000+ driver partners empowered across Africa</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Operational Metrics -->
      <section class="section" style="background: #fbfdfc; border-bottom: 1px solid var(--border-subtle); padding-block: 3.5rem;">
        <div class="container">
          <div class="earnings-calc-results" style="grid-template-columns: repeat(4, 1fr); margin-top: 0; background: white;">
            <div>
              <small>Daily Active Rides</small>
              <strong>18,400+</strong>
            </div>
            <div>
              <small>Verified Driver Partners</small>
              <strong>15,200+</strong>
            </div>
            <div>
              <small>Trip Completion Rate</small>
              <strong>99.4%</strong>
            </div>
            <div>
              <small>Avg. Courier Delivery</small>
              <strong>28 mins</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- Guiding Values -->
      <section class="section" id="our-mission">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">OUR CORE PRINCIPLES</p>
            <h2>The convictions that drive every decision.</h2>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon">${iconSvg("dollar-duotone", 28)}</div>
              <h3>1. Fair Take Rates</h3>
              <p>
                We take only 10% platform commission compared to legacy competitors taking 20% to 25%. This allows our driver partners to build genuine savings, maintain better vehicles, and invest in their families' futures.
              </p>
              <div class="category-card-meta">
                <span>DRIVER DIGNITY</span>
                <strong>10% Lowest Fee</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("handshake-duotone", 28)}</div>
              <h3>2. Mutual Price Discovery</h3>
              <p>
                We reject the black-box algorithms that create friction between drivers and passengers. By enabling passenger offers, fixed fares, and counter-offers, we put economic agency back into human hands.
              </p>
              <div class="category-card-meta">
                <span>FREE MARKET CHOICE</span>
                <strong>Open Bargaining</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("shield-duotone", 28)}</div>
              <h3>3. Zero-Compromise Safety</h3>
              <p>
                From daily biometric facial verification before shift login to active AI telematics and round-the-clock emergency incident dispatch, we treat the safety of our riders and drivers with existential seriousness.
              </p>
              <div class="category-card-meta">
                <span>END-TO-END SECURITY</span>
                <strong>24/7 Monitoring</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon">${iconSvg("path-duotone", 28)}</div>
              <h3>4. Sustainable Green Transit</h3>
              <p>
                Africa's urban centers deserve clean air. We are actively piloting electric two-wheelers and EV sedans, committing to transition 30% of our active urban fleet to zero tailpipe emissions by 2030.
              </p>
              <div class="category-card-meta">
                <span>SUSTAINABILITY</span>
                <strong>Clean Urban Air</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Executive Leadership & Corporate Governance -->
      <section class="section" id="executive-leadership" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">LEADERSHIP & GOVERNANCE</p>
            <h2>Led by experienced African mobility pioneers.</h2>
            <p class="section-lead" style="max-width: 680px; margin-inline: auto;">
              Our leadership team combines deep local market operational expertise with engineering rigor from world-class global technology organizations.
            </p>
          </div>

          <div class="category-card-grid">
            <div class="category-card">
              <div class="category-card-icon" style="background: #e0f2fe; color: #0369a1;">${iconSvg("user-regular", 28)}</div>
              <h3>Chief Executive Officer</h3>
              <p style="font-weight: 600; color: var(--mova-navy-950); margin-bottom: 0.25rem;">Executive Leadership</p>
              <p>15+ years scaling African logistics and multi-market consumer technology. Passionate about empowering local transportation operators through fair marketplace dynamics.</p>
              <div class="category-card-meta">
                <span>OPERATIONS & STRATEGY</span>
                <strong>Executive Board</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon" style="background: #fdf4ff; color: #9333ea;">${iconSvg("navigation-duotone", 28)}</div>
              <h3>Chief Technology Officer</h3>
              <p style="font-weight: 600; color: var(--mova-navy-950); margin-bottom: 0.25rem;">Platform & Telematics</p>
              <p>Former Principal Infrastructure Engineer specializing in distributed telematics, real-time geospatial routing algorithms, and high-concurrency payment engines.</p>
              <div class="category-card-meta">
                <span>ENGINEERING & AI</span>
                <strong>Technology Core</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon" style="background: #fef2f2; color: #dc2626;">${iconSvg("shield-fill", 28)}</div>
              <h3>Head of Safety & Regulatory</h3>
              <p style="font-weight: 600; color: var(--mova-navy-950); margin-bottom: 0.25rem;">Legal & Community Safety</p>
              <p>Former Senior Legal Counsel and transport policy specialist leading Mova's law enforcement liaison, driver vetting protocols, and NDPA privacy compliance.</p>
              <div class="category-card-meta">
                <span>SAFETY & COMPLIANCE</span>
                <strong>Regulatory Affairs</strong>
              </div>
            </div>

            <div class="category-card">
              <div class="category-card-icon" style="background: #f0fdf4; color: #16a34a;">${iconSvg("car-fill", 28)}</div>
              <h3>VP of Driver Operations</h3>
              <p style="font-weight: 600; color: var(--mova-navy-950); margin-bottom: 0.25rem;">Fleet & Partnerships</p>
              <p>Directly oversees our 5 driver support centers, vehicle inspection hubs, fuel partnership networks, and driver welfare support programs.</p>
              <div class="category-card-meta">
                <span>DRIVER EMPOWERMENT</span>
                <strong>Partner Network</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Legal & Corporate Compliance -->
      <section class="section">
        <div class="container text-center">
          <div style="max-width: 780px; margin: 0 auto; padding: 2.5rem; border-radius: 1.5rem; background: white; border: 1px solid var(--border-subtle); box-shadow: 0 10px 30px rgba(0,23,44,0.06);">
            <p class="eyebrow">CORPORATE GOVERNANCE</p>
            <h3 style="font-size: 1.45rem; margin-bottom: 0.75rem;">Fully Registered & Compliant</h3>
            <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">
              MOVA INTEGRATED MOBILITY LTD is a legally registered company incorporated under the laws of the Federal Republic of Nigeria (CAC RC: 7284910). We comply with all transport authority guidelines across Lagos State (LASDRIVE/MOT), the Federal Capital Territory, Rivers State, and Ogun State.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
              <a class="button button--secondary" href="${rootPath}legal/terms/">Read General Terms</a>
              <a class="button button--secondary" href="${rootPath}legal/privacy/">Review Privacy Policy</a>
              <a class="button button--primary" href="${rootPath}cities/">View Operating Cities</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "About Mova — Fair Mobility Engineered for Africa",
    description: "Learn about Mova's mission to transform African urban transport through mutual price agreement, 10% low commissions, and sustainable driver empowerment.",
    canonicalPath: "/about",
    rootPath,
    activeSlug: "about",
    bodyContent
  });
}

function generateHelpPage(rootPath = "../") {
  const bodyContent = `
    <main id="main-content" class="public-page public-page--help">
      <!-- Enterprise Hero Section -->
      <section class="enterprise-hero">
        <div class="container text-center">
          <p class="eyebrow">${iconSvg("chat-duotone", 16)} MOVA 24/7 SUPPORT CENTER</p>
          <h1 style="max-width: 820px; margin-inline: auto;">How can we help you<br>move today?</h1>
          <p style="max-width: 620px; margin-inline: auto; margin-bottom: 2rem;">
            Search our knowledge base for instant answers or connect directly with our round-the-clock support agents.
          </p>

          <div class="help-search-container">
            <div class="help-search-box">
              <svg width="22" height="22" viewBox="0 0 256 256" fill="#8899a6" aria-hidden="true"><path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"/></svg>
              <input type="text" id="help-search-input" placeholder="Search questions, keywords (e.g. fare, refund, driver, payout, safety)..." autocomplete="off">
            </div>
          </div>
        </div>
      </section>

      <!-- Category Selection Grid -->
      <section class="section" style="padding-top: 0;">
        <div class="container">
          <div class="help-category-grid">
            <button type="button" class="help-category-btn is-active" data-help-cat="all">
              ${iconSvg("check-duotone", 32)}
              <h4>All Topics</h4>
              <small>Browse all articles</small>
            </button>
            <button type="button" class="help-category-btn" data-help-cat="rider">
              ${iconSvg("car-duotone", 32)}
              <h4>Rider Support</h4>
              <small>Fares, bidding, payments</small>
            </button>
            <button type="button" class="help-category-btn" data-help-cat="driver">
              ${iconSvg("handshake-duotone", 32)}
              <h4>Driver Partners</h4>
              <small>Payouts, commission, docs</small>
            </button>
            <button type="button" class="help-category-btn" data-help-cat="delivery">
              ${iconSvg("package-duotone", 32)}
              <h4>Delivery & Business</h4>
              <small>Parcel tracking, bulk API</small>
            </button>
          </div>

          <!-- FAQ Accordion List -->
          <div class="faq-accordion-group" id="help-faq-group">
            <!-- Rider FAQs -->
            <details data-cat="rider" data-keywords="offer bidding price fare suggest negotiate">
              <summary>How does 'Make an Offer' work when booking a ride?</summary>
              <p>
                When you enter your pickup and destination, Mova displays a recommended fair pricing range based on distance and live traffic. You can type in your own offer within that range. Nearby verified drivers review your offer and can accept it instantly or reply with a reasonable counter-offer. You then choose which driver to accept based on their car model, rating, and arrival ETA.
              </p>
            </details>

            <details data-cat="rider" data-keywords="fixed price upfront guaranteed surge cost">
              <summary>What is the difference between Fixed Price and Metered rides?</summary>
              <p>
                With <strong>Fixed Price</strong>, the fare you see before tapping 'Request' is 100% guaranteed. Heavy traffic, rain, or taking a scenic route will never increase your price. With <strong>Metered rides</strong>, your final fare is calculated dynamically based on the exact minutes and kilometers traveled — perfect for spontaneous trips with multiple stops.
              </p>
            </details>

            <details data-cat="rider" data-keywords="payment cash card transfer ussd receipt">
              <summary>What payment methods does Mova support?</summary>
              <p>
                Mova supports debit and credit cards (Mastercard, Visa, Verve), direct bank transfer, USSD, and cash payments directly to the driver. All card payments are processed securely through PCI-DSS Level 1 certified gateways. An electronic receipt is sent to your email immediately upon trip completion.
              </p>
            </details>

            <details data-cat="rider" data-keywords="lost item forgot property phone bag">
              <summary>What should I do if I left an item in a Mova vehicle?</summary>
              <p>
                Open your Mova app, go to <strong>Trip History</strong>, select the trip in question, and tap <strong>'Find Lost Item'</strong> to call your driver directly through our encrypted phone masking system. If you cannot reach your driver, contact our 24/7 Safety Command Hotline at +234 704 783 8642 and our dispatch team will assist in recovering your item.
              </p>
            </details>

            <!-- Driver FAQs -->
            <details data-cat="driver" data-keywords="commission 10 percent earnings fees take rate">
              <summary>What is Mova's commission rate and how does it compare to Bolt?</summary>
              <p>
                Mova charges only <strong>10% platform commission</strong>. Competitor platforms like Bolt and Uber charge between 20% and 25% commission. By driving with Mova, you keep 90% of every completed trip, earning on average an extra ₦120,000 to ₦160,000 in your pocket every month for the same driving hours.
              </p>
            </details>

            <details data-cat="driver" data-keywords="payout weekly bank transfer withdrawal money cycle monday">
              <summary>How do weekly bank payouts work for drivers?</summary>
              <p>
                Driver earnings from card payments and corporate bookings are accumulated throughout the week and disbursed once every week on Monday directly into your verified Nigerian bank account, with full itemized earnings and zero hidden deductions.
              </p>
            </details>

            <details data-cat="driver" data-keywords="requirements documents license inspection car vehicle">
              <summary>What documents do I need to register as a Mova driver?</summary>
              <p>
                To get approved, you need: (1) A valid Nigerian Driver’s License (plus LASDRI in Lagos State), (2) A 4-door vehicle manufactured 2004 or newer with working air conditioning, (3) Valid vehicle registration documents and roadworthiness certificate, and (4) Passing our quick 15-minute physical inspection at any Mova Driver Partner Hub.
              </p>
            </details>

            <details data-cat="driver" data-keywords="destination see upfront transparent reject counter">
              <summary>Can I see the passenger's destination before accepting a trip?</summary>
              <p>
                Yes! 100% of the trip information is visible upfront: pickup spot, exact drop-off destination, passenger offer price, and payment method. You have full transparency before deciding whether to accept, decline, or make a counter-offer.
              </p>
            </details>

            <!-- Delivery FAQs -->
            <details data-cat="delivery" data-keywords="delivery track parcel package courier eta gps">
              <summary>How do I track my package in real time?</summary>
              <p>
                As soon as a courier accepts your delivery request, an active tracking link is generated. You and your recipient can open the link in any mobile browser or the Mova app to follow the courier’s live GPS position, speed, and real-time arrival countdown.
              </p>
            </details>

            <details data-cat="delivery" data-keywords="otp pin proof delivery handoff recipient">
              <summary>How does the OTP proof-of-delivery work?</summary>
              <p>
                When the courier arrives at the destination, they must ask the recipient for the unique 4-digit PIN generated for the order. The courier cannot complete the order in their app without entering this code, guaranteeing that packages are never left unattended or handed to the wrong person.
              </p>
            </details>

            <details data-cat="delivery" data-keywords="prohibited items dangerous illegal money gold">
              <summary>What items are prohibited from Mova Delivery?</summary>
              <p>
                For safety and legal compliance, we prohibit: illegal drugs or narcotics, firearms and explosives, hazardous chemicals, stolen property, loose cash or precious metals, live animals, and flammable liquids. Any suspicious package is subject to immediate police reporting.
              </p>
            </details>

            <details data-cat="delivery" data-keywords="business api merchant bulk invoice corporate ecommerce">
              <summary>How do I set up a corporate business logistics account?</summary>
              <p>
                Businesses dispatching 10+ parcels per day can register for a Mova Business Account to access our developer REST API, batch route optimization (up to 20 dropoffs per courier), monthly consolidated invoicing, and discounted corporate billing. Contact business@mova.ng to set up your account.
              </p>
            </details>

            <!-- Safety FAQs -->
            <details data-cat="safety" data-keywords="sos emergency police accident incident hotline">
              <summary>What should I do in an emergency during a ride?</summary>
              <p>
                Tap the red shield icon in your Mova app to activate the <strong>24/7 Emergency SOS</strong>. This immediately alerts our Safety Incident Command Center and dispatches local emergency response to your live GPS coordinates. You can also call our direct emergency hotline at +234 704 783 8642.
              </p>
            </details>

            <details data-cat="safety" data-keywords="support incident safety dispute resolution hotline">
              <summary>What support is provided in case of an incident during a trip?</summary>
              <p>
                Mova operates a dedicated 24/7 Safety Incident Command Center. In case of any trip disruption, dispute, or unexpected event, tap the in-app SOS button or call our emergency hotline (+234 704 783 8642). Our response team provides immediate assistance, location tracking, and liaison with local authorities.
              </p>
            </details>
          </div>

          <!-- No FAQ Search Results State -->
          <div id="no-faq-results" style="display: none; text-align: center; padding: 3rem 1rem; color: var(--text-secondary);">
            <p style="font-size: 1.15rem; font-weight: 600; color: var(--mova-navy-950);">No matching articles found</p>
            <p>Try searching for a different term or submit a support inquiry below.</p>
          </div>
        </div>
      </section>

      <!-- 24/7 Direct Contact Channels -->
      <section class="section" style="background: #fbfdfc; border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle);">
        <div class="container">
          <div class="section-header text-center">
            <p class="eyebrow">DIRECT CONTACT CHANNELS</p>
            <h2>Connect with our support team 24/7.</h2>
          </div>

          <div class="category-card-grid" style="grid-template-columns: repeat(3, 1fr);">
            <div class="category-card text-center" style="align-items: center;">
              <div class="category-card-icon">${iconSvg("chat-duotone", 28)}</div>
              <h3>In-App Live Chat</h3>
              <p>Connect with a live customer care agent directly in the Mova mobile app. Average response time: under 2 minutes.</p>
              <a class="button button--secondary" href="${rootPath}#get-mova" style="margin-top: auto;">Open In App</a>
            </div>

            <div class="category-card text-center" style="align-items: center;">
              <div class="category-card-icon" style="background: #fef2f2; color: #dc2626;">${iconSvg("bell-fill", 28)}</div>
              <h3>Emergency Safety Hotline</h3>
              <p>Urgent safety concerns, critical accident reports, or lost items. Operating 24 hours a day, 365 days a year.</p>
              <a class="button button--secondary" href="tel:+2347047838642" style="margin-top: auto; color: #dc2626; border-color: #fca5a5;">+234 704 783 8642</a>
            </div>

            <div class="category-card text-center" style="align-items: center;">
              <div class="category-card-icon" style="background: #f0fdf4; color: #16a34a;">${iconSvg("check-fill", 28)}</div>
              <h3>WhatsApp Support</h3>
              <p>Prefer messaging? Chat directly with our verified WhatsApp business support team for general inquiries.</p>
              <a class="button button--secondary" href="https://wa.me/2347047838642" target="_blank" rel="noopener noreferrer" style="margin-top: auto; color: #16a34a; border-color: #86efac;">Chat on WhatsApp</a>
            </div>
          </div>

          <!-- Support Ticket Submission Form -->
          <div class="support-form-card">
            <h3>Submit a Support Ticket</h3>
            <p>Can’t find what you’re looking for? Submit your issue and our customer operations team will respond via email or phone within 2 hours.</p>
            <form id="support-ticket-form">
              <div class="form-group-row">
                <div class="form-control-wrap">
                  <label for="ticket-name">Full Name *</label>
                  <input type="text" id="ticket-name" placeholder="e.g. Tunde Adebayo" required>
                </div>
                <div class="form-control-wrap">
                  <label for="ticket-email">Email or Phone Number *</label>
                  <input type="text" id="ticket-email" placeholder="e.g. name@example.com or 080..." required>
                </div>
              </div>
              <div class="form-group-row">
                <div class="form-control-wrap">
                  <label for="ticket-category">Topic Category *</label>
                  <select id="ticket-category" required>
                    <option value="fare">Fare or Payment Dispute</option>
                    <option value="lost">Lost Personal Item</option>
                    <option value="driver">Driver Partner Account & Payout</option>
                    <option value="delivery">Delivery Status or Parcel Issue</option>
                    <option value="safety">Safety or Conduct Incident</option>
                    <option value="other">General Inquiry</option>
                  </select>
                </div>
                <div class="form-control-wrap">
                  <label for="ticket-trip-id">Trip or Order ID (optional)</label>
                  <input type="text" id="ticket-trip-id" placeholder="e.g. #MOV-94821">
                </div>
              </div>
              <div class="form-control-wrap">
                <label for="ticket-message">Describe Your Inquiry *</label>
                <textarea id="ticket-message" rows="4" placeholder="Please provide as much detail as possible so we can assist you quickly..." required></textarea>
              </div>
              <button type="submit" class="button button--primary" style="width: 100%; justify-content: center;">
                Submit Support Ticket
                ${iconSvg("arrow-up-right", 18)}
              </button>
            </form>
            <div id="ticket-success" style="display: none; margin-top: 1.25rem; padding: 1.25rem; border-radius: 1rem; background: #eef9f2; border: 1.5px solid var(--mova-green-500); color: var(--mova-green-700);">
              <strong style="display: block; font-size: 1.05rem; margin-bottom: 0.35rem;">🎉 Ticket Successfully Submitted!</strong>
              <span style="font-size: 0.92rem; color: #166534;">Your reference ticket ID is <strong id="ticket-ref-id">#MOV-84920</strong>. WhatsApp has opened with your ticket filled in. Press Send there to deliver it to our support team.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  `;

  return renderHtmlShell({
    title: "Mova Help Center — 24/7 Dedicated Support & FAQ Knowledge Base",
    description: "Get answers to your questions about Mova ride options, driver earnings, delivery tracking, account security, and 24/7 customer support.",
    canonicalPath: "/help",
    rootPath,
    activeSlug: "help",
    bodyContent
  });
}


// 5. Legal Center & Document Pages
function generateLegalIndexPage(rootPath = "../") {
  const docsHtml = legalDocuments.map(doc => `
    <article class="legal-document-card">
      <p class="eyebrow">Nigeria Launch Draft</p>
      <h2>${doc.title}</h2>
      <p>${doc.summary}</p>
      <a class="button button--secondary" href="${rootPath}legal/${doc.slug}/">Read document</a>
    </article>
  `).join("");

  const bodyContent = `
    <main id="main-content" class="legal-page">
      <div class="container">
        <header class="legal-intro">
          <p class="eyebrow">Mova Legal Center</p>
          <h1>Public legal documents.</h1>
          <p>These documents describe Mova’s technology platform and marketplace model for the Nigeria launch context.</p>
          <div class="legal-draft-notice">
            <strong>${draftNote}</strong>
            <span>Effective date: To be confirmed · ${draftDate}</span>
          </div>
        </header>
        
        <div class="legal-document-grid">
          ${docsHtml}
        </div>
        
        <p class="legal-center-note">
          General Terms apply broadly. Ride and Delivery terms supplement them. The Privacy Policy explains personal-information handling. All documents remain pending qualified Nigerian legal and privacy counsel review.
        </p>
        
        <a class="public-page__back" href="${rootPath}">
          ${iconSvg("arrow-left", 16)}
          Back to homepage
        </a>
      </div>
    </main>
  `;

  return renderHtmlShell({
    title: "Legal Center — Mova Nigeria Launch Draft",
    description: "Mova Nigeria Launch Draft legal documents and privacy information.",
    canonicalPath: "/legal",
    rootPath,
    activeSlug: "",
    noIndex: true,
    bodyContent
  });
}

function generateLegalDocumentPage(doc, rootPath = "../../") {
  const tocHtml = doc.sections.map(s => `<a href="#${s.id}">${s.title}</a>`).join("");
  const sectionsHtml = doc.sections.map(s => `
    <section id="${s.id}">
      <h2>${s.title}</h2>
      ${s.paragraphs.map(p => `<p>${p}</p>`).join("")}
      ${s.bullets ? `<ul>${s.bullets.map(b => `<li>${b}</li>`).join("")}</ul>` : ""}
    </section>
  `).join("");

  const bodyContent = `
    <main id="main-content" class="legal-page legal-document-page">
      <div class="container">
        <div class="legal-document-layout">
          <aside class="legal-toc" aria-label="Document contents">
            <a href="${rootPath}legal/">← Legal Center</a>
            <p>Contents</p>
            <nav>
              ${tocHtml}
            </nav>
          </aside>
          
          <article class="legal-document">
            <header>
              <p class="eyebrow">Nigeria Launch Draft v1</p>
              <h1>${doc.title}</h1>
              <p class="legal-document-summary">${doc.summary}</p>
              <div class="legal-draft-notice">
                <strong>${draftNote}</strong>
                <span>Effective date: To be confirmed · ${draftDate}</span>
              </div>
            </header>
            
            ${sectionsHtml}
            
            <footer class="legal-document-footer">
              <a href="${rootPath}legal/">Back to Legal Center</a>
              <a href="${rootPath}">Mova homepage</a>
            </footer>
          </article>
        </div>
      </div>
    </main>
  `;

  return renderHtmlShell({
    title: `${doc.title} — Nigeria Draft`,
    description: doc.summary,
    canonicalPath: `/legal/${doc.slug}`,
    rootPath,
    activeSlug: "",
    noIndex: true,
    bodyContent
  });
}

// 6. Generate 404 Page
function generate404Page(rootPath = "") {
  const bodyContent = `
    <main id="main-content" class="public-page">
      <div class="container" style="text-align: center; padding-block: 4rem;">
        <p class="eyebrow">Mova</p>
        <h1 style="margin-inline: auto;">That page moved on.</h1>
        <p class="public-page__description" style="margin-inline: auto;">
          The page you requested is not available. Start again from a public Mova destination.
        </p>
        <div class="button-row" style="justify-content: center; margin-top: 2rem;">
          <a class="button button--primary" href="${rootPath || './'}">Home</a>
          <a class="button button--secondary" href="${rootPath}ride/">Explore Ride</a>
          <a class="button button--secondary" href="${rootPath}help/">Visit Help</a>
        </div>
      </div>
    </main>
  `;

  return renderHtmlShell({
    title: "Page Not Found — Mova",
    description: "The page you requested is not available.",
    canonicalPath: "/404",
    rootPath,
    activeSlug: "",
    noIndex: true,
    bodyContent
  });
}

// 7. Generate Homepage (index.html)
function generateHomepage(rootPath = "") {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Mova",
    "url": siteConfig.url,
    "description": siteConfig.description,
    "logo": `${siteConfig.url}/brand/mova-logo-official.png`,
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NG"
    }
  };

  const bodyContent = `
  <main id="main-content">
    <!-- HERO SECTION -->
    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Mobility, made yours</p>
          <h1>Move your <span>way.</span></h1>
          <p class="hero-manifesto">Your ride. Your price. Your choice.</p>
          <p class="hero-description">Request a ride, make an offer, choose a fixed-price trip, or go metered.</p>
          
          <div class="hero-choices" aria-label="Mova ride pricing choices">
            <span>Make an offer</span>
            <span>Fixed price</span>
            <span>Metered</span>
          </div>
          
          <div class="button-row">
            <a class="button button--primary" href="#get-mova">
              Get Mova
              ${iconSvg("arrow-up-right", 18)}
            </a>
            <a class="button button--secondary" href="#ride-modes">
              Explore ride modes
            </a>
          </div>
          
          <div class="hero-proof">
            <span>
              ${iconSvg("mappin-line-fill", 20)}
              Launching in Nigeria
            </span>
            <span>
              ${iconSvg("check-fill", 20)}
              Three ways to ride
            </span>
            <span>
              ${iconSvg("shield-fill", 20)}
              Built around choice
            </span>
          </div>
        </div>
        
        <!-- Hero Visual with Interactive animations -->
        <div class="hero-visual" id="hero-visual-container">
          <div class="ambient-glow-orb" aria-hidden="true"></div>
          <img class="hero-photo" src="${rootPath}images/marketing/rider-hero.jpg" alt="A rider entering a car in a modern Nigerian city" loading="eager">
          
          <div class="hero-route" aria-hidden="true">
            <span class="hero-route__start"></span>
            <span class="hero-route__end"></span>
            ${iconSvg("car-profile-fill", 20)}
          </div>
          
          <div class="driver-search" aria-hidden="true">
            <i></i><span>Finding a driver</span>
          </div>
          
          <div class="hero-trip-card" data-tilt aria-label="Illustrative matched-driver details">
            <p>
              ${iconSvg("check-fill", 15)}
              Driver matched <em>4 min away</em>
            </p>
            <div class="matched-driver">
              <span class="driver-avatar">KA</span>
              <span>
                <strong>Kareem A.</strong>
                <small>Silver sedan · <span class="counter-num" data-target="4.9" data-decimals="1">4.9</span> ★ · <span class="counter-num" data-target="1420" data-format="comma">1,420</span> trips</small>
              </span>
            </div>
            <div class="trip-point">
              <span>${iconSvg("map-pin-fill", 15)}</span>
              <small>Pickup</small>
              <strong>Your location</strong>
            </div>
            <div class="trip-point">
              <span>${iconSvg("navigation-fill", 15)}</span>
              <small>Destination</small>
              <strong>Choose where to go</strong>
            </div>
          </div>
          
          <div class="hero-offer-card" data-tilt>
            <small>Rider choice selected</small>
            <strong>Make an Offer</strong>
            <span>Illustrative fare · ₦4,500</span>
            <p>Fixed ₦5,200 · Metered available</p>
          </div>
          
          <div class="driver-chip" data-tilt>
            <div class="avatar">KA</div>
            <div>
              <small>Ready for your trip</small>
              <strong>Kareem ${iconSvg("star-fill", 12)} 4.9</strong>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- RIDE MODES SECTION -->
    <section class="section ride-modes-section" id="ride-modes">
      <div class="container">
        <div class="section-heading section-heading--center">
          <p class="eyebrow">The power of choice</p>
          <h2>How do you want to ride today?</h2>
          <p class="section-copy">Different journeys call for different pricing approaches. Mova gives you three clear ways to choose before every request.</p>
        </div>

        <!-- Choice Engine Trip Simulator -->
        <div class="choice-engine-box" role="region" aria-label="Interactive trip and pricing simulator">
          <div class="choice-engine-header">
            <div>
              <span class="choice-engine-badge"><i aria-hidden="true"></i> Choice Simulator</span>
              <h3>Simulate your journey & compare all 3 models</h3>
            </div>
            <div class="distance-pill-group" role="tablist" aria-label="Trip distance presets">
              <button type="button" class="distance-pill" data-km="4">Short Hop (4 km)</button>
              <button type="button" class="distance-pill is-active" data-km="12">City Cruise (12 km)</button>
              <button type="button" class="distance-pill" data-km="24">Cross-Town (24 km)</button>
              <button type="button" class="distance-pill" data-km="36">Airport Run (36 km)</button>
            </div>
          </div>
          <div class="slider-meta-row">
            <span>Trip Distance: <strong id="sim-distance-val">12.0 km</strong></span>
            <span>Estimated Duration: <strong id="sim-duration-val">~24 mins</strong></span>
            <span>Market Context: <strong>Lagos Metro (NGN)</strong></span>
          </div>
          <input type="range" min="3" max="45" value="12" step="1" id="sim-distance-slider" class="mova-range-slider" aria-label="Adjust trip distance in kilometers">
        </div>
        
        <div class="mode-connector" aria-hidden="true"></div>
        
        <div class="ride-mode-grid ride-mode-grid--detailed" role="region" aria-label="Mova ride options">
          <!-- Card 1: Make an Offer -->
          <article class="ride-mode-card spotlight-card">
            <div class="mode-card-head">
              <span class="mode-icon mode-icon--gradient">${iconSvg("handshake-duotone", 25)}</span>
              <span class="mode-badge">More choice</span>
            </div>
            <h3>Make an Offer</h3>
            <p class="mode-subtitle">More say in what you pay</p>
            <p>Suggest a fare within Mova’s configured pricing boundaries. Drivers may accept or respond with a counteroffer where supported.</p>
            
            <div class="mode-ui">
              <div class="mode-ui-label">
                <span>Suggested bracket</span>
                <strong id="offer-suggested-fare">₦4,200 – ₦5,200</strong>
              </div>
              <div class="offer-control">
                <button type="button" id="offer-decrease" aria-label="Decrease illustrative offer">${iconSvg("minus", 14)}</button>
                <div>
                  <small>Your offer</small>
                  <strong id="offer-value">₦4,800</strong>
                </div>
                <button type="button" id="offer-increase" aria-label="Increase illustrative offer">${iconSvg("plus", 14)}</button>
              </div>
              <p class="ui-note">Adjust with +/- or drag the distance simulator above</p>
            </div>
          </article>
          
          <!-- Card 2: Fixed Price (Featured) -->
          <article class="ride-mode-card ride-mode-card--selected spotlight-card">
            <span class="featured-label">Upfront price</span>
            <div class="mode-card-head">
              <span class="mode-icon mode-icon--navy">${iconSvg("lock-duotone", 25)}</span>
              <span class="mode-badge">Clear before booking</span>
            </div>
            <h3>Fixed Price</h3>
            <p class="mode-subtitle">Certainty before you step in</p>
            <p>See the price before the trip and choose whether to proceed. The agreed amount is presented clearly before booking.</p>
            
            <div class="mode-ui">
              <div class="mode-ui-label">
                <span>Upfront price</span>
                <strong>Agreed before trip</strong>
              </div>
              <div class="fixed-total">
                <div>
                  <small>Guaranteed total</small>
                  <strong id="fixed-total-fare">₦5,200</strong>
                </div>
                ${iconSvg("check-fill", 28)}
              </div>
              <p class="ui-note">Fixed upfront fare based on real-time route analysis</p>
            </div>
          </article>
          
          <!-- Card 3: Metered Ride -->
          <article class="ride-mode-card spotlight-card">
            <div class="mode-card-head">
              <span class="mode-icon mode-icon--blue">${iconSvg("path-duotone", 25)}</span>
              <span class="mode-badge">Journey based</span>
            </div>
            <h3>Metered Ride</h3>
            <p class="mode-subtitle mode-subtitle--blue">Fare based on the journey</p>
            <p>Fare reflects the actual journey according to Mova’s metered pricing model, including applicable distance and time.</p>
            
            <div class="mode-ui">
              <div class="mode-ui-label">
                <span>Journey progress</span>
                <strong class="live-label"><i></i> Live</strong>
              </div>
              <div class="meter-total">
                <div>
                  <small>Distance / time</small>
                  <strong id="meter-dist-time">12.0 km <em>· 24m</em></strong>
                </div>
                <div>
                  <small>Estimated fare</small>
                  <strong id="meter-total-fare">₦4,650</strong>
                </div>
              </div>
              <p class="ui-note">${iconSvg("map-trifold", 13)} Live calibrated metered journey</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ECOSYSTEM SECTION -->
    <section class="section section--muted">
      <div class="container">
        <div class="section-heading section-heading--center">
          <p class="eyebrow">The Mova ecosystem</p>
          <h2>One Mova. More ways to move.</h2>
        </div>
        
        <div class="ecosystem-grid" role="region" aria-label="Mova services">
          <article class="ecosystem-card">
            <div class="ecosystem-photo">
              <img src="${rootPath}images/marketing/rider-hero.jpg" alt="A Mova rider travelling with a driver" loading="lazy">
            </div>
            <div>
              <p class="tag">For riders</p>
              <h3>Ride</h3>
              <p>Book a trip with the pricing approach that fits you.</p>
              <a class="button button--ghost" href="ride/">
                Explore rides
                ${iconSvg("arrow-up-right", 18)}
              </a>
            </div>
          </article>
          
          <article class="ecosystem-card">
            <div class="ecosystem-photo">
              <img src="${rootPath}images/marketing/driver-hero.jpg" alt="A driver at the wheel" loading="lazy">
            </div>
            <div>
              <p class="tag">For drivers</p>
              <h3>Drive</h3>
              <p>Find flexible opportunities and choose trips with clear information.</p>
              <a class="button button--ghost" href="drive/">
                Explore driving
                ${iconSvg("arrow-up-right", 18)}
              </a>
            </div>
          </article>
          
          <article class="ecosystem-card">
            <div class="ecosystem-photo">
              <img src="${rootPath}images/marketing/courier-hero.jpg" alt="A courier preparing a package" loading="lazy">
            </div>
            <div>
              <p class="tag">For deliveries</p>
              <h3>Deliver</h3>
              <p>Send packages or discover courier opportunities through Mova.</p>
              <a class="button button--ghost" href="deliver/">
                Explore delivery
                ${iconSvg("arrow-up-right", 18)}
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- RIDER EXPERIENCE SECTION -->
    <section class="section section--white">
      <div class="container rider-layout">
        <div class="rider-photo">
          <img src="${rootPath}images/marketing/rider-hero.jpg" alt="A rider enjoying a Mova journey" loading="lazy">
          <div class="rider-status">
            ${iconSvg("check-fill", 18)}
            <span><small>Active trip</small>Details close at hand</span>
          </div>
        </div>
        
        <div>
          <div class="section-heading">
            <p class="eyebrow">The rider experience</p>
            <h2>Wherever you’re headed, move on your terms.</h2>
            <p class="section-copy">From pickup to arrival, Mova keeps your options clear and your active trip information within reach.</p>
          </div>
          
          <div class="benefit-list">
            <div class="benefit">
              <span>${iconSvg("dollar-duotone", 23)}</span>
              <div>
                <h3>Pricing choice</h3>
                <p>Choose the ride and pricing experience that works for the moment.</p>
              </div>
            </div>
            <div class="benefit">
              <span>${iconSvg("mobile-duotone", 23)}</span>
              <div>
                <h3>Easy booking</h3>
                <p>Set your pickup, choose your destination, and select how you want to ride.</p>
              </div>
            </div>
            <div class="benefit">
              <span>${iconSvg("navigation-duotone", 23)}</span>
              <div>
                <h3>Trip visibility</h3>
                <p>Follow your active trip and keep the important details close.</p>
              </div>
            </div>
            <div class="benefit">
              <span>${iconSvg("chat-duotone", 23)}</span>
              <div>
                <h3>Stay connected</h3>
                <p>Communicate with your matched driver during an active service.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DRIVER OPPORTUNITY SECTION -->
    <section class="section section--navy">
      <div class="viewport-stage">
        <div class="container driver-layout">
          <div>
            <div class="section-heading section-heading--inverse">
              <p class="eyebrow">Drive with Mova</p>
              <h2>Your time. Your opportunities.</h2>
              <p class="section-copy">Find ride opportunities, see useful trip information, and choose what works for you—all on one Mova platform.</p>
            </div>
            
            <ul class="check-list">
              <li>${iconSvg("check-fill", 19)} Flexible earning opportunities</li>
              <li>${iconSvg("check-fill", 19)} Choice over the trips you take</li>
              <li>${iconSvg("check-fill", 19)} Accept or counter where supported</li>
            </ul>
            
            <a class="button button--inverse" href="drive/">
              Drive with Mova
              ${iconSvg("arrow-up-right", 18)}
            </a>
          </div>
          
          <div class="driver-visual">
            <img src="${rootPath}images/marketing/driver-hero.jpg" alt="A Mova driver ready for a trip" loading="lazy">
            <div class="opportunity-card opportunity-card--detailed" aria-label="Illustrative new ride opportunity">
              <div class="opportunity-head">
                <span><i></i>${iconSvg("bell-fill", 14)} New ride opportunity</span>
                <small>Illustrative UI</small>
              </div>
              <div class="opportunity-meta">
                <strong>8 min</strong>
                <span>Estimated pickup</span>
              </div>
              <div class="opportunity-route">
                <div>
                  ${iconSvg("map-pin-fill", 15)}
                  <p><small>Pickup</small>Current area</p>
                </div>
                <i></i>
                <div>
                  ${iconSvg("navigation-fill", 15)}
                  <p><small>Destination</small>Trip destination</p>
                </div>
              </div>
              <div class="opportunity-offer">
                <span>Rider offer</span>
                <strong>₦4,500</strong>
              </div>
              <div class="opportunity-actions">
                <button type="button">Counter</button>
                <button type="button">Accept ${iconSvg("arrow-right", 13)}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COURIER SECTION -->
    <section class="section courier-section">
      <div class="container courier-layout">
        <div class="courier-photo">
          <img src="${rootPath}images/marketing/courier-hero.jpg" alt="A courier preparing a package for delivery" loading="lazy">
          <div class="parcel-status">
            ${iconSvg("check-fill", 20)}
            <div>
              <small>Delivery status</small>
              <strong>Courier assigned</strong>
            </div>
          </div>
        </div>
        
        <div>
          <div class="section-heading">
            <p class="eyebrow">Mova Courier</p>
            <h2>Fast, connected city parcel dispatch.</h2>
            <p class="section-copy">A clear delivery experience for people sending packages and couriers moving them through the city.</p>
          </div>
          
          <div class="courier-audiences">
            <div>
              ${iconSvg("package-regular", 24)}
              <h3>For senders</h3>
              <p>Arrange a package delivery and follow its active lifecycle.</p>
            </div>
            <div>
              ${iconSvg("user-regular", 24)}
              <h3>For couriers</h3>
              <p>Review delivery opportunities and useful assignment details.</p>
            </div>
          </div>
          
          <a class="button button--secondary" href="deliver/">
            Deliver with Mova
            ${iconSvg("arrow-up-right", 18)}
          </a>
        </div>
      </div>
    </section>

    <!-- SAFETY SECTION -->
    <section class="section section--white">
      <div class="container">
        <div class="safety-panel">
          <div>
            <div class="section-heading">
              <p class="eyebrow">Safety at every step</p>
              <h2>Move with greater confidence.</h2>
              <p class="section-copy">Mova is designed to keep relevant trip information visible and help riders and drivers stay connected during an active service.</p>
            </div>
            <a class="button button--secondary" href="safety/">
              Explore safety
              ${iconSvg("arrow-up-right", 18)}
            </a>
          </div>
          
          <div class="safety-grid">
            <div>
              ${iconSvg("shield-regular", 27)}
              <h3>Trip visibility</h3>
              <p>Follow key details through an active trip.</p>
            </div>
            <div>
              ${iconSvg("lock-regular", 27)}
              <h3>Account security</h3>
              <p>Protection designed into the Mova experience.</p>
            </div>
            <div>
              ${iconSvg("chat-regular", 27)}
              <h3>Active communication</h3>
              <p>Connect with your match when you need to.</p>
            </div>
            <div>
              ${iconSvg("user-regular", 27)}
              <h3>Support access</h3>
              <p>Find help and report an issue through Mova.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MARKET & MAP SECTION -->
    <section class="section section--muted market-section">
      <div class="viewport-stage">
        <div class="container market-layout">
          <div class="market-copy">
            <div class="market-eyebrow">
              ${iconSvg("mappin-line-bold", 14)}
              SCALE &amp; FOOTPRINT
            </div>
            <h2>Starting in Nigeria.<br>Built to go further.</h2>
            <p class="market-description">Mova is launching first in Nigeria, with a platform designed to support more markets over time.</p>
            
            <div class="market-status-list">
              <div>
                <i></i>
                <span>
                  <strong>Nigeria</strong>
                  <small>First launch market</small>
                </span>
                <b>Launching first</b>
              </div>
              <div>
                <i></i>
                <span>
                  <strong>Multi-market ready</strong>
                  <small>Country-aware services and pricing</small>
                </span>
              </div>
              <div>
                <i></i>
                <span>
                  <strong>Availability updates</strong>
                  <small>Confirmed cities will be published as rollout plans are finalised</small>
                </span>
              </div>
            </div>
            
            <a class="button button--secondary" href="cities/">
              View market updates
              ${iconSvg("arrow-up-right", 18)}
            </a>
          </div>
          
          <!-- Interactive Live Map with Open-Source Cartography -->
          <div class="interactive-map-wrapper" role="region" aria-label="Interactive Lagos map representing Nigeria as Mova's first launch market">
            <div class="map-market-badge">
              <small>OSM OpenMapTiles</small>
              <strong>Nigeria · Lagos Launch Market</strong>
            </div>
            
            <div id="mova-interactive-map" class="mova-interactive-map" aria-label="Interactive map of Lagos Nigeria powered by OpenMapTiles">
              <!-- Fallback if JS or tiles are loading -->
              <figure class="active-map urban-map" role="group" aria-label="Illustrative Lagos map">
                <span class="map-ping map-ping--one" aria-hidden="true"><i></i><b></b></span>
                <span class="map-ping map-ping--two" aria-hidden="true"><i></i><b></b></span>
              </figure>
            </div>
            
            <div class="map-hud-bar">
              <span class="hubs-label">Live Transit Hubs:</span>
              <div class="hub-pill-row" role="tablist" aria-label="Lagos transit hubs">
                <button type="button" class="hub-pill-btn is-active" data-lat="6.4281" data-lng="3.4219" data-zoom="13" data-hub="vi">Victoria Island</button>
                <button type="button" class="hub-pill-btn" data-lat="6.4474" data-lng="3.4731" data-zoom="13" data-hub="lekki">Lekki Phase 1</button>
                <button type="button" class="hub-pill-btn" data-lat="6.5954" data-lng="3.3533" data-zoom="13" data-hub="ikeja">Ikeja Central</button>
                <button type="button" class="hub-pill-btn" data-lat="6.5774" data-lng="3.3212" data-zoom="13" data-hub="airport">Airport (LOS)</button>
                <button type="button" class="hub-pill-btn" data-lat="6.4549" data-lng="3.3888" data-zoom="13" data-hub="island">Marina / Island</button>
              </div>
            </div>
            
            <div class="map-attribution">
              <a href="https://openmaptiles.org/" target="_blank" rel="noreferrer">© OpenMapTiles</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- APP SHOWCASE SECTION -->
    <section class="section app-section" id="get-mova">
      <div class="viewport-stage">
        <div class="container">
          <div class="section-heading section-heading--center section-heading--inverse">
            <p class="eyebrow">The Mova app</p>
            <h2>Engineered for effortless control.</h2>
            <p class="section-copy">Interact with illustrative product views below to see how rides, live routes, and parcel dispatches come together in one focused experience.</p>
          </div>
          
          <!-- Interactive App Showcase -->
          <div class="app-showcase-interactive" role="region" aria-label="Interactive Mova app preview">
            <!-- Mode switcher tabs -->
            <div class="app-tab-switcher" role="tablist" aria-label="Choose product view">
              <button type="button" class="app-tab-btn is-active" data-app-tab="mode" role="tab" aria-selected="true">
                ${iconSvg("handshake-duotone", 18)}
                <span>1. Choose Mode</span>
              </button>
              <button type="button" class="app-tab-btn" data-app-tab="journey" role="tab" aria-selected="false">
                ${iconSvg("navigation-duotone", 18)}
                <span>2. Live Journey</span>
              </button>
              <button type="button" class="app-tab-btn" data-app-tab="dispatch" role="tab" aria-selected="false">
                ${iconSvg("package-duotone", 18)}
                <span>3. Parcel Dispatch</span>
              </button>
            </div>
            
            <!-- Flagship Smartphone Chassis -->
            <div class="phone-chassis">
              <div class="phone-screen-viewport">
                <!-- Dynamic island & top bar -->
                <div class="phone-dynamic-island">
                  <i></i>
                  <span></span>
                </div>
                <div class="phone-status-bar">
                  <span>9:41</span>
                  <span>5G 100%</span>
                </div>
                
                <!-- Screen Pane 1: Ride Mode Selection -->
                <div class="phone-screen-pane is-active" id="pane-mode">
                  <div class="phone-pane-header">
                    <small>Step 1</small>
                    <h4>Select Ride Mode</h4>
                  </div>
                  <div class="phone-mode-selector">
                    <div class="phone-mode-item" data-phone-mode="offer">
                      <strong>Make an Offer</strong>
                      <span>Suggest your price</span>
                      <em>₦4,800</em>
                    </div>
                    <div class="phone-mode-item is-selected" data-phone-mode="fixed">
                      <strong>Fixed Price</strong>
                      <span>Upfront guarantee</span>
                      <em>₦5,200</em>
                    </div>
                    <div class="phone-mode-item" data-phone-mode="metered">
                      <strong>Metered Ride</strong>
                      <span>Live distance & time</span>
                      <em>₦4,650 est.</em>
                    </div>
                  </div>
                  <button type="button" class="phone-confirm-btn" id="phone-request-btn">Request Trip</button>
                </div>
                
                <!-- Screen Pane 2: Live Active Journey -->
                <div class="phone-screen-pane" id="pane-journey">
                  <div class="phone-pane-header">
                    <small class="live-pill">● Trip in Progress</small>
                    <h4>En Route to Destination</h4>
                  </div>
                  <div class="phone-live-map">
                    <div class="phone-map-bg"></div>
                    <div class="phone-route-svg">
                      <svg viewBox="0 0 200 120" class="animated-trip-svg">
                        <path id="phone-trip-track" d="M 20 100 Q 80 20 180 30" fill="none" stroke="#24c93b" stroke-width="4" stroke-linecap="round" stroke-dasharray="6,4"></path>
                        <circle cx="20" cy="100" r="5" fill="#00172c"></circle>
                        <circle cx="180" cy="30" r="6" fill="#24c93b"></circle>
                      </svg>
                      <div class="moving-car-icon" id="moving-car">
                        ${iconSvg("car-fill", 18)}
                      </div>
                    </div>
                    <div class="phone-driver-mini">
                      <span>KA</span>
                      <div>
                        <strong>Kareem A.</strong>
                        <small>Silver sedan · 3 mins away</small>
                      </div>
                    </div>
                  </div>
                  <div class="phone-trip-telemetry">
                    <div>
                      <small>Distance Left</small>
                      <strong>3.4 km</strong>
                    </div>
                    <div>
                      <small>Est. Arrival</small>
                      <strong>12:48 PM</strong>
                    </div>
                  </div>
                </div>
                
                <!-- Screen Pane 3: Parcel Dispatch Lifecycle -->
                <div class="phone-screen-pane" id="pane-dispatch">
                  <div class="phone-pane-header">
                    <small>Mova Courier</small>
                    <h4>Parcel in Dispatch</h4>
                  </div>
                  <div class="phone-dispatch-timeline">
                    <div class="dispatch-step is-complete">
                      <i>✓</i>
                      <div>
                        <strong>Courier Assigned</strong>
                        <small>Tunde M. accepted dispatch</small>
                      </div>
                    </div>
                    <div class="dispatch-step is-complete">
                      <i>✓</i>
                      <div>
                        <strong>Package Picked Up</strong>
                        <small>Pickup verified at Lekki Phase 1</small>
                      </div>
                    </div>
                    <div class="dispatch-step is-active">
                      <i class="pulsing-step">●</i>
                      <div>
                        <strong>Out for Delivery</strong>
                        <small>In transit to recipient handoff</small>
                      </div>
                    </div>
                    <div class="dispatch-step">
                      <i>4</i>
                      <div>
                        <strong>Completed</strong>
                        <small>Recipient PIN confirmation</small>
                      </div>
                    </div>
                  </div>
                  <div class="phone-parcel-code">
                    <small>Tracking Verification Code</small>
                    <strong>MV-9482-NG</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="store-row store-row--center">
            <button type="button" disabled>
              <span>Coming soon on</span>
              <strong>App Store</strong>
            </button>
            <button type="button" disabled>
              <span>Coming soon on</span>
              <strong>Google Play</strong>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ SECTION -->
    <section class="section section--white">
      <div class="container faq-layout">
        <div class="section-heading">
          <p class="eyebrow">Questions, answered</p>
          <h2>A few things to know about Mova.</h2>
          <p class="section-copy">Straightforward answers before your first trip.</p>
        </div>
        
        <div class="faq-list">
          <details>
            <summary>What is Mova?<span aria-hidden="true">+</span></summary>
            <p>Mova is a mobility platform that brings rides, driver opportunities, and delivery experiences together in one place.</p>
          </details>
          <details>
            <summary>How does making an offer work?<span aria-hidden="true">+</span></summary>
            <p>For supported trips, you can suggest a fare within Mova’s pricing boundaries and respond to offers from available drivers.</p>
          </details>
          <details>
            <summary>Can I choose a fixed-price ride?<span aria-hidden="true">+</span></summary>
            <p>Yes. Fixed-price booking lets you see and agree to the trip price before your journey begins.</p>
          </details>
          <details>
            <summary>What is a metered ride?<span aria-hidden="true">+</span></summary>
            <p>A metered ride calculates the fare from the actual journey using Mova’s metered pricing model.</p>
          </details>
          <details>
            <summary>How do I become a Driver?<span aria-hidden="true">+</span></summary>
            <p>Visit the Drive page to learn about the onboarding process and register your interest.</p>
          </details>
          <details>
            <summary>Does Mova offer delivery?<span aria-hidden="true">+</span></summary>
            <p>Mova Courier is being built for package delivery and courier opportunities through the same Mova platform.</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CLOSING CTA SECTION -->
    <section class="section section--white section--closing">
      <div class="container">
        <div class="closing-cta">
          <p class="eyebrow">Move with Mova</p>
          <h2>Ready to move your way?</h2>
          <p>Your ride. Your price. Your choice.</p>
          <div class="button-row">
            <a class="button button--inverse" href="#get-mova">
              Get Mova
              ${iconSvg("arrow-up-right", 18)}
            </a>
            <a class="button button--ghost" href="drive/">
              Drive with Mova
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
  `;

  return renderHtmlShell({
    title: "Mova — Move your way",
    description: siteConfig.description,
    canonicalPath: "/",
    rootPath,
    activeSlug: "",
    structuredData,
    bodyContent
  });
}

// 8. File system operations
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function runBuild() {
  console.log("Starting vanilla site generation...");
  
  // 1. Clean public assets into place
  console.log("Copying assets...");
  if (fs.existsSync("public/brand")) copyDir("public/brand", "brand");
  if (fs.existsSync("public/images")) copyDir("public/images", "images");
  if (fs.existsSync("public/maps")) copyDir("public/maps", "maps");
  if (fs.existsSync("public/mova-bimi.svg")) fs.copyFileSync("public/mova-bimi.svg", "brand/mova-bimi.svg");
  if (fs.existsSync("../m_logo_animated.svg")) fs.copyFileSync("../m_logo_animated.svg", "brand/m_logo_animated.svg");

  // 2. Build CSS
  ensureDir("css");
  if (fs.existsSync("src/app/globals.css")) {
    console.log("Generating css/style.css from src/app/globals.css...");
    let cssSource = fs.readFileSync("src/app/globals.css", "utf8");
    // Remove `@import "tailwindcss";`
    cssSource = cssSource.replace(/@import\s+["']tailwindcss["'];?\n?/, "");
    // Replace absolute map path with relative path
    cssSource = cssSource.replaceAll("url('/maps/lagos-urban-map.svg')", "url('../maps/lagos-urban-map.svg')");
    cssSource = cssSource.replace(':root {', ':root {\n  --font-inter: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n  --font-jakarta: "Plus Jakarta Sans", var(--font-inter), sans-serif;');
    
    // Add CSS Reset and standard layout helpers for images
    const cssPrefix = `/* Mova Official Vanilla CSS Stylesheet */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background: var(--surface-page, #ffffff);
  color: var(--text-primary, #071b2b);
  font-family: var(--font-inter), Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}

/* Image containment rules matching Next.js Image with fill */
.hero-photo,
.ecosystem-photo img,
.rider-photo img,
.driver-visual img,
.courier-photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

`;
    fs.writeFileSync("css/style.css", cssPrefix + cssSource);
  }

  // 3. Build JS
  console.log("Generating js/main.js...");
  ensureDir("js");
  const jsContent = `/**
 * Mova Website - Enterprise Vanilla JavaScript Application
 * Features:
 *  - Safe LocalStorage (sandboxed / private mode resilient)
 *  - Header Scroll Progress Bar & Dynamic Glass Shadow
 *  - Living Ambient Mesh & 3D Perspective Tilt (Parallax)
 *  - Linear-Style Spotlight Border Hover Effect
 *  - Interactive "Choice Engine" Trip & Pricing Simulator
 *  - OSM OpenMapTiles Vector Map with MapLibre GL & Lagos Transit Hubs
 *  - Interactive Flagship Smartphone Showcase with Auto-Advance Demo & Car Glide
 *  - Metric Number Count-Up Animations
 *  - Driver Earnings Calculator & Interactive City Filters
 *  - Single-open Accordion FAQ
 */

(function () {
  'use strict';

  // --- Safe Storage Helpers (Never throws in sandboxed or private browsing) ---
  function safeGetStorage(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }

  function safeSetStorage(key, val) {
    try {
      if (window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
  }

  // =========================================================================
  // 1. Mobile Navigation Drawer
  // =========================================================================
  const menuOpenBtn = document.getElementById('mobile-menu-open');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = 'block';
    menuOpenBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    menuCloseBtn?.focus();
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.style.display = 'none';
    menuOpenBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuOpenBtn?.focus();
  }

  menuOpenBtn?.addEventListener('click', openMenu);
  menuCloseBtn?.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.style.display === 'block') {
      closeMenu();
    }
  });

  mobileMenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // =========================================================================
  // 2. Header Scroll Progress Bar & Glass Elevation
  // =========================================================================
  const scrollProgressBar = document.getElementById('scroll-progress');
  const siteHeader = document.getElementById('site-header');

  function updateScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProgressBar && docHeight > 0) {
      const progress = Math.min(1, Math.max(0, scrollY / docHeight));
      scrollProgressBar.style.transform = "scaleX(" + progress + ")";
    }
    if (siteHeader) {
      if (scrollY > 15) {
        siteHeader.classList.add('header-scrolled');
      } else {
        siteHeader.classList.remove('header-scrolled');
      }
    }
  }

  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // =========================================================================
  // 3. Viewport Stage Observer (Entrance Animations)
  // =========================================================================
  const stages = document.querySelectorAll('.viewport-stage, .enterprise-hero, .category-card, .city-metro-card');
  if ('IntersectionObserver' in window) {
    const stageOwners = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const owner = stageOwners.get(entry.target) || entry.target;
          owner.classList.add('is-active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    stages.forEach((stage) => {
      // display:contents elements have no box, so observe their first child instead
      const watched = (getComputedStyle(stage).display === 'contents' && stage.firstElementChild) ? stage.firstElementChild : stage;
      stageOwners.set(watched, stage);
      observer.observe(watched);
    });
  } else {
    stages.forEach((stage) => stage.classList.add('is-active'));
  }

  // =========================================================================
  // 4. Number Metric Count-Up Animation (All Pages)
  // =========================================================================
  const counterElements = document.querySelectorAll('.counter-num, [data-counter-target], [data-target]');
  if (counterElements.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    counterElements.forEach((el) => counterObserver.observe(el));
  } else {
    counterElements.forEach(animateCounter);
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-target') || el.getAttribute('data-counter-target') || '0');
    const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    const format = el.getAttribute('data-format');
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted = current.toFixed(decimals);
      if (format === 'comma' || current >= 1000) {
        formatted = Math.round(current).toLocaleString();
      }
      el.textContent = prefix + formatted + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const finalFormatted = (format === 'comma' || target >= 1000) ? Math.round(target).toLocaleString() : target.toFixed(decimals);
        el.textContent = prefix + finalFormatted + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  // =========================================================================
  // 5. 3D Perspective Tilt on Floating Hero Cards & Category Cards
  // =========================================================================
  const heroContainer = document.getElementById('hero-visual-container');
  const heroTiltCards = document.querySelectorAll('[data-tilt]');

  if (heroContainer && heroTiltCards.length && window.matchMedia('(pointer: fine)').matches) {
    heroContainer.addEventListener('mousemove', (e) => {
      const rect = heroContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroTiltCards.forEach((card) => {
        const rotateX = -y * 14;
        const rotateY = x * 18;
        card.style.transform = "perspective(900px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg) translateZ(8px)";
      });
    });

    heroContainer.addEventListener('mouseleave', () => {
      heroTiltCards.forEach((card) => {
        card.style.transform = '';
      });
    });
  }

  // Individual card tilt on hover
  const physicalCards = document.querySelectorAll('.category-card, .ride-mode-card, .city-metro-card, .ecosystem-card');
  if (window.matchMedia('(pointer: fine)').matches) {
    physicalCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = "perspective(1000px) rotateX(" + (-y * 8).toFixed(2) + "deg) rotateY(" + (x * 8).toFixed(2) + "deg) translateY(-5px)";
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // =========================================================================
  // 6. Linear-Style Spotlight Border Hover Effect
  // =========================================================================
  const spotlightCards = document.querySelectorAll('.spotlight-card, .category-card, .ride-mode-card, .city-metro-card');
  if (spotlightCards.length && window.matchMedia('(pointer: fine)').matches) {
    spotlightCards.forEach((card) => {
      card.classList.add('spotlight-card');
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', (e.clientX - rect.left) + "px");
        card.style.setProperty('--mouse-y', (e.clientY - rect.top) + "px");
      });
    });
  }

  // =========================================================================
  // 7. Interactive Choice Engine Trip & Pricing Simulator
  // =========================================================================
  const distSlider = document.getElementById('sim-distance-slider');
  const distValEl = document.getElementById('sim-distance-val');
  const durationValEl = document.getElementById('sim-duration-val');
  const offerSuggestedFareEl = document.getElementById('offer-suggested-fare');
  const offerValueEl = document.getElementById('offer-value');
  const fixedTotalFareEl = document.getElementById('fixed-total-fare');
  const meterDistTimeEl = document.getElementById('meter-dist-time');
  const meterTotalFareEl = document.getElementById('meter-total-fare');
  const distancePills = document.querySelectorAll('.distance-pill');
  const offerDecBtn = document.getElementById('offer-decrease');
  const offerIncBtn = document.getElementById('offer-increase');

  let customOfferAdjustment = 0;

  function calculateFares(km) {
    const distance = Math.max(1, Math.min(60, km));
    const durationMins = Math.round(distance * 2.2 + 4);

    const baseTariff = 1200;
    const ratePerKm = 295;
    const ratePerMin = 45;

    const fixedFare = Math.round((baseTariff + distance * ratePerKm + durationMins * ratePerMin) / 50) * 50;
    const offerMin = Math.round((fixedFare * 0.85) / 50) * 50;
    const offerMax = Math.round((fixedFare * 1.08) / 50) * 50;
    const currentOffer = Math.max(offerMin, Math.min(offerMax, Math.round((fixedFare * 0.94 + customOfferAdjustment) / 50) * 50));
    const meteredFare = Math.round((baseTariff * 0.95 + distance * (ratePerKm * 0.92) + durationMins * (ratePerMin * 0.95)) / 50) * 50;

    function popEl(el, text, html) {
      if (!el) return;
      const next = html !== undefined ? html : text;
      if (el.getAttribute('data-last') === next) return;
      el.setAttribute('data-last', next);
      if (html !== undefined) el.innerHTML = html; else el.textContent = text;
      el.classList.remove('value-pop');
      void el.offsetWidth;
      el.classList.add('value-pop');
    }
    popEl(distValEl, distance.toFixed(1) + " km");
    popEl(durationValEl, "~" + durationMins + " mins");
    popEl(offerSuggestedFareEl, "₦" + offerMin.toLocaleString() + " – ₦" + offerMax.toLocaleString());
    popEl(offerValueEl, "₦" + currentOffer.toLocaleString());
    popEl(fixedTotalFareEl, "₦" + fixedFare.toLocaleString());
    popEl(meterDistTimeEl, undefined, distance.toFixed(1) + " km <em>· " + durationMins + "m</em>");
    popEl(meterTotalFareEl, "₦" + meteredFare.toLocaleString());
    document.querySelectorAll('.choice-engine-box .ride-mode-card').forEach((card) => {
      card.classList.remove('card-recalc');
      void card.offsetWidth;
      card.classList.add('card-recalc');
    });

    distancePills.forEach((pill) => {
      const pillKm = parseFloat(pill.getAttribute('data-km') || '0');
      if (Math.abs(pillKm - distance) < 1.5) {
        pill.classList.add('is-active');
      } else {
        pill.classList.remove('is-active');
      }
    });

    const phoneOfferEl = document.querySelector('[data-phone-mode="offer"] em');
    const phoneFixedEl = document.querySelector('[data-phone-mode="fixed"] em');
    const phoneMeterEl = document.querySelector('[data-phone-mode="metered"] em');
    if (phoneOfferEl) phoneOfferEl.textContent = "₦" + currentOffer.toLocaleString();
    if (phoneFixedEl) phoneFixedEl.textContent = "₦" + fixedFare.toLocaleString();
    if (phoneMeterEl) phoneMeterEl.textContent = "₦" + meteredFare.toLocaleString() + " est.";
    document.dispatchEvent(new Event('mova-fares'));

    if (distSlider) {
      const min = parseFloat(distSlider.min || '3');
      const max = parseFloat(distSlider.max || '45');
      const pct = Math.min(100, Math.max(0, ((distance - min) / (max - min)) * 100));
      distSlider.style.background = "linear-gradient(90deg, #24c93b 0%, #24c93b " + pct + "%, #dce8e0 " + pct + "%, #dce8e0 100%)";
    }
  }

  if (distSlider) {
    distSlider.addEventListener('input', (e) => {
      calculateFares(parseFloat(e.target.value));
    });

    distancePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        const targetKm = parseFloat(pill.getAttribute('data-km') || '12');
        distSlider.value = targetKm.toString();
        calculateFares(targetKm);
      });
    });

    calculateFares(parseFloat(distSlider.value || '12'));
  }

  if (offerDecBtn && offerIncBtn) {
    offerDecBtn.addEventListener('click', () => {
      customOfferAdjustment -= 250;
      if (distSlider) calculateFares(parseFloat(distSlider.value));
    });
    offerIncBtn.addEventListener('click', () => {
      customOfferAdjustment += 250;
      if (distSlider) calculateFares(parseFloat(distSlider.value));
    });
  }

  // =========================================================================
  // 8. Interactive OSM OpenMapTiles Vector Map (Lagos Launch Market)
  // The official style of OpenMapTiles, designed to display all features in vector tiles. Heavily inspired by OSM Carto.
  // =========================================================================
  function initOpenMapTiles() {
    const mapContainer = document.getElementById('mova-interactive-map');
    if (!mapContainer) return;

    if (typeof window.maplibregl === 'undefined') {
      setTimeout(initOpenMapTiles, 150);
      return;
    }

    try {
      mapContainer.innerHTML = '';

      // OSM OpenMapTiles official style (vector tiles inspired by OSM Carto)
      const map = new maplibregl.Map({
        container: 'mova-interactive-map',
        style: 'https://tiles.openfreemap.org/styles/bright',
        center: [3.4246, 6.4550],
        zoom: 11.8,
        minZoom: 8,
        maxZoom: 18,
        attributionControl: false,
        scrollZoom: true,
        doubleClickZoom: true,
        touchZoomRotate: true,
        keyboard: true
      });
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 100, unit: 'metric' }), 'bottom-left');

      map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

      const hubs = [
        {
          id: 'vi',
          name: 'Victoria Island Hub',
          subtitle: 'Commercial & Financial District',
          desc: 'High driver density across Adeola Odeku, Ahmadu Bello, and commercial waterfront.',
          coords: [3.4219, 6.4281],
          badge: 'High Driver Density'
        },
        {
          id: 'lekki',
          name: 'Lekki Phase 1',
          subtitle: 'Admiralty Way Corridor',
          desc: 'Primary residential and business dispatch. Upfront Fixed Price & Make an Offer active.',
          coords: [3.4731, 6.4474],
          badge: 'Express Couriers'
        },
        {
          id: 'ikeja',
          name: 'Ikeja Central',
          subtitle: 'Mainland Commerce & Government Hub',
          desc: 'Commercial & express route corridor connecting mainland travelers to the Island.',
          coords: [3.3533, 6.5954],
          badge: 'Mainland Gateway'
        },
        {
          id: 'airport',
          name: 'Murtala Muhammed Airport (LOS)',
          subtitle: 'Domestic & International Terminals',
          desc: 'Dedicated airport transfer lanes with flight context and fixed upfront fare certainty.',
          coords: [3.3212, 6.5774],
          badge: 'Airport Terminal Transfers'
        },
        {
          id: 'island',
          name: 'Marina / Lagos Island',
          subtitle: 'Financial Hub & Ferry Terminals',
          desc: 'Financial district hub with express city courier dispatch and metered rides.',
          coords: [3.3888, 6.4549],
          badge: 'Port & Financial'
        }
      ];

      const markerMap = {};
      const sharedPopup = new maplibregl.Popup({ offset: 22, closeButton: true, maxWidth: '280px' });
      let selectToken = 0;
      let ringRaf = null;
      let mapReady = false;
      let pendingRing = null;

      function animateRing(coords) {
        if (ringRaf) cancelAnimationFrame(ringRaf);
        const src = map.getSource('hub-focus');
        if (!src) { pendingRing = coords; return; }
        src.setData({ type: 'Feature', geometry: { type: 'Point', coordinates: coords } });
        const start = performance.now();
        function frame(now) {
          const t = ((now - start) % 1800) / 1800;
          map.setPaintProperty('hub-focus-ring', 'circle-radius', 10 + t * 46);
          map.setPaintProperty('hub-focus-ring', 'circle-stroke-opacity', 0.9 * (1 - t));
          map.setPaintProperty('hub-focus-ring', 'circle-opacity', 0.28 * (1 - t));
          ringRaf = requestAnimationFrame(frame);
        }
        ringRaf = requestAnimationFrame(frame);
      }

      function selectHub(hubId, openPopup) {
        const hubItem = markerMap[hubId];
        if (!hubItem) return;
        const token = ++selectToken;
        document.querySelectorAll('.hub-pill-btn').forEach((b) => {
          const on = b.getAttribute('data-hub') === hubId;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
          if (on && openPopup !== false) b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
        Object.keys(markerMap).forEach((k) => {
          markerMap[k].el.classList.toggle('is-selected', k === hubId);
        });
        sharedPopup.remove();
        animateRing(hubItem.coords);
        map.flyTo({ center: hubItem.coords, zoom: 13.6, speed: 0.9, curve: 1.5, essential: true });
        if (openPopup !== false) {
          map.once('moveend', () => {
            if (token !== selectToken) return;
            sharedPopup.setLngLat(hubItem.coords).setHTML(hubItem.html).addTo(map);
          });
        }
      }

      map.on('load', () => {
        mapReady = true;
        map.addSource('hub-focus', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: 'hub-focus-ring',
          type: 'circle',
          source: 'hub-focus',
          paint: {
            'circle-radius': 10,
            'circle-color': '#24c93b',
            'circle-opacity': 0.25,
            'circle-stroke-color': '#24c93b',
            'circle-stroke-width': 2,
            'circle-stroke-opacity': 0.8,
            'circle-pitch-alignment': 'map'
          }
        });
        if (pendingRing) { animateRing(pendingRing); pendingRing = null; }
        map.addSource('transit-corridor', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [3.4219, 6.4281],
                [3.4731, 6.4474],
                [3.3888, 6.4549],
                [3.3533, 6.5954],
                [3.3212, 6.5774]
              ]
            }
          }
        });

        map.addLayer({
          id: 'transit-corridor-glow',
          type: 'line',
          source: 'transit-corridor',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#24c93b',
            'line-width': 6,
            'line-opacity': 0.35,
            'line-blur': 3
          }
        });

        map.addLayer({
          id: 'transit-corridor-line',
          type: 'line',
          source: 'transit-corridor',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: {
            'line-color': '#007d50',
            'line-width': 3,
            'line-dasharray': [2, 2],
            'line-opacity': 0.95
          }
        });
      });

      hubs.forEach((hub) => {
        const el = document.createElement('div');
        el.className = 'mova-beacon-marker';
        el.innerHTML = '<div class="mova-beacon-pulse"></div><div class="mova-beacon-core"></div>';

        const popupContent = 
          '<div class="mova-popup-card">' +
            '<small>' + hub.badge + '</small>' +
            '<h4>' + hub.name + '</h4>' +
            '<p><strong>' + hub.subtitle + '</strong><br>' + hub.desc + '</p>' +
          '</div>';

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat(hub.coords)
          .addTo(map);

        el.setAttribute('role', 'button');
        el.setAttribute('tabindex', '0');
        el.setAttribute('aria-label', hub.name);
        el.style.cursor = 'pointer';
        el.addEventListener('click', (e) => { e.stopPropagation(); selectHub(hub.id, true); });
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectHub(hub.id, true); }
        });

        markerMap[hub.id] = { marker, el, html: popupContent, coords: hub.coords };
      });

      const hubButtons = document.querySelectorAll('.hub-pill-btn');
      hubButtons.forEach((btn) => {
        btn.addEventListener('click', () => selectHub(btn.getAttribute('data-hub'), true));
      });
      selectHub('vi', false);

    } catch (err) {
      console.warn('OpenMapTiles MapLibre initialization notice:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initOpenMapTiles);
  } else {
    initOpenMapTiles();
  }

  // =========================================================================
  // 9. Flagship Smartphone Interactive Showcase with Auto-Advance & Car Glide
  // =========================================================================
  const appTabButtons = document.querySelectorAll('[data-app-tab]');
  const phonePanes = {
    mode: document.getElementById('pane-mode'),
    journey: document.getElementById('pane-journey'),
    dispatch: document.getElementById('pane-dispatch')
  };

  let activeShowcaseTab = 'mode';
  let showcaseInterval = null;

  function switchPhoneTab(tabKey) {
    activeShowcaseTab = tabKey;
    appTabButtons.forEach((btn) => {
      const isTarget = btn.getAttribute('data-app-tab') === tabKey;
      btn.classList.toggle('is-active', isTarget);
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
    });

    Object.keys(phonePanes).forEach((key) => {
      const pane = phonePanes[key];
      if (pane) {
        pane.classList.toggle('is-active', key === tabKey);
      }
    });

    if (tabKey === 'journey') {
      const car = document.getElementById('moving-car');
      if (car) {
        car.style.animation = 'none';
        void car.offsetWidth;
        car.style.animation = 'car-glide 5s cubic-bezier(0.4, 0, 0.2, 1) infinite';
      }
    }
  }

  appTabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-app-tab');
      if (tab) {
        switchPhoneTab(tab);
        pauseShowcaseTimer();
      }
    });
  });

  function startShowcaseTimer() {
    pauseShowcaseTimer();
    showcaseInterval = setInterval(() => {
      const tabs = ['mode', 'journey', 'dispatch'];
      const currentIndex = tabs.indexOf(activeShowcaseTab);
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      switchPhoneTab(nextTab);
    }, 6500);
  }

  function pauseShowcaseTimer() {
    if (showcaseInterval) {
      clearInterval(showcaseInterval);
      showcaseInterval = null;
    }
  }

  const phoneChassis = document.querySelector('.phone-chassis');
  if (phoneChassis) {
    phoneChassis.addEventListener('mouseenter', pauseShowcaseTimer);
    phoneChassis.addEventListener('mouseleave', () => {
      if (!showcaseInterval) startShowcaseTimer();
    });
    startShowcaseTimer();
  }

  const phoneModeItems = document.querySelectorAll('.phone-mode-item');
  const phoneRequestBtn = document.getElementById('phone-request-btn');
  let phoneMode = 'offer';

  function phoneModePrice(item) {
    const em = item ? item.querySelector('em') : null;
    return em ? em.textContent.trim() : '';
  }

  function updatePhoneRequestLabel() {
    if (!phoneRequestBtn) return;
    const item = document.querySelector('.phone-mode-item[data-phone-mode="' + phoneMode + '"]');
    const price = phoneModePrice(item);
    if (phoneMode === 'offer') phoneRequestBtn.textContent = 'Submit Offer (' + price + ')';
    else if (phoneMode === 'fixed') phoneRequestBtn.textContent = 'Confirm Fixed Price (' + price + ')';
    else phoneRequestBtn.textContent = 'Start Metered Trip';
  }

  phoneModeItems.forEach((item) => {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    function choose() {
      phoneModeItems.forEach((i) => i.classList.remove('is-selected'));
      item.classList.add('is-selected');
      phoneMode = item.getAttribute('data-phone-mode') || 'offer';
      updatePhoneRequestLabel();
      item.classList.remove('value-pop');
      void item.offsetWidth;
      item.classList.add('value-pop');
      pauseShowcaseTimer();
    }
    item.addEventListener('click', choose);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); }
    });
  });
  updatePhoneRequestLabel();
  document.addEventListener('mova-fares', updatePhoneRequestLabel);

  let requestBusy = false;
  phoneRequestBtn?.addEventListener('click', () => {
    if (requestBusy) return;
    requestBusy = true;
    pauseShowcaseTimer();
    const original = phoneRequestBtn.textContent;
    phoneRequestBtn.classList.add('is-loading');
    phoneRequestBtn.textContent = 'Matching you with a driver...';
    setTimeout(() => {
      phoneRequestBtn.classList.remove('is-loading');
      updatePhoneRequestLabel();
      requestBusy = false;
      switchPhoneTab('journey');
    }, 1200);
  });

  // Dispatch steps: clickable and auto-advancing
  const dispatchSteps = document.querySelectorAll('.dispatch-step');
  let dispatchStage = 0;
  let dispatchTimer = null;
  function setDispatchStage(n) {
    dispatchStage = n % Math.max(dispatchSteps.length, 1);
    dispatchSteps.forEach((step, idx) => {
      step.classList.toggle('is-complete', idx < dispatchStage);
      step.classList.toggle('is-active', idx === dispatchStage);
      const i = step.querySelector('i');
      if (i) i.textContent = idx < dispatchStage ? '\u2713' : String(idx + 1);
    });
  }
  if (dispatchSteps.length) {
    dispatchSteps.forEach((step, idx) => {
      step.style.cursor = 'pointer';
      step.addEventListener('click', () => {
        setDispatchStage(idx);
        if (dispatchTimer) { clearInterval(dispatchTimer); dispatchTimer = null; }
      });
    });
    dispatchTimer = setInterval(() => {
      if (activeShowcaseTab === 'dispatch') setDispatchStage(dispatchStage + 1);
    }, 2200);
    setDispatchStage(0);
  }
  document.querySelectorAll('.phone-parcel-code').forEach((code) => {
    code.style.cursor = 'pointer';
    code.addEventListener('click', () => {
      const original = code.getAttribute('data-orig') || code.textContent;
      code.setAttribute('data-orig', original);
      try { if (navigator.clipboard) navigator.clipboard.writeText(original.trim()); } catch (e) {}
      code.textContent = 'Copied \u2713';
      setTimeout(() => { code.textContent = original; }, 1400);
    });
  });

  // Arrow-key navigation on the tab list
  appTabButtons.forEach((btn, idx) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const dir = e.key === 'ArrowRight' ? 1 : -1;
      const nextBtn = appTabButtons[(idx + dir + appTabButtons.length) % appTabButtons.length];
      nextBtn.focus();
      nextBtn.click();
    });
  });

  // =========================================================================
  // 10. Single-open Accordion for FAQ
  // =========================================================================
  const allDetails = document.querySelectorAll('.faq-list details');
  allDetails.forEach((targetDetail) => {
    targetDetail.addEventListener('toggle', () => {
      if (targetDetail.open) {
        allDetails.forEach((detail) => {
          if (detail !== targetDetail && detail.open) {
            detail.removeAttribute('open');
          }
        });
      }
    });
  });

  // =========================================================================
  // 11. Global GeoIP Detection & Locale Selector Modal
  // =========================================================================
  (function initGeoIPAndLocale() {
    const supportedLocales = ['en-ng', 'en-gh', 'en-ke', 'en-za', 'en-gb', 'en'];
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/').filter(Boolean);
    const firstSeg = pathSegments[0]?.toLowerCase();
    const hasLocalePrefix = supportedLocales.includes(firstSeg);

    const headerFlag = document.getElementById('header-region-flag');
    const headerName = document.getElementById('header-region-name');
    const mobileFlag = document.getElementById('mobile-region-flag');
    const mobileName = document.getElementById('mobile-region-name');
    const regionCards = document.querySelectorAll('.region-card');

    const regionData = {
      'en-ng': { flag: '🇳🇬', name: 'Nigeria (EN)' },
      'en-gh': { flag: '🇬🇭', name: 'Ghana (EN)' },
      'en-ke': { flag: '🇰🇪', name: 'Kenya (EN)' },
      'en-za': { flag: '🇿🇦', name: 'South Africa (EN)' },
      'en-gb': { flag: '🇬🇧', name: 'United Kingdom (EN)' },
      'en': { flag: '🌐', name: 'International (EN)' }
    };

    function updateHeaderDisplay(code) {
      const info = regionData[code] || regionData['en-ng'];
      if (headerFlag) headerFlag.textContent = info.flag;
      if (headerName) headerName.textContent = info.name;
      if (mobileFlag) mobileFlag.textContent = info.flag;
      if (mobileName) mobileName.textContent = info.name;

      regionCards.forEach(card => {
        card.classList.toggle('is-active', card.getAttribute('data-region') === code);
      });
    }

    let activeLocale = hasLocalePrefix ? firstSeg : (safeGetStorage('mova_region') || 'en-ng');
    updateHeaderDisplay(activeLocale);

    if (!safeGetStorage('mova_region_manual') && !hasLocalePrefix) {
      fetch('https://ipapi.co/json/')
        .then(res => res.json())
        .then(data => {
          const country = data.country_code?.toUpperCase();
          let detected = 'en-ng';
          if (country === 'GH') detected = 'en-gh';
          else if (country === 'KE') detected = 'en-ke';
          else if (country === 'ZA') detected = 'en-za';
          else if (country === 'GB') detected = 'en-gb';
          else if (country !== 'NG') detected = 'en';

          updateHeaderDisplay(detected);
          safeSetStorage('mova_region', detected);
        })
        .catch(() => {
          updateHeaderDisplay('en-ng');
        });
    }

    const regionModal = document.getElementById('region-modal');
    const openBtn = document.getElementById('region-selector-open');
    const mobileOpenBtn = document.getElementById('mobile-region-selector-open');
    const closeBtn = document.getElementById('region-modal-close');
    const searchInput = document.getElementById('region-search-input');

    function openRegionModal() {
      if (regionModal) {
        regionModal.style.display = 'flex';
        searchInput?.focus();
      }
    }
    function closeRegionModal() {
      if (regionModal) {
        regionModal.style.display = 'none';
      }
    }

    openBtn?.addEventListener('click', openRegionModal);
    mobileOpenBtn?.addEventListener('click', () => {
      closeMenu();
      openRegionModal();
    });
    closeBtn?.addEventListener('click', closeRegionModal);
    regionModal?.addEventListener('click', (e) => {
      if (e.target === regionModal) closeRegionModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && regionModal && regionModal.style.display !== 'none') {
        closeRegionModal();
      }
    });

    searchInput?.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      regionCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) ? 'grid' : 'none';
      });
    });

    regionCards.forEach(card => {
      card.addEventListener('click', () => {
        const selectedCode = card.getAttribute('data-region');
        safeSetStorage('mova_region', selectedCode);
        safeSetStorage('mova_region_manual', 'true');
        updateHeaderDisplay(selectedCode);
        closeRegionModal();

        const sub = hasLocalePrefix ? (currentPath.substring(firstSeg.length + 1) || '/') : currentPath;
        const cleanSub = sub.startsWith('/') ? sub : '/' + sub;
        if (selectedCode === 'en-ng') {
          window.location.href = '/en-ng' + cleanSub;
        } else if (hasLocalePrefix) {
          window.location.href = cleanSub === '/' ? '/en-ng/' : cleanSub;
        }
      });
    });
  })();

  // =========================================================================
  // 12. Driver Earnings Calculator (Drive Page)
  // =========================================================================
  (function initDriverCalc() {
    const slider = document.getElementById('drive-trips-slider');
    const tripsVal = document.getElementById('drive-trips-val');
    const grossElem = document.getElementById('calc-gross');
    const feeElem = document.getElementById('calc-fee');
    const netElem = document.getElementById('calc-net');
    const savingsElem = document.getElementById('calc-monthly-savings');
    const noteElem = document.getElementById('calc-extra-note');
    const tierBtns = document.querySelectorAll('.category-tier-btn');

    if (!slider) return;

    let avgFare = 4200;

    tierBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tierBtns.forEach(b => {
          b.classList.remove('is-active');
          b.style.borderColor = 'var(--border-subtle)';
          b.style.background = 'white';
        });
        btn.classList.add('is-active');
        btn.style.borderColor = 'var(--mova-green-500)';
        btn.style.background = '#eef9f2';

        const tier = btn.getAttribute('data-tier');
        if (tier === 'economy') avgFare = 4200;
        else if (tier === 'comfort') avgFare = 6500;
        else if (tier === 'xl') avgFare = 9800;
        calculate();
      });
    });

    function formatNaira(num) {
      return '₦' + Math.round(num).toLocaleString('en-US');
    }

    function calculate() {
      const trips = parseInt(slider.value, 10);
      if (tripsVal) tripsVal.textContent = trips + ' trips';
      const gross = trips * avgFare;
      const movaFee = gross * 0.10;
      const movaNet = gross - movaFee;
      const competitorFee = gross * 0.25;
      const competitorNet = gross - competitorFee;
      const weeklyDifference = movaNet - competitorNet;
      const monthlySavings = weeklyDifference * 4;

      if (grossElem) grossElem.textContent = formatNaira(gross);
      if (feeElem) feeElem.textContent = '-' + formatNaira(movaFee);
      if (netElem) netElem.textContent = formatNaira(movaNet);
      if (savingsElem) savingsElem.textContent = '+' + formatNaira(monthlySavings) + ' / month';
      if (noteElem) noteElem.innerHTML = 'You earn <strong>+' + formatNaira(weeklyDifference) + ' more</strong> every week!';
    }

    slider.addEventListener('input', calculate);
    calculate();
  })();

  // =========================================================================
  // 13. City Directory Search & Interactive Filtering (Cities Page)
  // =========================================================================
  (function initCityFilters() {
    const searchInput = document.getElementById('city-search-input');
    const cards = document.querySelectorAll('.city-metro-card');
    const filterBtns = document.querySelectorAll('#city-filter-pills .city-filter-btn');
    const noResults = document.getElementById('no-city-results');
    const voteForm = document.getElementById('city-vote-form');
    const voteSuccess = document.getElementById('city-vote-success');

    if (!cards.length) return;

    let currentFilter = 'all';

    function applyFilter() {
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      let visibleCount = 0;

      cards.forEach(card => {
        const cityData = card.getAttribute('data-city') || '';
        const cardText = card.textContent.toLowerCase();
        const isActive = card.getAttribute('data-active') === 'true';
        const region = card.getAttribute('data-region') || '';

        let matchesTab = true;
        if (currentFilter === 'active') matchesTab = isActive;
        else if (currentFilter === 'nigeria') matchesTab = region === 'nigeria';
        else if (currentFilter === 'international') matchesTab = region === 'international';

        const matchesSearch = !query || cityData.includes(query) || cardText.includes(query);

        if (matchesTab && matchesSearch) {
          card.style.display = 'block';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        filterBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentFilter = btn.getAttribute('data-city-filter') || 'all';
        applyFilter();
      });
    });

    searchInput?.addEventListener('input', applyFilter);

    voteForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (voteSuccess) {
        voteSuccess.style.display = 'block';
        voteForm.reset();
        setTimeout(() => {
          voteSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    });
  })();

  // =========================================================================
  // 14. Help Center Live Search & Ticketing (Help Page)
  // =========================================================================
  (function initHelpCenter() {
    const searchInput = document.getElementById('help-search-input');
    const categoryBtns = document.querySelectorAll('.help-category-btn');
    const faqDetails = document.querySelectorAll('#help-faq-group details');
    const noResults = document.getElementById('no-faq-results');
    const ticketForm = document.getElementById('support-ticket-form');
    const ticketSuccess = document.getElementById('ticket-success');
    const ticketRefId = document.getElementById('ticket-ref-id');

    if (!faqDetails.length) return;

    let currentCat = 'all';

    function filterFaqs() {
      const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
      let visibleCount = 0;

      faqDetails.forEach(detail => {
        const cat = detail.getAttribute('data-cat');
        const keywords = (detail.getAttribute('data-keywords') || '') + ' ' + detail.textContent.toLowerCase();

        const matchesCat = currentCat === 'all' || cat === currentCat;
        const matchesSearch = !q || keywords.includes(q);

        if (matchesCat && matchesSearch) {
          detail.style.display = 'block';
          visibleCount++;
          if (q) detail.setAttribute('open', '');
        } else {
          detail.style.display = 'none';
          detail.removeAttribute('open');
        }
      });

      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    }

    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        categoryBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        currentCat = btn.getAttribute('data-help-cat') || 'all';
        filterFaqs();
      });
    });

    searchInput?.addEventListener('input', filterFaqs);

    ticketForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const randomId = '#MOV-' + Math.floor(10000 + Math.random() * 90000);
      const val = (id) => (document.getElementById(id)?.value || '').trim();
      const catEl = document.getElementById('ticket-category');
      const category = catEl && catEl.selectedIndex >= 0 ? catEl.options[catEl.selectedIndex].text : '';
      const text = [
        'Mova Support Ticket ' + randomId,
        'Name: ' + val('ticket-name'),
        'Contact: ' + val('ticket-email'),
        'Topic: ' + category,
        'Trip/Order ID: ' + (val('ticket-trip-id') || 'N/A'),
        '',
        val('ticket-message')
      ].join('\\n');
      const waUrl = 'https://wa.me/2348085524489?text=' + encodeURIComponent(text);
      if (ticketRefId) ticketRefId.textContent = randomId;
      if (ticketSuccess) ticketSuccess.style.display = 'block';
      ticketForm.reset();
      window.open(waUrl, '_blank', 'noopener');
    });
  })();

})();
`;

  fs.writeFileSync("js/main.js", jsContent);

  // 4. Generate Homepage
  console.log("Generating index.html...");
  fs.writeFileSync("index.html", generateHomepage(""));

  // 5. Generate Bespoke Enterprise Subpages
  console.log("Generating public subpages...");
  ensureDir("ride");
  fs.writeFileSync("ride/index.html", generateRidePage("../"));

  ensureDir("drive");
  fs.writeFileSync("drive/index.html", generateDrivePage("../"));

  ensureDir("deliver");
  fs.writeFileSync("deliver/index.html", generateDeliverPage("../"));

  ensureDir("safety");
  fs.writeFileSync("safety/index.html", generateSafetyPage("../"));

  ensureDir("cities");
  fs.writeFileSync("cities/index.html", generateCitiesPage("../"));

  ensureDir("about");
  fs.writeFileSync("about/index.html", generateAboutPage("../"));

  ensureDir("help");
  fs.writeFileSync("help/index.html", generateHelpPage("../"));

  // 5b. Generate Localized en-ng Directory Structure for Direct Static Hosting
  console.log("Generating localized en-ng directory structure...");
  ensureDir("en-ng");
  fs.writeFileSync("en-ng/index.html", generateHomepage("../"));

  ensureDir("en-ng/ride");
  fs.writeFileSync("en-ng/ride/index.html", generateRidePage("../../"));

  ensureDir("en-ng/drive");
  fs.writeFileSync("en-ng/drive/index.html", generateDrivePage("../../"));

  ensureDir("en-ng/deliver");
  fs.writeFileSync("en-ng/deliver/index.html", generateDeliverPage("../../"));

  ensureDir("en-ng/safety");
  fs.writeFileSync("en-ng/safety/index.html", generateSafetyPage("../../"));

  ensureDir("en-ng/cities");
  fs.writeFileSync("en-ng/cities/index.html", generateCitiesPage("../../"));

  ensureDir("en-ng/about");
  fs.writeFileSync("en-ng/about/index.html", generateAboutPage("../../"));

  ensureDir("en-ng/help");
  fs.writeFileSync("en-ng/help/index.html", generateHelpPage("../../"));

  ensureDir("en-ng/legal");
  fs.writeFileSync("en-ng/legal/index.html", generateLegalIndexPage("../../"));
  for (const doc of legalDocuments) {
    ensureDir(`en-ng/legal/${doc.slug}`);
    fs.writeFileSync(`en-ng/legal/${doc.slug}/index.html`, generateLegalDocumentPage(doc, "../../../"));
  }

  // 6. Generate Legal Pages
  console.log("Generating legal pages...");
  ensureDir("legal");
  fs.writeFileSync("legal/index.html", generateLegalIndexPage());
  for (const doc of legalDocuments) {
    ensureDir(`legal/${doc.slug}`);
    fs.writeFileSync(`legal/${doc.slug}/index.html`, generateLegalDocumentPage(doc));
  }

  // 7. Generate 404.html
  console.log("Generating 404.html...");
  fs.writeFileSync("404.html", generate404Page());

  // 8. Generate robots.txt and sitemap.xml
  console.log("Generating robots.txt and sitemap.xml...");
  fs.writeFileSync("robots.txt", `User-agent: *
Allow: /
Disallow: /legal/

Sitemap: https://mova.ng/sitemap.xml
`);

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mova.ng/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mova.ng/ride</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://mova.ng/drive</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://mova.ng/deliver</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://mova.ng/safety</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://mova.ng/cities</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://mova.ng/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://mova.ng/help</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>`;
  fs.writeFileSync("sitemap.xml", sitemapXml);

  console.log("Vanilla conversion complete!");
}

runBuild().catch(err => {
  console.error("Build failed:", err);
  process.exit(1);
});
