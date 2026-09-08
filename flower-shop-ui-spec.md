# Shukufa — UI Design System & Component Specification

> Source: analysis of the provided reference screenshots (mobile + desktop: header, product list, product detail, cart, footer, best-sellers, offers, why-us, testimonials).
> **Important:** the reference screenshots were RTL/Persian mockups — direction and copy in this spec are corrected for the actual project: **LTR layout, 3 supported languages (Uzbek, Russian, English)**. Treat all Persian text in the original mockups as placeholder content only; all real copy goes through i18n.
> Purpose: a single reference so **any new section/page is built with the same colors, type, spacing and component patterns** — nothing "invented" per feature.

---

## 1. Brand Tokens

### 1.1 Color Palette

| Token | Hex (approx.) | Usage |
|---|---|---|
| `brand-primary` (pink/red) | `#E0568C` – `#EF4C73` | Primary CTAs, logo wordmark, active states, star rating, price discount %, active pagination dot, active tab bar icon |
| `brand-maroon` | `#4A0F1F` | Footer background, hero headline text, "why us" accent text |
| `brand-cream` | `#F6F1E8` | Product image background, hero background, soft section backgrounds |
| `brand-accent-green` | `#1FA971` | Trust/feature icon color (circle bg `#E7F8EF`) |
| `neutral-900` | `#1F2937` | Headings, product titles |
| `neutral-500` | `#6B7280` | Secondary text, attribute labels (size, ribbon, packaging) |
| `neutral-200` | `#E5E7EB` | Borders, dividers |
| `surface-white` | `#FFFFFF` | Cards, inputs |
| `discount-bg` | `#FDEAF0` | Discount % badge background |
| `error/delete` | `#EF4444` | Trash/delete icon |

**Rule for new sections:** never introduce a new color. Pick from this table. If a new *semantic* need appears (e.g. "success toast"), map it to the closest existing token family (green → `brand-accent-green`, warning → `brand-primary`).

### 1.2 Typography

- **Script/direction:** LTR. Content is delivered in three locales — **Uzbek (uz), Russian (ru), English (en)** — so the base font must fully support **Latin + Cyrillic** glyphs (e.g. `Inter` for body/UI, existing `Fraunces` reserved for display/serif headings where already used, e.g. blog). Do not use Persian-only fonts (Vazirmatn etc.) — not needed for this project.
- **Numerals:** standard Arabic (Western) numerals (0–9) in prices, ratings, badges, countdowns.
- **All copy comes from i18n keys** — no hardcoded strings in components, and every string needs a value in all three locale files (uz/ru/en).

| Style | Size / Weight | Used for |
|---|---|---|
| H1 | 28–32px / Bold | Page titles ("Cart"), hero headline (2 lines, ~34px on desktop) |
| H2 | 20–24px / Bold | Section titles ("Best Sellers", "Why Us", "Order Summary") |
| H3 | 16–18px / SemiBold | Product name on cards/detail page |
| Body | 14–15px / Regular | Descriptions, FAQ text, testimonial paragraphs |
| Small/Caption | 12–13px / Regular | Attribute labels (size, ribbon), timestamps, char counters |
| Price-large | 18–20px / Bold | Current price |
| Price-strike | 13–14px / Regular, `neutral-500`, line-through | Original price |

### 1.3 Spacing Scale
`4, 8, 12, 16, 24, 32, 48, 64` px. Card internal padding = 16px (mobile) / 20–24px (desktop). Section vertical spacing = 48px mobile / 64–80px desktop.

### 1.4 Radius & Elevation
- Cards / images: `rounded-2xl` (16–20px)
- Buttons (primary CTA): fully pill, `rounded-full`
- Inputs, chips, badges: `rounded-xl` (12px) or pill for tags/badges
- Shadows: flat design by default — border (`1px solid neutral-200`) instead of shadow; use a very soft shadow (`0 2px 8px rgba(0,0,0,0.06)`) only on floating elements: carousel arrow buttons, sticky bottom bars, dropdowns.

### 1.5 Breakpoints

