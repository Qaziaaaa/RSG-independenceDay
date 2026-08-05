# SMIT LMS — Design System

This document is the single source of truth for the LMS interface. Every page, component, spacing value, font, and UX behavior must derive from the rules below. If a page is not covered here, the nearest covered page wins; if you must invent, add it to this document.

---

## 1. Product & Audience

- **Product:** A Learning Management System for the SMIT bootcamp — students enroll in courses (Web Dev, AI, App Dev, Cloud, Freelancing) and work through a structured curriculum lesson by lesson.
- **Audience:** Young professionals in Pakistan studying on desktop, tablet, and low-end mobile. Many study on the go, at low bandwidth, and on older screens.
- **The page's single job:** Get the student into today's lesson with the least possible friction. Every screen must answer "what do I do next?"
- **Tone of voice:** Plain, encouraging, practical. Sentence case everywhere. Talk like a coach, not a salesperson. Never apologize in an error; explain what happened and how to fix it.

### Design concept — "The Lesson Thread"

The learner's whole journey is one continuous thread: enroll → watch → practice → quiz → certificate. The curriculum is a real sequence, so the interface renders it as an honest **thread** (connected nodes on a vertical line), not decoration. The single signature element of the whole product is the **Lesson Thread** — a glowing amber node marks exactly where you are, and the thread is present wherever progress lives (Course Detail, Lesson Player, Dashboard).

One aesthetic risk, taken once: the amber **active node glow** on an otherwise calm pine-and-ink palette. Everything else stays quiet and disciplined.

---

## 2. Design Principles

1. **The thread is the map.** Wherever a sequence exists (curriculum, course modules, onboarding), show it as the thread. Never fake a sequence with numbers on unordered content.
2. **One memorable thing per screen.** The signature element earns the bold color. Everything else is calm.
3. **Words are design material.** A button says exactly what it does ("Save changes", not "Submit"). A toast echoes the button ("Published"). Same action, same name, everywhere.
4. **Empty states invite, never guilt.** "No courses yet" → "Browse courses".
5. **Failure is directional.** An error names the problem and the fix. No "Something went wrong" alone.
6. **Motion serves, it doesn't perform.** Reveals are fast and subtle. Honoring `prefers-reduced-motion` is mandatory.
7. **Quality floor without announcing it:** visible keyboard focus, WCAG AA contrast, responsive down to 360px.
8. **Less is more.** Before shipping a screen, remove one accessory.

---

## 3. Color Tokens

> Hex values are final. Never drift to "similar" values.

### Brand palette

| Token | Value | Use |
|---|---|---|
| `--ink` | `#172630` | Headings, body text on light surfaces |
| `--slate` | `#5A6B78` | Secondary text, captions, metadata |
| `--mist` | `#F4F6F5` | Page background (cool-tinted, not cream) |
| `--surface` | `#FFFFFF` | Cards, sheets, inputs |
| `--line` | `#E2E8E5` | Borders, dividers, hairlines |
| `--pine` | `#0E6B5C` | **Primary.** Buttons, links, active nav, focus |
| `--pine-deep` | `#0A5348` | Primary hover, pressed states |
| `--amber` | `#F0A41E` | **Signature accent.** Active thread node, progress, highlights |
| `--amber-soft` | `#FDF1D9` | Progress fills / badge backgrounds |

### Semantic tokens

| Token | Value | Use |
|---|---|---|
| `--success` | `#1F9D6B` | Completed, passed, certificates |
| `--danger` | `#C8453F` | Errors, destructive actions |
| `--info` | `#2F6FB6` | Notices, tips |
| `--warning` | `#D98324` | Expiring, retry-now |

### Text on dark

Used on the nav rail / lesson player chrome (`--ink` background):

| Token | Value |
|---|---|
| `--dark-text` | `#EDF2EF` |
| `--dark-muted` | `#9FB0AA` |

### Contrast rule
All body text at `--slate` or darker must be ≥ 4.5:1 on its background. The amber accent is never used for body text — only for progress / active states (≥ 3:1 against its background).

