# Bootcamp Management LMS - Backend API

Production-ready REST API for an Admin-Based Bootcamp Management LMS built with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and **JWT Authentication**.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Authentication](#authentication)
- [Response Format](#response-format)
- [Error Format](#error-format)
- [API Reference](#api-reference)
  - [Auth APIs](#auth-apis)
  - [Team APIs](#team-apis)
  - [Project APIs](#project-apis)
  - [Task APIs](#task-apis)
  - [Attendance APIs](#attendance-apis)
  - [Dashboard APIs](#dashboard-apis)
- [Business Rules](#business-rules)
- [Pagination & Filtering](#pagination--filtering)

---

## Tech Stack

- **Node.js** + **Express.js** (REST API)
- **MongoDB** + **Mongoose** (ODM)
- **JWT** for stateless authentication
- **express-validator** for input validation
- **bcryptjs** for password hashing

## Features

- Admin JWT login + protected routes + role authorization middleware
- Clean MVC architecture: `controllers` / `services` / `models` / `routes` / `validators` / `middlewares` / `utils`
- Global error handler with consistent error response shape
- Async/Await + centralized `catchAsync` wrapper (no try/catch in controllers)
- Pagination, search, and filtering on list endpoints
- Populated relationships via Mongoose `ObjectId` refs
- Business rules enforced (unique team names, one team per student, one active project per team)
- Seed script for sample data

## Folder Structure

```
Γö£ΓöÇΓöÇ config/
Γöé   Γö£ΓöÇΓöÇ index.js              # Environment config
Γöé   Γö£ΓöÇΓöÇ db.js                 # Mongoose connection
Γöé   ΓööΓöÇΓöÇ seed.js               # Sample data seeder
Γö£ΓöÇΓöÇ controllers/              # HTTP request handlers
Γöé   Γö£ΓöÇΓöÇ authController.js
Γöé   Γö£ΓöÇΓöÇ teamController.js
Γöé   Γö£ΓöÇΓöÇ projectController.js
Γöé   Γö£ΓöÇΓöÇ taskController.js
Γöé   Γö£ΓöÇΓöÇ attendanceController.js
Γöé   ΓööΓöÇΓöÇ dashboardController.js
Γö£ΓöÇΓöÇ middlewares/
Γöé   Γö£ΓöÇΓöÇ auth.js               # JWT protect middleware
Γöé   Γö£ΓöÇΓöÇ authorize.js          # Role-based authorization
Γöé   Γö£ΓöÇΓöÇ validate.js           # express-validator result handler
Γöé   Γö£ΓöÇΓöÇ errorHandler.js       # Global error handler
Γöé   ΓööΓöÇΓöÇ notFound.js           # 404 handler
Γö£ΓöÇΓöÇ models/                   # Mongoose schemas
Γöé   Γö£ΓöÇΓöÇ adminModel.js
Γöé   Γö£ΓöÇΓöÇ studentModel.js
Γöé   Γö£ΓöÇΓöÇ teamModel.js
Γöé   Γö£ΓöÇΓöÇ projectModel.js
Γöé   Γö£ΓöÇΓöÇ taskModel.js
Γöé   ΓööΓöÇΓöÇ attendanceModel.js
Γö£ΓöÇΓöÇ routes/                   # Express routers
Γö£ΓöÇΓöÇ services/                 # Business logic layer
Γö£ΓöÇΓöÇ utils/                    # apiError, apiResponse, catchAsync, jwt, pagination
Γö£ΓöÇΓöÇ validators/               # express-validator chains
Γö£ΓöÇΓöÇ app.js                    # Express app
Γö£ΓöÇΓöÇ server.js                 # Entry point
ΓööΓöÇΓöÇ .env.example
```

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (see below) and adjust MONGO_URI
cp .env.example .env

# 3. Seed sample data (optional)
npm run seed

# 4. Start the server
npm run dev          # development (nodemon)
npm start            # production
```

## Environment Variables

| Variable          | Description                         | Default                              |
| ----------------- | ----------------------------------- | ------------------------------------ |
| `PORT`            | Server port                         | `5000`                               |
| `MONGO_URI`       | MongoDB connection string           | `mongodb://127.0.0.1:27017/bootcamp_lms` |
| `JWT_SECRET`      | Secret used to sign tokens          | `bootcamp_lms_secret`                |
| `JWT_EXPIRES_IN`  | Token lifetime (e.g. `7d`, `1h`)    | `7d`                                 |
| `NODE_ENV`        | `development` / `production`        | `development`                        |

## Authentication

All routes (except `POST /api/auth/login` and `GET /api/health`) require a Bearer token:

```
Authorization: Bearer <JWT_TOKEN>
```

### Get a token

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bootcamp.com","password":"admin123"}'
```

The `Authorization` middleware (`middlewares/authorize.js`) restricts routes to `admin` / `super-admin` roles.

## Response Format

Every successful response uses the standard shape:

```json
{
  "success": true,
  "message": "Team created successfully",
  "data": {}
}
```

## Error Format

Every error response uses the standard shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": []
}
```

---

## API Reference

Base URL: `http://localhost:5000/api`

### Auth APIs

#### 1. Admin Login
```
POST /api/auth/login
```
Protected: No

**Request Body**

| Field      | Type   | Required | Description        |
| ---------- | ------ | -------- | ------------------ |
| `email`    | string | Yes      | Admin email        |
| `password` | string | Yes      | Admin password     |

**Sample Request**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@bootcamp.com","password":"admin123"}'
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2...",
    "admin": {
      "id": "66a1b2c3d4e5f6a7b8c9d0e1",
      "name": "Super Admin",
      "email": "admin@bootcamp.com",
      "role": "super-admin"
    }
  }
}
```

#### 2. Current Admin Profile
```
GET /api/auth/me
```
Protected: Yes

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Admin profile fetched successfully",
  "data": {
    "admin": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0e1",
      "name": "Super Admin",
      "email": "admin@bootcamp.com",
      "role": "super-admin",
      "isActive": true,
      "createdAt": "2026-08-01T10:00:00.000Z"
    }
  }
}
```

---

### Team APIs

#### 1. Create Team
```
POST /api/teams
```
Protected: Yes

**Request Body**

| Field      | Type   | Required | Description                          |
| ---------- | ------ | -------- | ------------------------------------ |
| `teamName` | string | Yes      | Unique team name                     |
| `members`  | array  | No       | Array of Student ObjectIds           |

**Rules**
- Team name must be unique.
- A student cannot belong to multiple teams.

**Sample Request**
```bash
curl -X POST http://localhost:5000/api/teams \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Team Alpha","members":["66a1b2c3d4e5f6a7b8c9d0e1","66a1b2c3d4e5f6a7b8c9d0e2"]}'
```

**Sample Response (201)**
```json
{
  "success": true,
  "message": "Team created successfully",
  "data": {
    "team": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0e5",
      "teamName": "Team Alpha",
      "members": [
        { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan", "email": "ali@bootcamp.com" }
      ],
      "project": null,
      "createdAt": "2026-08-05T12:00:00.000Z"
    }
  }
}
```

**Error Sample (400 - duplicate name)**
```json
{
  "success": false,
  "message": "Team name must be unique",
  "errors": ["Team name already exists"]
}
```

#### 2. List Teams (with pagination & search)
```
GET /api/teams?page=1&limit=10&search=Alpha
```
Protected: Yes

**Query Parameters**

| Parameter | Type   | Description               |
| --------- | ------ | ------------------------- |
| `page`    | number | Page number (default 1)   |
| `limit`   | number | Items per page (max 100)  |
| `search`  | string | Search team name (regex)  |

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Teams fetched successfully",
  "data": {
    "items": [
      {
        "_id": "66a1b2c3d4e5f6a7b8c9d0e5",
        "teamName": "Team Alpha",
        "members": [],
        "project": null
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 }
  }
}
```

#### 3. Update Team
```
PUT /api/teams/:id
```
Protected: Yes

**Request Body** (all optional)

| Field      | Type   | Description                    |
| ---------- | ------ | ------------------------------ |
| `teamName` | string | New team name (must be unique) |
| `members`  | array  | Full replacement member list   |

Adding/removing members automatically syncs each student's `team` reference.

**Sample Request**
```bash
curl -X PUT http://localhost:5000/api/teams/66a1b2c3d4e5f6a7b8c9d0e5 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Team Alpha Pro","members":["66a1b2c3d4e5f6a7b8c9d0e1"]}'
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Team updated successfully",
  "data": { "team": { "_id": "66a1b2c3d4e5f6a7b8c9d0e5", "teamName": "Team Alpha Pro", "members": [], "project": null } }
}
```

#### 4. Delete Team
```
DELETE /api/teams/:id
```
Protected: Yes

**Rules**
- Removes the team.
- Updates all member students so their `team` becomes `null`.
- Deactivates the team's active project.

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Team deleted successfully",
  "data": { "id": "66a1b2c3d4e5f6a7b8c9d0e5", "teamName": "Team Alpha Pro" }
}
```

#### 5. Team Details
```
GET /api/teams/:id
```
Protected: Yes

Populates team members and the assigned project.

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Team details fetched successfully",
  "data": {
    "teamName": "Team Alpha",
    "totalMembers": 2,
    "members": [
      { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan", "email": "ali@bootcamp.com" }
    ],
    "project": {
      "projectName": "E-Commerce Platform",
      "description": "Full stack e-commerce application",
      "deadline": "2026-09-04T00:00:00.000Z",
      "status": "In Progress"
    },
    "projectStatus": "In Progress"
  }
}
```

---

### Project APIs

#### 1. Assign Project
```
POST /api/projects
```
Protected: Yes

**Request Body**

| Field         | Type   | Required | Description                        |
| ------------- | ------ | -------- | ---------------------------------- |
| `teamId`      | string | Yes      | Team ObjectId                      |
| `projectName` | string | Yes      | Project name                       |
| `description` | string | No       | Project description                |
| `deadline`    | date   | Yes      | ISO date (YYYY-MM-DD)              |
| `status`      | string | No       | `Not Started` / `In Progress` / `Completed` (default `Not Started`) |

**Rules**
- One team can have only one **active** project.

**Sample Request**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"teamId":"66a1b2c3d4e5f6a7b8c9d0e5","projectName":"E-Commerce Platform","description":"Full stack app","deadline":"2026-09-04","status":"In Progress"}'
```

**Sample Response (201)**
```json
{
  "success": true,
  "message": "Project assigned successfully",
  "data": {
    "project": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0e8",
      "team": { "_id": "66a1b2c3d4e5f6a7b8c9d0e5", "teamName": "Team Alpha" },
      "projectName": "E-Commerce Platform",
      "description": "Full stack app",
      "deadline": "2026-09-04T00:00:00.000Z",
      "status": "In Progress",
      "isActive": true
    }
  }
}
```

**Error Sample (400 - already has active project)**
```json
{
  "success": false,
  "message": "One team can have only one active project",
  "errors": ["Team already has an active project: E-Commerce Platform"]
}
```

#### 2. Update Project Status
```
PATCH /api/projects/:id/status
```
Protected: Yes

**Request Body**

| Field    | Type   | Required | Description                                                                 |
| -------- | ------ | -------- | --------------------------------------------------------------------------- |
| `status` | string | Yes      | One of: `Not Started`, `In Progress`, `Completed`                            |

When set to `Completed`, the project is deactivated (frees the team for a new project).

**Sample Request**
```bash
curl -X PATCH http://localhost:5000/api/projects/66a1b2c3d4e5f6a7b8c9d0e8/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Project status updated successfully",
  "data": {
    "project": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0e8",
      "team": { "_id": "66a1b2c3d4e5f6a7b8c9d0e5", "teamName": "Team Alpha" },
      "projectName": "E-Commerce Platform",
      "status": "Completed",
      "isActive": false
    }
  }
}
```

---

### Task APIs

#### 1. Create Task
```
POST /api/tasks
```
Protected: Yes

**Request Body**

| Field         | Type   | Required | Description                                    |
| ------------- | ------ | -------- | ---------------------------------------------- |
| `studentId`   | string | Yes      | Student ObjectId                               |
| `title`       | string | Yes      | Task title                                     |
| `description` | string | No       | Task description                               |
| `dueDate`     | date   | Yes      | ISO date (YYYY-MM-DD)                          |
| `status`      | string | No       | `Pending` / `In Progress` / `Completed` (default `Pending`) |

**Sample Request**
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"66a1b2c3d4e5f6a7b8c9d0e1","title":"Design landing page","description":"Create responsive mockup","dueDate":"2026-08-07","status":"Pending"}'
```

**Sample Response (201)**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "task": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0e9",
      "student": { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan", "email": "ali@bootcamp.com" },
      "title": "Design landing page",
      "description": "Create responsive mockup",
      "dueDate": "2026-08-07T00:00:00.000Z",
      "status": "Pending"
    }
  }
}
```

#### 2. Update Task
```
PUT /api/tasks/:id
```
Protected: Yes

Allows updating: `title`, `description`, `dueDate`, `status`.

**Sample Request**
```bash
curl -X PUT http://localhost:5000/api/tasks/66a1b2c3d4e5f6a7b8c9d0e9 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Design landing page v2","status":"In Progress"}'
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "task": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0e9",
      "student": { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan" },
      "title": "Design landing page v2",
      "status": "In Progress"
    }
  }
}
```

#### 3. Change Task Status
```
PATCH /api/tasks/:id/status
```
Protected: Yes

**Request Body**

| Field    | Type   | Required | Description                                   |
| -------- | ------ | -------- | --------------------------------------------- |
| `status` | string | Yes      | `Pending` / `In Progress` / `Completed`       |

**Sample Request**
```bash
curl -X PATCH http://localhost:5000/api/tasks/66a1b2c3d4e5f6a7b8c9d0e9/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"Completed"}'
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Task status updated successfully",
  "data": {
    "task": { "_id": "66a1b2c3d4e5f6a7b8c9d0e9", "status": "Completed" }
  }
}
```

#### 4. Delete Task
```
DELETE /api/tasks/:id
```
Protected: Yes

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Task deleted successfully",
  "data": { "id": "66a1b2c3d4e5f6a7b8c9d0e9" }
}
```

#### 5. Student Task History
```
GET /api/tasks/history/:studentId
```
Protected: Yes

Returns Daily, Weekly, and Monthly tasks plus a summary.

**Sample Request**
```bash
curl http://localhost:5000/api/tasks/history/66a1b2c3d4e5f6a7b8c9d0e1 \
  -H "Authorization: Bearer <TOKEN>"
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Task history fetched successfully",
  "data": {
    "dailyTasks": [],
    "weeklyTasks": [],
    "monthlyTasks": [
      {
        "_id": "66a1b2c3d4e5f6a7b8c9d0e9",
        "student": { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan" },
        "title": "Design landing page",
        "dueDate": "2026-08-07T00:00:00.000Z",
        "status": "Pending"
      }
    ],
    "summary": {
      "totalTasks": 3,
      "completed": 1,
      "pending": 1,
      "inProgress": 1
    }
  }
}
```

#### 6. Task Filters (List with Query Parameters)
```
GET /api/tasks?studentId=123&status=Pending&date=2026-08-05&page=1&limit=10
```
Protected: Yes

**Query Parameters**

| Parameter   | Type   | Description                                        |
| ----------- | ------ | -------------------------------------------------- |
| `studentId` | string | Filter by student                                  |
| `status`    | string | `Pending` / `In Progress` / `Completed`            |
| `date`      | date   | Filter by due date, format `YYYY-MM-DD`            |
| `search`    | string | Search task titles                                 |
| `page`      | number | Page number (default 1)                            |
| `limit`     | number | Items per page (max 100)                           |

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "items": [
      {
        "_id": "66a1b2c3d4e5f6a7b8c9d0e9",
        "student": { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan" },
        "title": "Design landing page",
        "dueDate": "2026-08-07T00:00:00.000Z",
        "status": "Pending",
        "createdAt": "2026-08-05T12:00:00.000Z"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 }
  }
}
```

---

### Attendance APIs

#### 1. Mark Attendance
```
POST /api/attendance
```
Protected: Yes

**Request Body**

| Field       | Type   | Required | Description                                    |
| ----------- | ------ | -------- | ---------------------------------------------- |
| `studentId` | string | Yes      | Student ObjectId                               |
| `date`      | date   | No       | Defaults to today (`YYYY-MM-DD`)               |
| `status`    | string | No       | `Present` / `Absent` / `Late` (default `Present`) |

Marks attendance for a student for a given date (upsert ΓÇö one record per student per day).

**Sample Request**
```bash
curl -X POST http://localhost:5000/api/attendance \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"studentId":"66a1b2c3d4e5f6a7b8c9d0e1","date":"2026-08-05","status":"Present"}'
```

**Sample Response (201)**
```json
{
  "success": true,
  "message": "Attendance marked successfully",
  "data": {
    "attendance": {
      "_id": "66a1b2c3d4e5f6a7b8c9d0f1",
      "student": "66a1b2c3d4e5f6a7b8c9d0e1",
      "date": "2026-08-05T00:00:00.000Z",
      "status": "Present"
    }
  }
}
```

#### 2. List Attendance Records
```
GET /api/attendance?date=2026-08-05&status=Present&page=1&limit=10
```
Protected: Yes

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Attendance records fetched successfully",
  "data": {
    "items": [
      {
        "_id": "66a1b2c3d4e5f6a7b8c9d0f1",
        "student": { "_id": "66a1b2c3d4e5f6a7b8c9d0e1", "name": "Ali Khan" },
        "date": "2026-08-05T00:00:00.000Z",
        "status": "Present"
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 1, "pages": 1 }
  }
}
```

#### 3. Student Attendance History
```
GET /api/attendance/student/:studentId
```
Protected: Yes

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Student attendance fetched successfully",
  "data": {
    "records": [],
    "summary": { "total": 0, "present": 0, "absent": 0, "late": 0 }
  }
}
```

---

### Dashboard APIs

#### 1. Get Dashboard Stats
```
GET /api/dashboard
```
Protected: Yes

All counts are computed dynamically from MongoDB.

**Sample Request**
```bash
curl http://localhost:5000/api/dashboard -H "Authorization: Bearer <TOKEN>"
```

**Sample Response (200)**
```json
{
  "success": true,
  "message": "Dashboard data fetched successfully",
  "data": {
    "totalStudents": 6,
    "presentToday": 4,
    "absentToday": 1,
    "totalTeams": 2,
    "pendingTasks": 2,
    "activeProjects": 1
  }
}
```

---

## Business Rules

| Rule                                     | Enforced In                  |
| ---------------------------------------- | ---------------------------- |
| Team name must be unique                 | `services/teamService.js`    |
| A student can belong to only one team    | `services/teamService.js`    |
| One team can have only one active project | `services/projectService.js` |
| Deleting a team nulls members' `team` ref | `services/teamService.js`    |
| Completing a project deactivates it      | `services/projectService.js` |
| One attendance record per student per day | `models/attendanceModel.js`  |

## Pagination & Filtering

- List endpoints: `GET /api/teams`, `GET /api/tasks`, `GET /api/attendance`
- Supported params: `page`, `limit` (max 100), `search`, plus resource-specific filters
- Pagination metadata returned as `data.pagination`:
  ```json
  { "page": 1, "limit": 10, "total": 25, "pages": 3 }
  ```

## HTTP Status Codes

| Code | Meaning                                     |
| ---- | ------------------------------------------- |
| 200  | Success                                     |
| 201  | Resource created                            |
| 400  | Validation error / bad request              |
| 401  | Unauthorized (missing/invalid token)        |
| 403  | Forbidden (insufficient role)               |
| 404  | Resource or route not found                 |
| 500  | Internal server error                       |
