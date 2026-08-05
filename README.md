# 🎓 Bootcamp Management LMS

A production-ready **Admin-Based Bootcamp Management Learning Management System** for the SMIT bootcamp. Admin dashboard to manage **students, attendance, teams, projects, and tasks** — backed by a REST API with JWT authentication.

This document is the project's single source of truth: it covers the **team structure, member division, branching flow, workflow, setup, and pointers to the full docs**.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Team Structure & Division](#team-structure--division)
- [Branching Strategy](#branching-strategy)
- [Workflow (The Flow)](#workflow-the-flow)
- [CI / CD](#ci--cd)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Design System](#design-system)
- [QA & Testing](#qa--testing)
- [Documentation](#documentation)

---

## Project Overview

| Item | Detail |
| --- | --- |
| **Product** | Admin-based LMS for bootcamp management |
| **Architecture** | Monorepo: Node.js/Express backend (current) + React frontend (in progress) |
| **Auth** | JWT-based admin authentication with role authorization (`admin` / `super-admin`) |
| **Modules** | Auth, Students, Attendance, Teams, Projects, Tasks, Dashboard |
| **Deployments** | `main` = production · `dev` = preview (Vercel) |

### Core features

- Admin JWT login + protected routes + role-based authorization
- Clean MVC architecture: `controllers` / `services` / `models` / `routes` / `validators` / `middlewares`
- Global error handler with a consistent `{ success, message, data }` response shape
- Pagination, search, and filtering on all list endpoints
- Populated relationships via Mongoose `ObjectId` references
- Enforced business rules (unique team names, one team per student, one active project per team, one attendance record per student per day)
- Seed script with realistic sample data

---

## Tech Stack

**Backend**

- **Node.js** + **Express.js** — REST API
- **MongoDB** + **Mongoose** — ODM
- **JWT** — stateless authentication
- **express-validator** — input validation
- **bcryptjs** — password hashing
- **nodemon** — development hot reload

**Frontend (in progress)**

- **React** + **Vite** + **Tailwind CSS** — planned per `design.md`

**DevOps**

- **GitHub Actions** — CI (syntax checks + server boot + frontend build)
- **Vercel** — preview & production deployments
- **Playwright** — planned E2E testing (as used in the `project-1` stack)

---

## Team Structure & Division

The team is split into **frontend**, **backend**, and **leadership**. Each member owns one branch and one scope. **Members PR into `dev`; the team lead merges.**

| Member | Branch | Role / Scope | Module Breakdown |
| --- | --- | --- | --- |
| **Qazi Farhan Ahmad** | `main` (lead) | Team Lead · QA · DevOps | Project management, architecture, DB design, code/PR reviews, merging, integration, bug fixing, deployment, shared config |
| **Abdullah** | `feat/abdullah` | Frontend — Auth & Dashboard | Login page, dashboard, sidebar, navbar, dashboard cards & overview, logout, protected routes, connect login API, connect dashboard summary API |
| **Shahzad** | `feat/shahzad` | Frontend — Management UI | Students (list/add/edit/details/search), Attendance (list/mark/history/filters), Teams (list/details), Tasks (list/create/edit/delete/history) |
| **Hakimullah** | `feat/hakimullah` | Backend — Auth, Students, Attendance | Admin login API, JWT, auth middleware, Student CRUD/search/details, Attendance mark/edit/history/summary + daily/weekly/monthly filters |
| **Shafqatullah** | `feat/shafqatUllah` | Backend — Teams, Projects, Tasks, Dashboard | Team CRUD/details, Project assign/update-status, Task CRUD/change-status/history/filters, Dashboard totals (students, present/absent today, teams, pending tasks) |

> **⚠️ Current status:** The backend (auth/teams/projects/tasks/attendance/dashboard) is implemented by Shafqatullah and merged into `dev`. **Student CRUD endpoints and the frontend are still pending** — see [QA & Testing](#qa--testing).

---

## Branching Strategy

```
┌─────────────────────────────────────────────────────────────┐
│  main (production)                                          │
│    ▲ only via PR from dev, when dev is stable               │
│    │                                                        │
│  dev (integration / preview on Vercel)                      │
│    ▲ ▲ ▲ ▲                                                  │
│    │ │ │ │                                                  │
│  feat/abdullah  feat/shahzad  feat/hakimullah  feat/shafqatUllah
│     ▲              ▲              ▲              ▲           │
│     └── members branch OFF dev, PR BACK INTO dev            │
└─────────────────────────────────────────────────────────────┘
```

### Branch rules

| Branch | Purpose | Who pushes |
| --- | --- | --- |
| `main` | **Production.** Only merged from `dev` when stable. | Team Lead |
| `dev` | **Integration / preview.** All feature work merges here. | Team Lead |
| `feat/<name>` | One branch per member. Branch off `dev`, PR into `dev`. | Members |

- **No direct pushes to `main` or `dev`** — every change arrives via pull request.
- Members branch off the latest `dev`, never off `main` or another member's branch.
- Branch protection on `dev` + `main`: CI checks required, force-push/delete blocked.
- `main` additionally requires **linear history** (squash merges only).

---

## Workflow (The Flow)

### 1. Member daily workflow

```bash
# start from latest dev
git checkout dev
git pull origin dev

# create your own feature branch
git checkout -b feat/your-name

# work in small commits
git add <files>
git commit -m "feat: add login page UI"

# sync with dev before pushing
git checkout feat/your-name
git pull origin dev

# push & open PR into dev
git push -u origin feat/your-name
```

Open the PR on GitHub → **base: `dev`** ← compare: `feat/your-name`.

### 2. Team Lead merge workflow (QA + DevOps)

1. Member opens PR → Vercel preview builds → **QA first on the preview**.
2. **CI runs automatically**: `backend-syntax` + `backend-boot` (+ `frontend-build` when a frontend exists).
3. If conflicts: member resolves in their branch (`git pull origin dev`, fix, push). Lead does not resolve member code.
4. When checks pass → **team lead merges into `dev`**.
5. Merge branch deleted after merge.
6. When `dev` is stable → **PR `dev` → `main`** (squash) → production deploy.

### 3. Conflict resolution

```bash
git checkout feat/your-name
git pull origin dev            # conflicts appear here
```

Fix `<<<<<<< ======= >>>>>>>` blocks, then:

```bash
git add <resolved-files>
git commit -m "chore: resolve merge conflicts with dev"
git push
```

**Decision rules:** different files → auto-merge; same feature both sides → ask the lead which to keep; shared structure → `dev`'s version wins for the shell, keep newer content.

---

## CI / CD

### GitHub Actions (`.github/workflows/ci.yml`)

| Job | What it does |
| --- | --- |
| `backend-syntax` | `node --check` on every JS file (skips if no `package.json`) |
| `backend-boot` | Seeds MongoDB (service container) + boots server + hits `/api/health` |
| `frontend-build` | Runs `npm ci` + `npm run build` when `frontend/` exists |

All three are **required checks** on `dev` and `main`. Jobs skip gracefully until the backend/frontend actually land.

### Deployments

- **`dev`** → Vercel preview (test every PR here before merging)
- **`main`** → Vercel production

---

## Project Structure

```
.
├── .github/workflows/ci.yml   # CI pipeline
├── config/                    # env config, DB connection, seed data
│   ├── index.js
│   ├── db.js
│   └── seed.js
├── controllers/               # HTTP request handlers
├── middlewares/               # auth (JWT), authorize (roles), validate, errors
├── models/                    # Mongoose schemas
├── routes/                    # Express routers (auth/teams/projects/tasks/attendance/dashboard)
├── services/                  # business logic layer
├── utils/                     # apiError, apiResponse, catchAsync, jwt, pagination
├── validators/                # express-validator chains
├── docs/
│   └── API_REFERENCE.md       # full API documentation
├── app.js                     # Express app
├── server.js                  # entry point
├── .env.example
├── design.md                  # UI/UX design system (all pages)
├── CONTRIBUTING.md            # team contribution rules
└── QA_SMOKE_TEST.md           # QA smoke-test checklist
```

---

## Getting Started

```bash
# 1. clone
git clone https://github.com/Qaziaaaa/bootcamp-team-branches-practice.git
cd bootcamp-team-branches-practice

# 2. backend
cd <repo root>
npm install

# 3. env
cp .env.example .env          # set MONGO_URI + JWT_SECRET

# 4. seed sample data (optional but recommended)
npm run seed

# 5. run
npm run dev                   # development (nodemon)
npm start                     # production
```

Server runs on `http://localhost:5000` → health check: `GET /api/health`.

### Seed credentials

| Field | Value |
| --- | --- |
| email | `admin@bootcamp.com` |
| password | `admin123` |
| role | `super-admin` |

---

## Environment Variables

| Variable | Description | Default |
| --- | --- | --- |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/bootcamp_lms` |
| `JWT_SECRET` | Secret used to sign tokens | `bootcamp_lms_secret` |
| `JWT_EXPIRES_IN` | Token lifetime | `7d` |
| `NODE_ENV` | `development` / `production` | `development` |

> Never commit a real `.env`. Use `.env.example` as the template.

---

## Design System

Every UI page follows the rules in **`design.md`** — colors, spacing, fonts, per-page styles, and UX rules for all screens:

- **Auth** (login / register / forgot / verify)
- **Student dashboard** (continue-the-thread hero, stats, my courses)
- **Course catalog** & **course detail**
- **Lesson player** (thread sidebar, quiz, completion)
- **My courses**, **progress & achievements**, **notifications**, **profile/settings**
- **Admin / instructor** screens

Key tokens: pine green `#0E6B5C` (primary), amber `#F0A41E` (signature accent), mist `#F4F6F5` (background). Fonts: **Space Grotesk** (display) + **Inter** (body) + **JetBrains Mono** (code).

Frontend members (Abdullah, Shahzad) must follow `design.md` for every screen they build.

---

## QA & Testing

See **`QA_SMOKE_TEST.md`** for the full smoke-test checklist. It covers:

- Setup & seed data
- Auth, Teams, Projects, Tasks, Attendance, Dashboard test cases
- Authorization matrix (401/403 negative tests)
- Response-format contract verification
- Known gaps & open items

**Known gaps (open):**

- [ ] Student CRUD routes missing (assigned to Hakimullah on `feat/hakimullah`)
- [ ] Frontend not yet built (Abdullah, Shahzad)
- [ ] Automated test suite not yet added (Supertest + Jest recommended)

---

## Documentation

| Doc | Purpose |
| --- | --- |
| [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) | Full REST API reference (auth, teams, projects, tasks, attendance, dashboard) with request/response examples |
| [`CONTRIBUTING.md`](CONTRIBUTING.md) | Branch model, daily workflow, conflict resolution, PR checklist, merge policy |
| [`design.md`](design.md) | UI/UX design system — spacing, fonts, colors, every page's styles & UX |
| [`QA_SMOKE_TEST.md`](QA_SMOKE_TEST.md) | QA smoke-test checklist for backend PRs |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | CI pipeline definition |

---

## License

MIT