---

## 4. Typography

### Typefaces (Google Fonts)

| Role | Family | Notes |
|---|---|---|
| Display | **Space Grotesk** | Headings, numerals, nav brand, big stats. Use with restraint — headings only. |
| Body | **Inter** | All UI text, paragraphs, buttons, labels. |
| Mono | **JetBrains Mono** | Code blocks, quiz code, file paths, IDs, timestamps in the lesson player. |

### Type scale (display)

| Token | Size | Weight | Line-height | Notes |
|---|---|---|---|---|
| `--t-display-1` | `clamp(40px, 6vw, 64px)` | 600 | 1.05 | Landing / auth heroes |
| `--t-display-2` | `clamp(30px, 4vw, 44px)` | 600 | 1.1 | Page titles |
| `--t-title` | `24px` | 600 | 1.25 | Section headings, card titles |
| `--t-subtitle` | `18px` | 500 | 1.4 | Card subtitles |

### Type scale (body)

| Token | Size | Weight | Line-height | Notes |
|---|---|---|---|---|
| `--t-body` | `16px` | 400 | 1.6 | Default UI text |
| `--t-body-sm` | `14px` | 400 | 1.5 | Secondary / form hints |
| `--t-caption` | `12px` | 500 | 1.4 | Labels, eyebrows, timestamps |
| `--t-mono` | `14px` | 400 | 1.6 | Code, mono data |
| `--t-btn` | `15px` | 600 | 1 | Buttons |

### Typography rules
- Sentence case everywhere. Only proper nouns and the start of sentences get capitals.
- Use `Space Grotesk` **600** for all headings; never use Space Grotesk for body copy.
- Letter-spacing: normal for body; `0.02em` on captions/eyebrows; `-0.01em` on display headings.
- Line length for paragraphs: max `68ch`.
- Numbers in stats use Space Grotesk 600 (tabs-lining, not tabular) — e.g. "72%".

---

## 5. Spacing System

4px base scale. Use tokens, never raw values.

| Token | Value | Typical use |
|---|---|---|
| `--sp-1` | 4px | Micro gaps inside controls |
| `--sp-2` | 8px | Icon-to-text gaps, small paddings |
| `--sp-3` | 12px | Input padding, card padding (compact) |
| `--sp-4` | 16px | Default card padding, form field spacing |
| `--sp-5` | 20px | Section-to-card gaps, button-to-list gaps |
| `--sp-6` | 24px | Card grid gaps, modal padding |
| `--sp-8` | 32px | Major section spacing, sidebar width inset |
| `--sp-10` | 40px | Page section separation |
| `--sp-12` | 48px | Between major page blocks |
| `--sp-16` | 64px | Between page heroes and content |
| `--sp-20` | 80px | Large screen section rhythm |

### Rhythm rules
- Vertical rhythm on content pages: sections separated by `--sp-12`, blocks inside a section by `--sp-8`.
- Cards: `--sp-4` padding standard; `--sp-6` for feature/hero cards.
- Consistent gap between page sections; never stack two differing spacers.

---

## 6. Layout & Grid

### Page shell
- **Student area:** fixed left nav rail (220px, `--ink` background) + content column.
- **Content:** `max-width: 1200px`, centered, gutters `--sp-6` on desktop, `--sp-4` on mobile.
- **12-column grid** for dashboard/catalog layouts; cards span 4 columns on ≥1200px, 6 on ≥768px, 12 below.
- **Lesson Player** uses its own chrome (see §8.8).

### ASCII wireframe — Dashboard

```
┌──────────┬──────────────────────────────────────────┐
│ NAV (ink)│  Welcome back, Ali                [Search]│
│          ├──────────────────────────────────────────┤
│ Home     │  ┌─ Continue the thread ───────────────┐ │
│ My Courses│  │ ●  Lesson 14 · JavaScript Functions │ │
│ Catalog  │  │    ▓▓▓▓▓▓▓▓░░░ 72%   [Resume]        │ │
│ Progress │  └──────────────────────────────────────┘ │
│ ...      │  [ 48-day streak ] [ 3 certs ] [ 2 badges]│
│          ├──────────────────────────────────────────┤
│          │  My Courses        [View all →]          │
│          │  ┌──────┐ ┌──────┐ ┌──────┐              │
│          │  │ Card │ │ Card │ │ Card │              │
│          │  └──────┘ └──────┘ └──────┘              │
└──────────┴──────────────────────────────────────────┘
```

