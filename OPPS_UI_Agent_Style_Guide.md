# OPPS UI SYSTEM — AGENT IMPLEMENTATION SPEC v1.0

Machine-followable style guide for implementing HTML/CSS in the OPPS design system (dark, gritty, crime-empire game UI — mobile-first). Follow every rule exactly. Where a value is given, use it verbatim. Do not invent new colors, fonts, radii, or shadows.

---

## 0. HARD RULES (apply to every element)

1. `* { box-sizing: border-box; }` and `body { margin: 0; }` are required globally.
2. Only the three fonts in §2 may be used. Never use system-ui, Arial, Inter, Roboto, etc.
3. Only colors from the token table in §1 may be used. No new hex values.
4. Border-radius is small and rare: `1px` (meter segments), `2px` (badges/tags), `3px` (buttons), `4–6px` (cards/thumbnails), `8px` (large panels/modals). Never exceed 8px except circles (`50%`) and the phone shell.
5. Bright accent colors (AMBER, HIGHLIGHTER, RED) are reserved for meaning (see §1.2). Large areas stay dark/neutral. Never use an accent as a large background fill — only as fills for small elements (badges, buttons ≤ ~200px wide, pins, segments) or as borders/text/glows.
6. All-caps + letter-spacing is the default for headings, labels, nav items, and buttons. Body copy is sentence case.
7. Borders on dark surfaces are translucent white: `rgba(255,255,255,0.06–0.14)` for resting, up to `0.22` for outline buttons. Never solid gray borders like `#444`.
8. Transitions: `all .16s` on buttons; `.22s–.28s` on overlays/drawers with `cubic-bezier(.4,0,.2,1)` for transforms.
9. Selection style: `::selection { background:#f5902a; color:#15120e; }`
10. Hide scrollbars on internal scroll regions: `scrollbar-width:none;` + `::-webkit-scrollbar{width:0;height:0;}`

---

## 1. COLOR TOKENS

### 1.1 Token table

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#0E0D0C` | Deepest background (badge wells, map base, modal interiors) |
| `--base` | `#131211` | Panel background |
| `--surface` | `#1B1917` | Card surfaces, swatch bodies |
| `--raised` | `#232019` | Raised/hover surfaces |
| `--app-bg` | `#221F1D` | Page background (with texture, §1.4) |
| `--screen-bg` | `#100F0D` | Phone screen background |
| `--text` | `#E9E4DB` | Primary text |
| `--text-bright` | `#F5E9D6` / `#F4EFE6` | Hero/display text, active nav text |
| `--muted` | `#A39C91` | Secondary text |
| `--muted-2` | `#8C867B` | Meter labels, tertiary text |
| `--faint` | `#7A7368` | Mono micro-labels, eyebrows |
| `--faint-2` | `#615C54` | Caption/footnote text |
| `--disabled` | `#574F46` | Disabled/locked text |
| `--disabled-dim` | `#3A3631` | Disabled icons/borders |
| `--amber` | `#F5902A` | Brand & primary action |
| `--amber-deep` | `#C2410C` | Gradient start, accent marks (`»`, index numbers) |
| `--highlighter` | `#E4EF3A` | Rewards & success (fills) |
| `--lime` | `#BFCE1C` | Success text/dots on dark (use instead of highlighter for text) |
| `--olive` | `#A9C24A` | LOW RISK |
| `--red` | `#E23B2E` | Danger & threat |
| `--red-bright` | `#F0604A` | Threat gradient top, timer digits |
| `--red-nav` | `#E2391F` | Active-nav underline/glow |
| `--ink-on-accent` | `#15120E` | Text on amber/highlighter fills |
| `--seg-empty` | `#2B2723` | Empty meter segments / track backgrounds |

### 1.2 Accent semantics (strict)

- **AMBER `#F5902A`** — brand mark, primary CTA fill, money values, active states, XP, "base/you" map pin. Tint badge: `background:rgba(245,144,42,0.14); color:#f5902a;` (ACTIVE).
- **HIGHLIGHTER `#E4EF3A` / LIME `#BFCE1C`** — rewards, success, completed objectives, ACCEPT button, reward modal frame, "drop/reward" map pin. Highlighter as fill with ink text; lime for text/dots on dark. Tint badge: `rgba(191,206,28,0.14)` + `#bfce1c` (NEW).
- **RED `#E23B2E`** — danger, threat meters, timers, HIGH RISK, section caret `›`, rival pins. Tint badge: `rgba(226,59,46,0.14)` + `#e23b2e` (TIMED).
- **HP GOLD** — health meters only: `linear-gradient(180deg,#f0c460,#c7892a)` (nominal token `#D8A23A`).
- **Risk mapping function:** Low → `#A9C24A`, Medium → `#F5902A`, High → `#E23B2E`.

