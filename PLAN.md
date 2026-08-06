# Pakistan Reconstruction — Project Plan

A cinematic, single-page interactive website that demonstrates how AI
reconstructs hidden structures from scattered evidence, using the founding
of Pakistan (1947) as the metaphor.

## 1. Experience Narrative

| Screen | Name | What the user sees | Action |
|--------|------|--------------------|--------|
| S1 | Lock | Black screen, old brass lock, `ENTER PASSWORD` | Type `1947` |
| S2 | Fragments | Disconnected evidence pieces (letter, DNA, map, passport, newspaper, medical) | Wait 3s, click `Reconstruct` |
| S3 | Reconstruction | Fragments converge → D3 network forms → Pakistan map + DNA helix overlap | Watch |
| S4 | Ending | Closing quote | Read |

Core message: **"Algorithms rebuild hidden structures from scattered evidence."**

## 2. Tech Stack (final)

| Purpose | Technology | Source |
|---------|-----------|--------|
| Structure | HTML5 semantics (4 `<section>`s) | local `index.html` |
| Styling | CSS3 custom properties + BEM | local `css/style.css` |
| Logic | Vanilla JS (state machine `LOCK → FRAGMENTS → RECONSTRUCT → END`) | local `js/app.js` |
| Animation | GSAP 3 (timelines, stagger, motion paths) | CDN |
| Network viz | D3 v7 (force-directed graph) | CDN |
| Text reveal | SplitType (letter/word splitting) | CDN |
| Particles | Lightweight canvas engine (zero-dep, ~80 lines) | local `js/particles.js` |
| Icons | Inline SVG (Font Awesome not needed) | local |
| Fonts | Google Fonts: Cinzel (display), Playfair Display (serif), Inter (UI) | Google CDN |

No React/Vue. No build step. Open `index.html` directly — everything else
loads from CDN (graceful offline fallback = static text remains readable).

## 3. File Structure

```
project/
├── index.html
├── css/
│   └── style.css
└── js/
    ├── app.js        # state machine, password, section switching
    ├── animation.js  # GSAP timelines + SplitType orchestration
    ├── network.js    # D3 network overlaid on the real Pakistan map + DNA helix
    └── particles.js  # floating paper-dust canvas
```

## 4. Color & Type System

- Background: `#04120b` (deep dark green)
- Surface/panel: `#0d2c1c`
- Pakistan flag green: `#01411c`, bright green `#1e7a41`
- Vellum/paper: `#eef2e6` (map lines), text `#f4f6ef`, muted `#7fa08a`
- Gold accent: `#d4af37` (used sparingly)
- Fonts: `Cinzel` (titles), `Playfair Display` (quotes), `Inter` (UI)

## 5. Animation Timeline

```
Load          → dust particles fade in
Lock          → lock shakes (idle drift), password input, 
                 correct=1947 → shackle pops → light burst → smoke
Fragments     → pieces scatter in with stagger (random x/y/rot)
                 after 3s: SplitType line "None of these pieces make sense alone."
                 → Reconstruct button glows
Reconstruct   → pieces fly to orbit → D3 network nodes/edges draw
                 → Pakistan map SVG draws itself (stroke-dashoffset)
                 → DNA helix assembles beside it
                 → network + map + DNA merge into one composition
                 → SplitType "Algorithms rebuild hidden structures from scattered evidence."
End           → crossfade → big quote, gold divider, subtle dust
```

## 6. Interaction Contracts

- Password: exactly `1947` (4 digits). Wrong input → shake + reset.
- Keyboard input driven; Enter submits; physical 4-slot display.
- `Reconstruct` button disabled until fragment phase intro completes.
- All sections are absolutely-stacked full-viewport; only one visible at a time.
- Respect `prefers-reduced-motion` (skip heavy animation, show content).

## 7. Content Copy

### Fragments (6 evidence cards)
1. **Letter** — "…we arrived in Lahore, the streets already crowded with families…"
2. **DNA** — `ATGCGCTATCG · TAACGCGATAGC` (Population Cluster #42)
3. **Map** — small point marked at Sindh
4. **Passport** — KARACHI · 1948 · stamp
5. **Newspaper** — "MIGRATION REACHES THOUSANDS"
6. **Medical** — Population Cluster #42 · lineage trace

### Reconstruction labels
- Provinces: Punjab, Sindh, Balochistan, NWFP, Bengal
- Edges = recorded migration routes / telegraph lines / rail lines

### Ending
> "A nation is more than one village.
> Knowledge is more than one sample."

## 8. Success Criteria (Definition of Done)

- [x] Lock requires `1947` and unlocks with animation
- [x] Six disconnected fragments scatter with stagger
- [x] 3s pause → "None of these pieces make sense alone."
- [x] Reconstruct animation converges fragments into network + map + DNA
- [x] All 4 sections flow in a single page, no reload
- [x] Works at 1080p and mobile portrait
- [x] Reduced-motion safe