---

## 7. Component Rules

### Buttons
| Variant | Style | Use |
|---|---|---|
| Primary | `--pine` bg, white text, radius 10px, h `44px`, px `--sp-5` | The one main action on screen |
| Primary (hover) | `--pine-deep` | |
| Secondary | `--surface` bg, `--line` border, `--ink` text | Alternative actions |
| Ghost | transparent, `--pine` text | Tertiary / inline actions |
| Danger | `--danger` bg, white text | Destructive confirm |
| Icon | 40px square, ghost | Toolbar, row actions |

- Border-radius: 10px on all buttons; height 44px (touch target); icon buttons 40px.
- Focus ring: `2px` `--pine` outline + `2px` white offset (or `--amber` on dark chrome).
- Disabled: 40% opacity, no hover change.
- Text: `--t-btn`, sentence case, active voice. Buttons with icons: icon 18px, gap 8px.

### Cards
- Background `--surface`, radius `14px`, border `1px solid --line`, shadow `0 1px 2px rgba(23,38,48,0.05)`.
- Hover (interactive cards): shadow lifts to `0 8px 24px rgba(23,38,48,0.10)`, no scaling (scale reads as AI-generated).
- Card media/covers: 16:9, radius `10px`, no rounding on the card corner — media sits inside card padding.

### Forms
- Input height 44px, radius 10px, border `1px solid --line`, bg `--surface`, padding `0 --sp-4`.
- Focus: border `--pine` + ring `3px rgba(14,107,92,0.15)`.
- Labels: `--t-caption`, 500 weight, above the field, gap 6px.
- Hints: `--t-body-sm`, `--slate`, below field.
- Error state: border `--danger`, ring `3px rgba(200,69,63,0.12)`, message in `--t-body-sm` `--danger` below field, begins with a verb: "Enter a valid email" not "Invalid".
- Checkboxes/radios: 20px, `--pine` when checked.

### Badges, Chips, Tags
- Height 24px, radius 999px, padding 0 10px, `--t-caption`, 600 weight.
- Progress/active badges: `--amber` text on `--amber-soft` bg.
- Completed: `--success` text on `#E4F4EC` bg.
- Category tags: `--slate` text on `--mist` bg.

### Tables (admin)
- Header row: `--t-caption`, `--slate`, uppercase, letter-spacing 0.04em, bg `--mist`.
- Row height 52px, hover bg `#F8FAF9`, border-bottom `1px solid --line`.
- Numeric columns right-aligned in Space Grotesk.

### Navigation (left rail)
- Background `--ink`, width 220px, text `--dark-muted`, active item `--dark-text` with `3px` `--amber` left indicator.
- Item height 44px, radius 10px, icon 20px + label 16px, gap 12px.
- Brand at top: "SMIT" in Space Grotesk 600 white; search control pinned under it.

### Toasts & Modals
- Toast: bottom-center on mobile, bottom-right on desktop; `--ink` bg, `--dark-text` text, radius 12px, auto-dismiss 4s; icon color = semantic (success/danger/info).
- Modal: max-width 480px, radius 16px, `--sp-6` padding, overlay `rgba(23,38,48,0.5)` with 4px blur. Title `--t-title`, actions right-aligned, primary on right.
- Modal enters with a 160ms fade + 8px rise; overlay fades 120ms.

### Skeletons & Loaders
- Skeleton: `--mist` shimmer (base `--line` → `--mist`), radius matching the element.
- Inline button loading: spinner 16px, replaces icon, keeps label width to prevent layout shift.
- Full-page load: never a spinner; show the thread skeleton so layout doesn't jump.