### 1.3 Meter fill gradients (vertical, 180deg)

| Kind | Gradient | Use |
|---|---|---|
| gold | `linear-gradient(180deg,#f0c460,#c7892a)` | HP |
| red | `linear-gradient(180deg,#f0604a,#c5291c)` | THREAT / HEAT |
| lime | `linear-gradient(180deg,#eef64a,#bfce1c)` | PROGRESS / objectives |
| amber | `linear-gradient(180deg,#ffb55c,#e07d1e)` | Alt progress |
| empty | flat `#2b2723` | Unfilled segment |

Continuous bars use horizontal 90deg variants: XP `linear-gradient(90deg,#c7892a,#f0c460)`, stamina/daily `linear-gradient(90deg,#bfce1c,#eef64a)`.

### 1.4 Backgrounds & texture

- **Page (desktop docs/app shell):**
  `background:#221f1d; background-image:radial-gradient(rgba(255,255,255,0.016) 1px,transparent 1px),radial-gradient(120% 90% at 50% 0%,#2a2724 0%,#1b1917 70%); background-size:3px 3px,100% 100%;`
- **Phone screen:** `background:#100f0d; background-image:radial-gradient(rgba(255,255,255,0.014) 1px,transparent 1px); background-size:3px 3px;`
- **Card surface gradient:** `linear-gradient(180deg,#1a1815,#141210)`
- **Featured/amber-tinted card:** `linear-gradient(180deg,#211b14,#141210)` with border `rgba(245,144,42,0.28)`; diagonal-promo variant `linear-gradient(110deg,#23190f,#141210)`
- **Placeholder imagery (thumbnails/banners):** `repeating-linear-gradient(45deg,#211e1a 0 7px,#1a1714 7px 14px)` (cards 66px) or `repeating-linear-gradient(45deg,#231d15 0 8px,#1b1610 8px 16px)` (banners), plus a bottom scrim `linear-gradient(0deg,rgba(0,0,0,0.7),transparent)`.
- **Noise texture (active nav only):** inline SVG feTurbulence data-URI, `background-size:120px 120px`, `background-blend-mode:overlay,normal` over `linear-gradient(180deg,#2c2722,#141110)` (full recipe in §5.4).

### 1.5 Signature divider

Horizontal amber fade rule under mastheads/headers:
`height:3px; background:linear-gradient(90deg,#c2410c,#f5902a 30%,rgba(245,144,42,0) 80%);`
In-app header variant: `height:2px; background:linear-gradient(90deg,#c2410c,#f5902a 35%,rgba(245,144,42,0.05) 90%);`

---

## 2. TYPOGRAPHY

### 2.1 Font loading (required, exact)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:ital,wght@0,500;0,600;0,700;0,800;1,700;1,800&family=Oswald:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

Base: `body`/root uses `font-family:'Oswald',sans-serif; color:#e9e4db;`

### 2.2 Type roles (use exactly; never mix roles)

| Role | Spec | Notes |
|---|---|---|
| **Display** | Saira Condensed · 800 **italic** · 26–84px · `line-height:0.82–1` · `letter-spacing:-1px to 1px` · color `#f5902a` or `#f5e9d6` | Brand mark, hero titles ("TAKE THE BLOCK"), modal headline. ALL CAPS. |
| **Heading** | Saira Condensed · 700 · 17–32px · `letter-spacing:0.5–1.5px` · ALL CAPS | Section titles, card titles, nav screen titles. |
| **UI Label** | Oswald · 600 · 12–18px · `letter-spacing:1–2px` · `text-transform:uppercase` | Buttons, nav items, meter labels, stat labels. |
| **Body** | Oswald · 300 · 12–16px · color `#a39c91` (or `#cfc9bf` when more prominent) · `line-height:1.5–1.6` | Descriptions, subtexts. Sentence case. |
| **Stats/Mono** | JetBrains Mono · 400–500 · timers/money 12–24px; micro-labels 8–12px with `letter-spacing:1–3px`, uppercase, color `#7a7368` | All numbers, timers, money, codes, coordinates, eyebrows. |