| Name | Range | Layout behavior |
|---|---|---|
| `mobile` | < 768px | 1-column, bottom tab bar, accordion footer, sticky bottom summary/CTA, filter as bottom-sheet/drawer |
| `tablet` | 768–1023px | 2-column product grid, header collapses nav into menu, sidebar filter becomes toggleable |
| `desktop` | ≥ 1024px | Multi-column grid (3–4 cols), always-visible filter sidebar, 2-row header w/ full nav, footer as 4–5 column grid |

---

## 2. Global Layout Rules

1. **Direction:** `dir="ltr"` on `<html>`. Normal LTR reading order everywhere: breadcrumbs read left → right (Home > Category > ...), "next"/forward chevrons point **right** (→), "back" chevrons point **left** (←).
2. **Language:** `lang` attribute reflects the active locale (`uz` / `ru` / `en`). A language switcher (see Section 3.1) must be reachable from every page.
3. **Container:** max-width ~1280–1440px desktop, centered, 16–24px side padding mobile, 40–64px desktop.
4. **Grid:** product grids = `grid-cols-2` (mobile) → `grid-cols-3` (tablet) → `grid-cols-4` (desktop), gap 16–24px.
5. **Icons:** line-style icon set (lucide-style), consistent 20–24px size, `currentColor` so they inherit context color (white on maroon footer, `neutral-900` elsewhere, `brand-primary` when active). Icons are **not mirrored** (no RTL flipping needed).
6. **Every list of products (grid, carousel, "you may like")** must reuse the single **Product Card** component (Section 5.1) — never a bespoke card per section.

---

## 3. Layout Components

### 3.1 Header

**Mobile** (`< 768px`)
- Single rounded pill search bar, full width: search icon on the **left** inside the input, placeholder text from i18n (`header.searchPlaceholder`); brand wordmark/logo sits outside the search bar, top-left.
- Hamburger menu icon on the **right** edge, opens a full nav drawer (nav links + language switcher live here on mobile).
- Below the search bar (on list/detail pages): breadcrumb row, left → right (`Home > Congratulation Flowers > ...`).

**Desktop** (`≥ 1024px`) — two stacked rows:
- **Row 1** (left → right): logo — large centered search bar — language switcher (UZ/RU/EN dropdown) — wishlist icon — cart icon w/ pink numeric badge — account dropdown (user name + down chevron).
- **Row 2**: primary nav links (from i18n, e.g. Categories, Gift Boxes, Congratulations, Condolences, Girls' Day, Today's Delivery, Bouquets).
- Row 1 sticky on scroll; Row 2 scrolls normally.

### 3.2 Footer

- Background: `brand-maroon`, all text white/`neutral-200`.
- **Back-to-top** pill button (white bg, maroon text) in the top row.
- Contact block (phone number, response hours) on the opposite side of the back-to-top button.
- **Desktop:** 4–5 equal columns of link groups ("Quick Access" categories, "About Us"), logo block on one side.
- **Mobile:** collapses into an **accordion** — each group is a row with a chevron-down toggle; logo + tagline centered above; contact info centered below logo.
- Bottom strip: centered copyright line + social icons (Telegram, YouTube, Instagram, X) aligned to one edge. Divider line (`1px`, translucent white) above this strip.

### 3.3 Mobile Bottom Tab Bar

- Fixed, 4 items with icon + label (i18n): Profile, Wishlist, Cart, Home.
- Active tab: icon + label rendered in `brand-primary`, with a soft pink rounded pill behind the icon.
- Sits above any sticky page-level CTA bar (e.g. cart total + "Continue" button renders directly above the tab bar).

---

## 4. Page Templates

### 4.1 Home Page (top → bottom)
1. **Hero carousel** — full-bleed `brand-cream`/silk-texture background, bouquet photo anchored to one side, bold `brand-maroon` 2-line headline, pill CTA ("View Products") with a right-pointing chevron, arrow nav + dot indicators.
2. **Why Us — photo grid** (desktop, 4 columns): photo + bold title + 1-line description per column.
3. **Best Sellers carousel** — section header (title on the left, "See more" link + right chevron on the right), horizontal-scroll Product Cards, circular arrow button.
4. **Offers / Countdown band** — pink-tinted rounded container, header row (bold pink title on the left, centered countdown `HH:MM:SS`, "See more" link on the right), Product Cards inside.
5. **Why Us — icon row** (compact, 3 items, used again on PDP): circular light-green icon badge + short bold title + 1-line description, 3-column on mobile too.
6. **Customer testimonials carousel** — 3-up cards, arrow nav.
7. Footer.