---

## 8. Page-by-Page Specs

### 8.1 Auth (Login / Register / Forgot / Verify)
- **Layout:** Centered column, max-width 420px, on `--mist`. Brand mark above the card. No nav rail.
- **Hero line:** Display-1 headline stating the value of the screen: "Pick up where you left off" (login) / "Start your career at SMIT" (register).
- **Card:** `--surface`, radius 16px, `--sp-8` padding, shadow raised `0 8px 24px`.
- **Fields:** standard form rules (§7). Login: email + password + "Forgot password?" (ghost link right-aligned above submit).
- **Submit:** full-width primary, 48px tall here.
- **Social/alternative:** "Continue with Google" as secondary full-width buttons stacked under the primary, separated by "or" divider (hairline + `--t-caption`).
- **Register:** adds confirm-password, and a single consent checkbox. No progress steps — signup is one screen.
- **Errors:** inline field errors + a form-level error banner (radius 10px, `--danger`-tinted bg `#FCEBE9`, icon 20px). Message: "That email isn't registered. Check it or create an account." (includes a link to the fix).
- **UX:** After login, land on Dashboard §8.2 with the thread hero in place. No fake "success" interstitial.

### 8.2 Student Dashboard
- **Single job:** get the student to today's lesson.
- **Greeting row:** "Welcome back, Ali" (`--t-display-2`) + search field (max-width 320px) on the right.
- **Continue the Thread (hero card):** the signature moment. `--ink` background card, full content width. Contains the thread node (amber, glowing) for the current lesson, course name (`--dark-text`, Space Grotesk), lesson title, a progress thread-bar showing position, and a single **Resume** primary button. On mobile this is the *only* card above the fold.
- **Stat row:** three compact stat cards (streak days, certificates earned, hours this week) — each: Space Grotesk number + `--t-caption` label. Numbers are the character; labels stay small.
- **My Courses:** 12-col grid of course cards (§7 Card). Each card: cover, category chip, title, progress bar with % (amber fill), "Continue" ghost button. Empty state: "No courses yet — Browse the catalog" with primary CTA.
- **Recommended / Latest:** same card grid, behind "My Courses" only if it doesn't push the thread hero off-screen on mobile.
- **UX:** Everything above the fold on mobile = greeting + thread hero. Resist adding more.

### 8.3 Course Catalog
- **Single job:** help the student choose their next course.
- **Header:** Display-2 "Browse courses" + count eyebrow ("24 courses"). Filter chips row (All / Web Dev / AI / App Dev / Cloud / Freelancing) — pill chips, selected = `--pine` bg white text.
- **Search:** full-width field, max-width 480px, above chips.
- **Cards:** 3-per-row grid (4 on ≥1400px). Each card: 16:9 cover, category chip, title (`--t-title`), one-line description (`--t-body-sm`, 2-line clamp), metadata row (duration, level, students) in `--t-caption`, and "View course" link.
- **Level tag** uses the chip system: Beginner/Intermediate/Advanced.
- **Empty search result:** centered thread-emptied illustration + "No courses match 'x'" + "Clear filters" ghost button.
- **UX:** cards are full-card clickable; keyboard focus visible on card (focus ring around radius).

### 8.4 Course Detail
- **Single job:** convince and enable enrollment.
- **Top block:** two-column: left = cover (16:9, radius 14px), right = title (`--t-display-2`), category + level chips, description (`--t-body`), meta row (duration · modules · students · language), and a sticky action card.
- **Action card (sticky right, desktop):** price or "Free", primary **Enroll now** (or **Resume** if enrolled, or **Enrolled ✓** disabled if done). Below: what's included list (4 items max, check icons).
- **Curriculum — The Lesson Thread:** full-width section. Modules are the thread's segments: each module header (`--t-subtitle` + lesson count), lessons as connected thread nodes. Enrolled users see the amber active node for their current lesson; not-enrolled users see nodes dimmed with lock icons for content lessons. This is where the thread encodes true order — the sequence matters.
- **Instructor card:** avatar (40px circle), name, role, one-line bio. Small, bottom of page.
- **Enrolled state UX:** CTA becomes **Resume** → deep-links to §8.5 at the current lesson. Toast on enroll: "Enrolled in JavaScript Essentials".
- **Reviews:** optional; if absent, skip — never ship fake star clutter.