**Rules:**
- Any numeric/stat value (money, XP, timers, counts, ratios) MUST be JetBrains Mono.
- Money values are amber `#f5902a`; reward XP/territory values lime `#bfce1c`; timer digits `#f0604a` or `#e23b2e`.
- Eyebrow pattern: mono, 8–11px, `letter-spacing:2px`, uppercase, `#7a7368`, placed above the value it labels.
- Display italic 800 is for emotional/branded moments only — never for list-item titles (those use Heading 700 non-italic).

---

## 3. LAYOUT & SPACING

- Docs/desktop content max-width: `1080px`, centered (`margin:0 auto`).
- Mobile screen content padding: `16–18px` horizontal; header pad `30px 18px 0`.
- Card padding: `14–16px`. Panel padding: `24–30px`.
- Vertical stacks of cards: `gap:11–12px` (lists), `16–18px` (sections).
- Section gap (docs): `52–60px` between major blocks.
- Section header row (both docs & app): flex row, `gap:10–14px`, contents = caret/index + title + 1px hairline filler:
  - Docs: mono index (`#c2410c`, 12px) + Saira 700 28px uppercase + `flex:1;height:1px;background:rgba(255,255,255,0.08);`
  - App: `›` glyph in `#e23b2e` (15–18px) + Saira 700 17–22px `letter-spacing:1.5px` + hairline `rgba(255,255,255,0.06–0.07)`.

---

## 4. COMPONENT RECIPES

### 4.1 Segmented meter (HP / THREAT / PROGRESS / HEAT)

Structure: label + flex track of N segments.

```html
<div style="display:flex;align-items:center;gap:10px;">
  <span style="width:44px;font-size:10px;font-weight:600;letter-spacing:1px;color:#8c867b;">HP</span>
  <div style="flex:1;display:flex;gap:3px;">
    <!-- repeat N segments; filled uses §1.3 gradient, empty uses #2b2723 -->
    <div style="flex:1;height:8px;border-radius:1px;background:linear-gradient(180deg,#f0c460,#c7892a);"></div>
    <div style="flex:1;height:8px;border-radius:1px;background:#2b2723;"></div>
  </div>
</div>
```

Constraints: segment height `7–9px` (9px in docs, 8px in cards, 7px compact), gap always `3px`, radius `1px`, segments flex-distributed (no fixed widths). Fill order left→right. Label width 44–58px. HEAT label color is `#e23b2e`.

### 4.2 Continuous progress bar (XP / stamina / daily)

```html
<div style="flex:1;height:8px;border-radius:4px;background:#2b2723;overflow:hidden;">
  <div style="height:100%;width:46%;background:linear-gradient(90deg,#c7892a,#f0c460);"></div>
</div>
```

Pair with mono ratio text right of the bar (`11–12px`, `#a39c91` or `#bfce1c`).

### 4.3 Badges & tags (radius 2px, font 9–11px, weight 600–700, letter-spacing 1–1.5px, uppercase)

| Variant | CSS |
|---|---|
| Solid value | `background:#e4ef3a;color:#15120e;font-weight:700;padding:5px 10px;` |
| Outline risk | `border:1px solid {riskColor};color:{riskColor};padding:4px 9px;background:transparent;` |
| Tint status | `background:{tint};color:{accent};padding:4px 8–9px;` (tints in §1.2) |
| Mono timer chip | `display:inline-flex;align-items:center;gap:6px;background:#0e0d0c;border:1px solid rgba(255,255,255,0.1);font-family:'JetBrains Mono';color:#f5902a;font-size:11px;padding:4px 9px;` + blink dot |
| Corner ribbon (card) | absolute `top:0;right:0;background:#e4ef3a;color:#15120e;font-weight:700;font-size:9px;padding:4px 8px;border-radius:0 6px 0 6px;` content `★ LABEL` |
| Locked "SOON" | `font-family:'JetBrains Mono';font-size:8–9px;color:#574f46;border:1px solid #3a3631;padding:2px 5–6px;border-radius:2px;` |

Blink dot: `width:6px;height:6px;border-radius:50%;background:#e23b2e;animation:blink 1.4s infinite;`

### 4.4 Buttons (radius 3px, `cursor:pointer`, `transition:all .16s`)