### 4.2 Product Listing Page
- Breadcrumb + page title + result count ("64 items found").
- **Mobile:** two pill buttons — "Sort" (opens bottom sheet) and "Filter" (icon + label, opens bottom-sheet drawer).
- **Desktop:** horizontal sort-tabs bar (Lowest Price, Highest Price, Newest, Best Selling, Biggest Discount, Today's Delivery) + always-visible **Filter Sidebar** (Section 5.7) on the right side of the grid.
- Product grid: 2 cols (mobile, list-style rows also acceptable) → 3 cols (desktop).
- **Pagination**: numbered pill row + prev/next chevrons (prev = left chevron, next = right chevron); active page = filled `brand-primary` circle, white number.
- Footer.

### 4.3 Product Detail Page
1. Breadcrumb.
2. Gallery: main image (`brand-cream` bg) + thumbnail strip (mobile: below, horizontal; desktop: below-right of main image), arrow nav + slide dots on mobile. Optional badges pinned over gallery ("Best Seller", "Today's Delivery") on desktop.
3. Title + star rating.
4. **Size selector**: pill/chip row (Small, Medium, Large) — selected = filled dark chip, unselected = light gray chip.
5. **Color selector**: chip with a small color-dot + label — selected = bordered/elevated chip.
6. "More Personalization" — collapsible accordion row with chevron.
7. Trust/feature row (2 items desktop): icon + short label (freshness/quality guarantee, fast delivery).
8. Price block (current bold + strikethrough original + discount % badge) + full-width/pill CTA "Add to Cart" (sticky bottom on mobile).
9. Below the fold: "Add-ons" icon grid, customer reviews, FAQ accordion, "You May Also Like" related-products carousel.
10. Footer.

### 4.4 Cart Page
1. Title "Cart" + item count subtitle.
2. **Cart Item Card** (repeat per line item, Section 5.9).
3. "Order Details" block: special-requests textarea with placeholder example + character counter ("0/300"), promo-code input + "Apply" pill button.
4. **Order Summary** (sticky sidebar on desktop; stacked before the recommendations carousel on mobile): line rows (Subtotal, Product Discount, Promo Code) → divider → bold total (Grand Total) → full-width primary pill button ("Continue").
5. "Recommended for You" carousel.
6. Footer.

---

## 5. Core Component Library

### 5.1 Product Card
- Image: 1:1, `brand-cream` background, `rounded-2xl` corners.
- Discount badge: pink pill, top-**left** corner of image (e.g. `-55%`).
- Wishlist heart icon: outline icon, top-**right** corner of image (grid/carousel views only — omitted in the compact mobile list rows).
- Title: 2-line clamp, bold, `neutral-900`.
- Rating row: filled star icon (`brand-primary`) + numeral (e.g. `4.5`).
- Price row: bold current price + currency label; strikethrough original price in `neutral-500`; discount % pill badge.

### 5.2 Buttons
- **Primary (filled pill):** `brand-primary` background, white bold text, `rounded-full`. Use for the single main action per screen ("Add to Cart", "Continue", "Apply", "Filter").
- **Secondary (outline pill):** white background, `neutral-900` border/text. Use for supporting actions ("View Products", "Back to Top").
- **Icon button (circular):** white bg, soft shadow, used for carousel arrows only.
- States: disabled = 50% opacity, no shadow; loading = spinner replaces label, button stays same width.

### 5.3 Quantity Stepper
- Pill container, light-gray bg, 3 equal cells: `−` / number (white rounded box) / `+`.
- At quantity = 1, the `−` cell is replaced by a trash/delete icon (`error` color) — matches cart screenshot behavior.

### 5.4 Chips / Selectors (size, color, filter tags)
- Unselected: light-gray bg, `neutral-900` text, no border.
- Selected: filled dark/`brand-primary`-tinted bg (size) or bordered + elevated (color, since color itself is shown as a dot).
- Color chip = small solid circle (actual color) + label text, inside a pill.

### 5.5 Accordion / Collapsible
- Row: label on the left + chevron on the right (rotates 180° open/closed).
- Used for: mobile footer groups, "More Personalization", FAQ items.

### 5.6 Carousel
- Horizontal snap-scroll of cards.
- Section header pattern: **title (bold, left)** + **"See more" link with right chevron (right)**.
- One circular arrow button overlapping the left edge of the track (appears once the user can scroll back).

### 5.7 Filter Sidebar (desktop) / Filter Drawer (mobile)
- Grouped, collapsible sections with a chevron-up/down per group: Flower Type (checkbox list), Occasion (checkbox list), Price (dual-handle range slider + "From" / "To" numeric inputs), Style (checkbox list), Flower Color (color-dot swatches), Bouquet Size (checkbox list).
- Sticky primary pill button "Filter" pinned to the bottom of the sidebar/drawer to apply.
- Mobile: renders as a bottom-sheet/drawer triggered by the "Filter" toolbar button; same internal structure as desktop.

### 5.8 Countdown Timer
- Bold `brand-primary` numerals, `HH:MM:SS` format with colon separators, standard digits.
- Label ("Offer ends in:") sits to its **left**, followed by the time.

### 5.9 Cart Item Card
- Image (fixed size) on the **right** side, delete/trash icon top-**right** corner of the card.
- Title bold.
- Attribute grid (2 columns): label (`neutral-500`, small) over value (bold) — e.g. Size/Large, Ribbon/Champagne, Packaging/Luxury Cream Paper, Gift/Chocolate.
- Gift-note box: light pink-tinted background, quoted note text.
- Price row (current + strikethrough + %) on the left; Quantity Stepper (Section 5.3) on the right.

### 5.10 Testimonial Card
- Bordered white card, `rounded-2xl`.
- User name bold, top of card.
- Body paragraph, `neutral-500`/regular.
- "Purchased product:" label + small thumbnail row (image, product name, color swatch dot + label, "Go to product" link with a right chevron).

### 5.11 Form Inputs
- Textarea: `rounded-xl`, light-gray placeholder example text, live character counter bottom-right ("0/300").
- Promo code: single-line input + adjacent primary pill button ("Apply"), input placeholder "Promo code".

---

## 6. Responsive Behavior — Quick Reference

| Component | Mobile | Desktop |
|---|---|---|
| Header | 1 row, search + hamburger | 2 rows, full nav + account/cart/wishlist icons + language switcher |
| Footer | Accordion, centered logo | 4–5 column grid |
| Product grid | 2 cols (or stacked list) | 3–4 cols |
| Filters | Bottom-sheet drawer via toolbar button | Persistent sidebar |
| Sort | Bottom-sheet via toolbar button | Horizontal tab bar |
| Cart summary | Stacked, sticky CTA above tab bar | Sticky sidebar beside items |
| PDP gallery thumbnails | Below main image, horizontal scroll | Below-right, static row |
| Add-to-cart CTA | Sticky bottom bar | Inline within page flow |
| Bottom tab bar | Present | Not used |

---

## 7. Checklist for Adding a New Section

1. **Colors** — only use tokens from Section 1.1. No new hex values.
2. **Type** — use the existing scale (Section 1.2); Latin/Cyrillic-capable font for all UZ/RU/EN copy; every string goes through i18n (add the key to all three locale files, never hardcode).
3. **Spacing/radius** — pull from Sections 1.3–1.4; cards = `rounded-2xl`, buttons = pill.
4. **Component reuse** — if it shows products → **Product Card** (5.1). If it's a horizontal collection → **Carousel** (5.6) with the standard header pattern (title left + "See more" right). If it's a promo/urgency block → follow the **Offers/Countdown** pattern (pink-tinted container + timer).
5. **LTR** — verify reading order (left → right), icon direction (forward chevrons point right), and breadcrumb direction.
6. **Responsive** — define the mobile behavior explicitly (does it collapse to accordion? drawer? stack?) before shipping — every existing section has one.
7. **CTA discipline** — one primary pill button per section/page at most; everything else is secondary/outline or a text+chevron link.