### 8.5 Lesson Player
- **Single job:** keep the student in the flow of the lesson, one step at a time.
- **Chrome:** full-bleed; left = content column, right = fixed **thread sidebar** (300px, `--mist`). Top bar: course name (caption), lesson title, timer, and "Exit" ghost. Top bar sits on `--surface` with bottom hairline.
- **Content column (max-width 720px centered):** video embed (16:9, radius 14px) or article body; for coding lessons a code block (JetBrains Mono, `--ink` bg, `--dark-text`, radius 12px, copy button). After content: **quiz** (see below) then a single **"Mark complete"** primary button.
- **Thread sidebar:** the Lesson Thread again — modules with lesson nodes. The current lesson node is amber with a glow; completed = `--success` check; locked = dimmed lock. Clicking a node navigates (completed/unlocked only). "Next lesson" is auto-highlighted.
- **Quiz:** inline card, one question at a time, options as full-width secondary buttons (selected = `--pine` border). Immediate correct/incorrect feedback with one-line explanation. Final score card with confetti only on 100% (else a quiet "Review the lesson and try again").
- **Completion flow:** "Mark complete" → node turns `--success`, thread advances to next lesson, sidebar auto-opens it, toast "Lesson complete". Keyboard: spacebar pauses video; `n` = next lesson.
- **Responsive:** below 768px the thread sidebar becomes a bottom-drawer sheet (hamburger in top bar), so the video stays the focus.

### 8.6 My Courses (Enrolled)
- **Single job:** show what's in progress and next.
- List/grid of enrolled course cards (reuse §8.2 cards) with stronger progress emphasis: progress % Space Grotesk, thread-bar, last-opened timestamp ("Last studied 2 days ago"), and **Resume** primary.
- Sorting chips: In progress / Completed / Not started.
- Empty state: "Your queue is empty" + "Browse catalog" primary CTA.

### 8.7 Progress & Achievements
- **Single job:** reward persistence, truthfully.
- **Header:** "Your journey" Display-2 + overall progress ring (amber arc on `--mist`, Space Grotesk % in center).
- **Achievements grid:** badge cards (48px icon, `--t-title` name, `--t-caption` description). Locked badges = grayscale 40% + lock icon. Earned = full color + date earned.
- **Certificates:** horizontal cards, each a mini certificate preview (PDF download primary). Empty state: "Finish a course to earn your first certificate" + link to Catalog.
- **Streak:** calendar heat-strip (last 8 weeks) — amber squares for active days, `--mist` for missed. Caption explains rule: "Study any day to keep your streak."
- **UX:** no leaderboards, no gamified pressure. This page celebrates the student's own consistency.

### 8.8 Notifications
- Bell in top bar (or nav) with count badge (`--amber` bg, `--ink` text, radius 999, min-width 18px).
- Sheet from right (360px) or page list: icon + title + message + relative time, hairline separators. Unread = `--pine` left indicator + `--surface` bg; read = `--mist`.
- "Mark all read" ghost action pinned top-right.
- Empty: "Nothing new — check back after your next lesson."

### 8.9 Profile & Settings
- **Layout:** two-column: left = avatar (80px circle), name, role, edit; right = settings sections.
- **Sections:** Account (name, email, password change — field groups per §7), Preferences (email digests toggles — switch component 44x24, `--pine` when on), Danger zone (delete account, `--danger` outline, opens confirm modal).
- **Toggles:** switch 44×24px, radius 999, thumb 20px `--surface`, on = `--pine` bg. Label left, control right.
- **UX:** every field group has a **Save changes** primary; toast on save "Saved". Profile photo accepts 1:1; shows crop preview before save.