| Variant | Base | Hover |
|---|---|---|
| **Primary / ENGAGE** | Oswald 600 13–15px ls:2px `#e9e4db`; `background:linear-gradient(180deg,#2c2925,#1a1816); border:1px solid rgba(255,255,255,0.14); padding:11px 26px` (compact `9px 22px`) | `border-color:#f5902a; color:#f5902a; background:linear-gradient(180deg,#332e26,#1f1c18)` |
| **Success / ACCEPT** | Saira 800 italic 17–18px ls:1px `#15120e`; `background:#e4ef3a; border:none; padding:11px 28px` | `background:#eef64a; box-shadow:0 0 22px rgba(228,239,58,0.5)` |
| **Ghost / SELL** | Saira 700 italic 17–18px `#e9e4db`; `background:#272421; border:1px solid rgba(255,255,255,0.1–0.12); padding:11px 28px` | `background:#322e29` |
| **Outline / STORE** | Oswald 600 13px ls:2px `#e9e4db`; `background:transparent; border:1px solid rgba(255,255,255,0.22); padding:9px 20px` | `border-color:#f5902a; color:#f5902a` |
| **Amber solid / CONTINUE, TRAVEL** | Oswald 600 12–13px ls:1.5–2px `#15120e`; `background:#f5902a; border:none; padding:9–10px 16–24px` | `background:#ffa23f; box-shadow:0 0 20px rgba(245,144,42,0.4)` |
| **Disabled** | Oswald 600 `#574f46`; `background:#1a1816; border:1px solid rgba(255,255,255,0.06); opacity:0.7; cursor:not-allowed` | none |

Rules: button text ALL CAPS. Primary destructive/engage actions use the dark gradient button (amber appears only on hover); amber solid is reserved for the single most-promoted CTA on a screen. Success/reward confirms use highlighter. In paired modal actions, ACCEPT gets `flex:1.4` vs SELL `flex:1`.

### 4.5 Cards

**Standard list card:** `border:1px solid rgba(255,255,255,0.07); border-radius:6px; background:linear-gradient(180deg,#1a1815,#141210); padding:14px;`

**Opp/target card anatomy (top→bottom):**
1. Optional corner ribbon (§4.3) when card has a value tag.
2. Row: 66×66 thumbnail (radius 4px, placeholder stripes §1.4, bottom scrim, mono code centered at bottom in 9px `#8c867b`) + info column: Heading 19px title; row of Body role text + outline risk badge; mono location row (10px `#7a7368`) prefixed with a 7px ring dot (`border:2px solid #7a7368;border-radius:50%`).
3. Meters block: HP then THREAT segmented meters (8 segments, height 8px), `gap:8px`, `margin-top:13px`.
4. Footer row (`margin-top:13px`, space-between): `REWARD` eyebrow + amber mono value (15px) | ENGAGE primary button.

**Featured quest card:** outer `border:1px solid rgba(245,144,42,0.28); border-radius:8px; background:linear-gradient(180deg,#211b14,#141210)`. Banner 118px with stripe texture + scrim + amber solid tag chip (top-left) + Display italic 30px title in `#f5e9d6` with `text-shadow:0 2px 8px rgba(0,0,0,0.6)` bottom-left. Body: OBJECTIVES segmented meter (7px, lime) + mono count in `#bfce1c`; objective rows (16px dot circle filled `{state}`, text 13px Oswald 300); footer separated by `border-top:1px solid rgba(255,255,255,0.07)` with REWARD eyebrow/lime value + amber CONTINUE button.

**Objective row state colors:** done → dot `#bfce1c`, text `#8c867b`; active → dot `#f5902a`, text `#e9e4db`, mono count `#f5902a`; pending → dot `#4a443c`, text `#6f685e`.

### 4.6 Ticker / system message

```html
<div style="border:1px solid rgba(255,255,255,0.08);border-radius:5px;background:#15130f;padding:11px 14px;">
  <div style="font-family:'JetBrains Mono';font-size:12px;color:#a39c91;line-height:1.5;"><span style="color:#f5902a;">[09:08]</span> Message text.</div>
  <div style="font-size:13px;font-weight:300;color:#cfc9bf;margin-top:5px;"><span style="color:#c2410c;font-weight:600;">»</span> Secondary line.</div>
</div>
```

Timestamps in brackets, mono, amber.

### 4.7 App header (mobile)

