# QA Smoke-Test Checklist — Bootcamp Management LMS

Owner: Qazi Farhan Ahmad (Team Lead / QA)

This checklist validates the backend against the API contract in `README.md`. Run it on every PR that touches the backend before merging into `dev`.

## Setup

```bash
npm install
cp .env.example .env            # set MONGO_URI + JWT_SECRET
npm run seed                    # resets DB with sample data
npm run dev                     # server on http://localhost:5000
```

Seed credentials:

| Field | Value |
| --- | --- |
| email | `admin@bootcamp.com` |
| password | `admin123` |
| role | `super-admin` |

## 1. Auth

| # | Test | Method/Path | Expected |
| --- | --- | --- | --- |
| A1 | Login with valid credentials | `POST /api/auth/login` | `200`, `success:true`, token + admin object |
| A2 | Login with wrong password | `POST /api/auth/login` | `401`, `success:false` |
| A3 | Login with missing fields | `POST /api/auth/login` | `400`, validation errors |
| A4 | Get profile with valid token | `GET /api/auth/me` | `200`, admin profile |
| A5 | Get profile with no token | `GET /api/auth/me` | `401` |
| A6 | Get profile with garbage token | `GET /api/auth/me` | `401` |
| A7 | Health check | `GET /api/health` | `200`, `success:true` (no token needed) |

## 2. Teams

| # | Test | Method/Path | Expected |
| --- | --- | --- | --- |
| T1 | Create team | `POST /api/teams` | `201`, unique name |
| T2 | Create team with duplicate name | `POST /api/teams` | `400`, "Team name must be unique" |
| T3 | Student already in another team | `POST /api/teams` | `400`, student-not-in-multiple-teams rule |
| T4 | List teams | `GET /api/teams` | `200`, items + pagination |
| T5 | Search teams | `GET /api/teams?search=Alpha` | only matching names |
| T6 | Team details | `GET /api/teams/:id` | members populated + project |
| T7 | Update team | `PUT /api/teams/:id` | rename / replace members |
| T8 | Delete team | `DELETE /api/teams/:id` | members' `team` nulled, project deactivated |
| T9 | Access without token | any team route | `401` |

## 3. Projects

| # | Test | Method/Path | Expected |
| --- | --- | --- | --- |
| P1 | Assign project | `POST /api/projects` | `201`, isActive true |
| P2 | Assign 2nd active project to same team | `POST /api/projects` | `400`, one-active-project rule |
| P3 | Update status → Completed | `PATCH /api/projects/:id/status` | `isActive:false`, team freed |
| P4 | Update status with invalid value | `PATCH /api/projects/:id/status` | `400` |

## 4. Tasks

| # | Test | Method/Path | Expected |
| --- | --- | --- | --- |
| K1 | Create task | `POST /api/tasks` | `201` |
| K2 | Update task | `PUT /api/tasks/:id` | fields updated |
| K3 | Change status | `PATCH /api/tasks/:id/status` | status updated |
| K4 | Delete task | `DELETE /api/tasks/:id` | `200` |
| K5 | Student task history | `GET /api/tasks/history/:studentId` | daily/weekly/monthly + summary |
| K6 | Filter tasks | `GET /api/tasks?status=Pending&date=2026-08-05` | filtered list |
| K7 | Pagination limit | `GET /api/tasks?limit=2` | max 100 enforced, metadata present |

## 5. Attendance

| # | Test | Method/Path | Expected |
| --- | --- | --- | --- |
| D1 | Mark attendance | `POST /api/attendance` | `201` |
| D2 | Mark attendance same student/day twice | `POST /api/attendance` | upsert — still one record, no duplicate |
| D3 | List attendance | `GET /api/attendance?date=...` | filtered records |
| D4 | Student attendance history | `GET /api/attendance/student/:id` | records + summary counts |

## 6. Dashboard

| # | Test | Method/Path | Expected |
| --- | --- | --- | --- |
| S1 | Get stats | `GET /api/dashboard` | counts match seeded DB (6 students, 2 teams, 1 active project, etc.) |

## 7. Authorization matrix (negative tests)

| # | Test | Expected |
| --- | --- | --- |
| Z1 | Every route with valid token but wrong role | `403` (authorize middleware) |
| Z2 | Every route with no token | `401` |
| Z3 | Non-existent route | `404` with standard error shape |

## 8. Response format contract

Every response must match the standard shape — verify on 3+ random endpoints:

- Success: `{ "success": true, "message": "...", "data": {...} }`
- Error: `{ "success": false, "message": "...", "errors": [...] }`
- List endpoints return `data.pagination = { page, limit, total, pages }`

## 9. Known gaps / open items

- [ ] **Student CRUD APIs missing** — assignment gives these to Hakimullah (`feat/hakimullah`), but no `/students` routes exist in the current backend. Must be added before "complete".
- [ ] No automated test suite yet — CI currently runs syntax checks only. Backend needs a test framework (recommend Supertest + Jest) as a follow-up.
- [ ] Seed data sanity: dashboard counts depend on `npm run seed` being re-run on a clean DB.

## How to report

Open an issue or comment on the PR with: environment, test #, actual result, expected result, steps to reproduce. Severity: `BLOCKER` (must fix before merge) / `MINOR` (fix in follow-up) / `NICE-TO-HAVE`.