### 8.10 Admin / Instructor
- **Admin dashboard:** stat cards (enrolled students, active courses, completion rate, revenue) + simple charts (line for enrollment, bar for completions). Chart colors: line = `--pine`, bars = `--pine` with `--amber` highlight for this month.
- **Course management:** table (§7) of courses: title, category, students, progress, status chip (Draft/Published/Archived), row actions (Edit / Duplicate / Archive).
- **Course editor:** two-column: left = form (title, category select, level, description, cover upload), right = curriculum editor — the thread becomes an *editable* tree (drag module nodes, add lesson, reorder). "Publish" primary → toast "Published".
- **Student management:** searchable table: name, email, enrolled date, completion %, status chip (Active/At risk/Completed). Row actions: View, Message (email), Suspend (confirm modal).
- **UX:** destructive actions always confirm via modal; never inline. Bulk selection via checkbox column.

---

## 9. UX Rules (Cross-cutting)

### Naming & voice
- Buttons/actions in active voice, sentence case: "Save changes", "Publish", "Resume", "Enroll now".
- One action keeps one name everywhere: "Resume" on dashboard = "Resume" on course card = "Resume" in player.
- Errors never apologize ("Sorry, something went wrong") — they diagnose: "We couldn't save your changes. Check your connection and try again."
- Label labels, example demonstrates, hint hints. Nothing does double duty.

### Empty states
- Illustration (or icon) + a reason + one next action. "No courses yet — Browse the catalog". Never a bare "No data".

### Errors & failures
- Field-level and form-level messages per §7. Network failures show a banner: "You're offline. Reconnect to continue your lesson." with retry.
- Video failure: poster + "Lesson couldn't load" + Retry (ghost) + "Report problem" (link). Progress is never lost silently — last position persists.

### Loading
- Skeletons matching layout; no spinner-only pages. Buttons keep width while loading. Never block the whole screen for a background sync.

### Motion
- Default: 150–200ms ease-out. Reveal on scroll: fade + 12px rise, staggered ≤ 60ms, only on section entry.
- Allowed: thread node glow pulse (2s, slow, subtle), progress arc fill (600ms), toast slide-in.
- Forbidden: bounce, parallax, marquees, scale-on-hover cards.
- **Mandatory:** `@media (prefers-reduced-motion: reduce)` disables all animation; everything still works.

### Accessibility
- WCAG AA contrast (§3), visible `:focus-visible` rings everywhere, 44px touch targets, semantic landmarks (nav/main/aside), full keyboard navigation, labels bound to inputs, aria-live on toasts and dynamic stats.

### Responsive breakpoints
| Width | Behavior |
|---|---|
| ≥1200px | Nav rail visible, 12-col grid, 3-4 card columns |
| 768–1199px | Nav rail collapses to 64px icon rail, 2 card columns |
| <768px | Nav becomes bottom tab bar (Home / Courses / Progress / Profile), 1 column, gutters `--sp-4`; player thread → bottom sheet |
| 360px | Minimum supported; no horizontal scroll, all type clamps respected |

### Shadows
- Default card: `0 1px 2px rgba(23,38,48,0.05)`
- Raised (modals, auth card, hover): `0 8px 24px rgba(23,38,48,0.10)`
- Overlay: `rgba(23,38,48,0.5)` + 4px blur

### Radius summary
- 6px small (chips-inline), 10px (buttons, inputs, lists), 14px (cards, covers), 16px (modals, auth), 20px (large sheets), 999px (pills, badges, toggles).

---

## 10. What NOT to do

- No warm-cream + serif + terracotta look. The palette is fixed in §3.
- No near-black page background with an acid accent. `--ink` is used as *chrome* (nav, hero card, code blocks), never as the whole-page background.
- No broadsheet hairline layouts or zero-radius "newspaper" styling. Radius system in §9 is fixed.
- No numbered markers (01/02/03) — the thread replaces fake numbering with honest sequence.
- No gradient buttons, no glow-on-everything, no animated everything. Spend the boldness in one place: the amber thread node.
- No uppercase headings, no full-justified text, no blue link underline except genuine navigation links.