Row: Display italic brand "OPPS" 30px `#f5902a` | right-aligned stat pairs (eyebrow 8px mono over value 14px; numeric values mono) | hamburger button 38×38 (`background:#1c1a17; border:1px solid rgba(255,255,255,0.1); border-radius:5px;` three 18×2px bars `#cfc9bf`, gap 4px). Below: 2px amber fade rule (§1.5), `margin-top:14px`.

### 4.8 Nav drawer

- Scrim: absolute inset 0, `background:rgba(0,0,0,0.6); z-index:50; transition:opacity .25s;` toggled via opacity + pointer-events.
- Panel: absolute left, `width:262px; z-index:51; background:linear-gradient(180deg,#191714,#101010); border-right:1px solid rgba(245,144,42,0.2); box-shadow:30px 0 60px rgba(0,0,0,0.7);` slide via `transform:translateX(-112%) ↔ translateX(0); transition:transform .28s cubic-bezier(.4,0,.2,1);` padding `30px 0 20px`.
- Header: brand 26px + circular ✕ button (30px, `border:1px solid rgba(255,255,255,0.14)`, `#a39c91`), bottom hairline.
- Footer: top hairline + full-width Outline button.

**Nav item states (exact):**

| State | Recipe |
|---|---|
| **Active** | `padding:15px 20px (or 14px 16px); background-color:#1c1814;` noise SVG over `linear-gradient(180deg,#2c2722,#141110)` (`background-size:120px 120px,100% 100%; background-blend-mode:overlay,normal;`); `box-shadow:inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -2px 0 #e2391f, inset 0 -13px 16px -9px rgba(226,57,31,0.45), inset 9px 0 18px -11px rgba(226,57,31,0.4);` leading triangle: `width:0;height:0;border-top:6px solid transparent;border-bottom:6px solid transparent;border-left:10px solid #e2391f;filter:drop-shadow(0 0 4px rgba(226,57,31,0.75));` label Oswald 600 15px ls:1.5px `#f4efe6`. |
| **Default** | `padding:14px 20px; border-left:3px solid transparent;` caret `▸` 13px `#7a7368`; label `#d8d2c8`. |
| **Locked** | as Default but caret `#3a3631`, label `#574f46`, trailing SOON chip (§4.3), no click handler. |

Noise SVG data-URI (verbatim):
`url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.5%22/%3E%3C/svg%3E')`

### 4.9 Reward modal

- Overlay: absolute inset 0, `z-index:60; display:flex; align-items:center; justify-content:center; padding:18px; background:rgba(0,0,0,0.78);` opacity/pointer-events toggle, `transition:opacity .22s`.
- Dialog: `width:100%; border:1px solid rgba(228,239,58,0.55); border-radius:8px; background:linear-gradient(180deg,#1a1813,#0e0d0b); box-shadow:0 0 60px rgba(0,0,0,0.7);` enter via `transform:scale(0.94)→scale(1); transition:transform .22s;` padding 16px.
- Header row: chip (`background:#0e0d0b; border:1px solid rgba(228,239,58,0.4); padding:7px 12px; radius:3px;` content: `›` 13px highlighter + Display italic 22px highlighter "YOU RECEIVED") | circular ✕ (32px, `border:2px solid #e4ef3a; color:#e4ef3a`).
- Render well: height 170px, radius 6px, `background:radial-gradient(120% 100% at 50% 40%,#22201b,#0c0b09); border:1px solid rgba(255,255,255,0.06);` scanline overlay `repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0 2px,transparent 2px 5px);` centered mono placeholder label + Heading 30px `#cfc9bf` item name.
- Item tags: wrap row, `border:1.5px solid #e4ef3a; color:#e4ef3a; font-weight:600; font-size:12px; padding:6px 12px; border-radius:3px;`
- Footer: Ghost SELL (`flex:1`) + Success ACCEPT (`flex:1.4`), gap 10px.

### 4.10 Map screen

- Container: `border:1px solid rgba(255,255,255,0.1); border-radius:8px; overflow:hidden;` map viewport height ~520px; SVG `viewBox 0 0 390 760`, `preserveAspectRatio:xMidYMid slice`, base fill `#100f0d` / bg `#0e0d0c`.
- Road palette: minor `#322f2b` w1.4; major `#52504b` w3.2; avenues `#5d5b55` w4.4; all `stroke-linecap:round`. River: casing `#0a0907` w52 under `#16161c` w46 + dashed centerline `#22232b` w2 `dasharray 1 9` opacity .6. Bridges `#6b6862` w3.5. Parks: fill `#14160f`, stroke `#222417`. District labels: Oswald 700 9–11px, `#cfc9bf`, ls:2.5px, uppercase, opacity 0.45–0.7. Vignette: radial 55%→100% black 0→0.62.
- Pins: drop shape (8.5px circle stroked `#0e0d0c` 1.5 + triangle tail + ellipse shadow `rgba(0,0,0,0.55)` + 3px inner dot `#15120e`). Pin colors: base `#f5902a`, threat `#e23b2e`, reward `#bfce1c`. Player pin gets pulse ring: circle r9 stroked pin-color w2, `animation:mappulse 2.4s ease-out infinite`. Pin label plate: `fill:rgba(10,9,8,0.82)`, stroke `rgba(255,255,255,0.08)`, title Oswald 700 9px in pin color, sub mono 8px `#a39c91`.
- Footer bar: `background:#15130f; border-top:1px solid rgba(255,255,255,0.08); padding:14px 16px;` location dot 14px amber with halo `box-shadow:0 0 0 4px rgba(245,144,42,0.18);` + Heading 18px + Body 12px + amber solid TRAVEL button.
- Legend: mono 10px `#a39c91` rows of 9px colored dots + labels (BASE amber / THREAT red / REWARD lime).

### 4.11 Phone frame (only when presenting a device mock)

Shell: `width:404px; padding:13px; border-radius:46px; background:linear-gradient(160deg,#1c1a18,#050505); box-shadow:0 0 0 2px #000, 0 40px 80px -20px rgba(0,0,0,0.9), inset 0 0 0 1px rgba(255,255,255,0.04);` plus two left-edge buttons (3px wide, `#0a0a0a`). Screen: `378×792px; border-radius:36px; overflow:hidden;` §1.4 phone bg; speaker bar `104×7px` black pill centered top, z-index 40. Screen layout: `display:flex; flex-direction:column;` header `flex:none`, body `flex:1; overflow-y:auto;` with hidden scrollbar class.

---

## 5. ANIMATIONS (define exactly these; no others)

```css
@keyframes mappulse { 0% { transform:scale(0.5); opacity:0.8; } 100% { transform:scale(2.6); opacity:0; } }
@keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
```

Usage: `blink 1.4s infinite` on 6px red timer dots; `mappulse 2.4s ease-out infinite` on player-pin ring (with `transform-box:fill-box; transform-origin:center` in SVG). State changes animate via opacity/transform transitions only (§0.8). No bounce, no fade-in-up page animations, no parallax.

---

## 6. CONTENT & COPY RULES

- Voice: terse, street/heist register, imperative. Titles ALL CAPS ("TAKE THE BLOCK", "OPPS LIST").
- Money formatted `$898`, ranges `$110–150` (en dash). Ratios `2/4`, `73/100`. Timers `MM:SS` (`19:48`). Timestamps `[09:08]`.
- Eyebrow labels: RANK, XP, BALANCE, REWARD, OBJECTIVES, TIME LEFT.
- Locked features show the SOON chip, never hidden.

## 7. ACCESSIBILITY & STATE FLOOR

- Interactive elements are `<button>` or carry click handlers + `cursor:pointer`; disabled uses `cursor:not-allowed` and no handler.
- Overlays toggle BOTH `opacity` and `pointer-events` (and `transform` for drawer/modal) so hidden layers don't intercept input.
- Maintain text contrast: never place `#7a7368`-or-darker text on `#232019`-or-lighter surfaces for content that must be read; accent-on-accent text is always `#15120e`.

## 8. VALIDATION CHECKLIST (run before delivering)

- [ ] Only Saira Condensed / Oswald / JetBrains Mono in use; Google Fonts link present.
- [ ] Every hex in the output appears in §1 (incl. gradients/tints/shadows listed here).
- [ ] All numbers/timers/money are JetBrains Mono; money amber; timers red.
- [ ] All meters: 3px gap, 1px radius, 7–9px height, flex-distributed segments.
- [ ] Buttons match a §4.4 variant exactly, incl. hover.
- [ ] No border-radius > 8px outside circles/phone shell; no white/light backgrounds.
- [ ] Accents used only per §1.2 semantics; large surfaces remain dark neutrals.
- [ ] Drawer/modal use the exact z-index (50/51/60), scrim opacities, and transitions.
- [ ] Only the two keyframes in §5 exist.
