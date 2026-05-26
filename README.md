# IT342-G1 Bibera - Examies

A full-stack exam management platform with role-based flows for **students**, **teachers**, and **admins**, featuring class enrollment, exam publishing, attempt submission, analytics views, Supabase-backed authentication, and a companion Android client.

## Table of Contents
- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Architecture and Project Structure](#architecture-and-project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Frontend Routes](#frontend-routes)
- [Environment and Configuration](#environment-and-configuration)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security Notes](#security-notes)
- [Roadmap](#roadmap)
- [Team](#team)

## Project Overview

**Examies** is a web and mobile-assisted classroom assessment platform where:
- **Teachers** create classes and full exams (with nested questions and options).
- **Students** join classes using class passwords and take published exams.
- **Attempts** are stored and scored, then used for analytics/review views.
- **Authentication** is delegated to Supabase Auth while local user profile and role metadata are persisted in the backend database.

The backend follows a **vertical slice** structure by feature (`auth`, `users`, `classes`, `exams`, `attempts`) for cleaner modular ownership.

## Core Features

- Supabase-powered signup/signin/signout, with backend profile persistence.
- Role-aware user model (`STUDENT`, `TEACHER`, `ADMIN`).
- Class creation and class joining via class password.
- Exam lifecycle management:
  - Create full exam
  - Update/delete exam
  - Start/close exam
  - Query exams by teacher, class, or student
- Attempt submission with answer persistence.
- Teacher and student dashboards on web.
- Android auth + basic dashboard flow for mobile.

## Tech Stack

### Backend (`examies`)
- Java 17
- Spring Boot 3.5.x
- Spring Web, Spring Data JPA, Spring Validation
- Spring Security (CORS/auth filter configuration)
- PostgreSQL
- Maven
- Lombok
- Supabase Auth integration via REST

### Web Frontend (`IT342-Bibera-Examies`)
- React (Create React App)
- React Router
- Supabase JS client
- Sonner toast notifications
- CSS-based component styling

### Mobile (`mobile`)
- Kotlin (Android)
- Gradle (KTS)
- Volley + Retrofit/Gson
- Min SDK 24, Target SDK 34

## Architecture and Project Structure

```text
IT342-Bibera-Examies/
├── examies/                          # Spring Boot backend
│   ├── src/main/java/edu/cit/bibera/examies/
│   │   ├── common/config/
│   │   └── features/
│   │       ├── auth/                 # signup/signin/signout/me/update-profile
│   │       ├── users/                # user DTO/service/controller
│   │       ├── classes/              # class creation/listing
│   │       ├── exams/                # exams + questions/options aggregate
│   │       └── attempts/             # submissions + answers retrieval
│   ├── src/main/resources/application.properties
│   └── pom.xml
│
├── IT342-Bibera-Examies/             # React web client (CRA)
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/pages/
│   │   │   ├── users/pages/
│   │   │   ├── classes/pages/
│   │   │   ├── exams/pages/
│   │   │   ├── analytics/pages/
│   │   │   └── shared/pages/
│   │   ├── contexts/
│   │   ├── lib/
│   │   └── App.js
│   └── package.json
│
├── mobile/                           # Android app
│   ├── app/src/main/java/com/example/mobile/
│   │   ├── features/auth/
│   │   ├── features/dashboard/
│   │   └── common/{api,session}/
│   └── app/build.gradle.kts
│
├── TEST_PLAN.md
└── REGRESSION_TEST_REPORT.md
```

## Prerequisites

- Java 17+
- Maven 3.8+
- Node.js 18+ and npm
- PostgreSQL 14+ (or Supabase Postgres)
- Android Studio (optional, for mobile)

## Installation and Setup

## 1) Backend Setup (`examies`)

1. Move to backend:
   ```bash
   cd examies
   ```
2. Configure `src/main/resources/application.properties`:
   - `spring.datasource.url`
   - `spring.datasource.username`
   - `spring.datasource.password`
   - `supabase.url`
   - `supabase.anon.key`
   - `jwt.secret`, `jwt.expiration-ms`, `jwt.refresh-expiration-ms`
3. Build:
   ```bash
   mvn clean install
   ```

## 2) Web Setup (`IT342-Bibera-Examies`)

1. Move to frontend:
   ```bash
   cd IT342-Bibera-Examies
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

## 3) Mobile Setup (`mobile`, optional)

1. Open `mobile/` in Android Studio.
2. Sync Gradle and run on emulator/device.
3. If using emulator, backend URL should use `10.0.2.2` (already configured in `ApiClient`).

## Running the Application

Open separate terminals:

### Terminal A - Backend
```bash
cd examies
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.

### Terminal B - Web Frontend
```bash
cd IT342-Bibera-Examies
npm start
```
Web app runs at `http://localhost:3000`.

### Terminal C - Mobile (optional)
- Run the Android app from Android Studio.

## API Documentation

Base URL: `http://localhost:8080/api`

## Auth Endpoints

- `POST /auth/signup`
- `POST /auth/signin`
- `POST /auth/signout`
- `GET /auth/me?email={email}`
- `PUT /auth/update-profile?email={email}`

Example signup payload:

```json
{
  "email": "student@example.com",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Dela Cruz",
  "role": "STUDENT"
}
```

## Users

- `GET /users/{id}`

## Classes

- `POST /classes`
- `GET /classes/instructor/{supabaseUserId}`
- `GET /classes/student/{supabaseUserId}`
- `GET /classes/{classId}`

Example create class payload:

```json
{
  "instructorId": "supabase-user-uuid",
  "className": "IT342 - System Integration",
  "classPassword": "join-code-123"
}
```

## Enrollments

- `POST /enrollments/join`
- `GET /enrollments/class/{classId}`

Example join class payload:

```json
{
  "studentId": "supabase-user-uuid",
  "classPassword": "join-code-123"
}
```

## Exams

- `POST /exams`
- `GET /exams/teacher/{supabaseUserId}`
- `GET /exams/class/{classId}`
- `GET /exams/student/{supabaseUserId}`
- `GET /exams/{id}`
- `PUT /exams/{id}`
- `PUT /exams/start/{id}`
- `PUT /exams/close/{id}`
- `DELETE /exams/{id}`

## Attempts

- `POST /attempts` (submit attempt + answers)
- `GET /attempts/exam/{examId}`
- `GET /attempts/{attemptId}/answers`

Submit attempt payload (controller contract):

```json
{
  "attempt": {
    "studentId": 7,
    "examId": 3,
    "score": 8.0
  },
  "answers": [
    {
      "questionId": 11,
      "selectedOptionId": 41,
      "isCorrect": true
    }
  ]
}
```

## Frontend Routes

Primary routes configured in `src/App.js`:

- `/` - Auth flow
- `/student-dashboard`
- `/teacher-dashboard`
- `/create-exam`
- `/edit-exam/:id`
- `/create-class`
- `/exam/:examId`
- `/profile`
- `/admin`
- `/analytics/:classId`
- `/view-answers/:classId/:examId/:studentId/:attemptId`

## Environment and Configuration

Current repository uses direct values in configuration/source for local development. For safer setup, move secrets to environment variables.

Suggested backend env mapping:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `JWT_SECRET`
- `JWT_EXPIRATION_MS`
- `JWT_REFRESH_EXPIRATION_MS`

Suggested frontend env mapping:

- `REACT_APP_API_URL=http://localhost:8080/api`
- `REACT_APP_SUPABASE_URL=...`
- `REACT_APP_SUPABASE_ANON_KEY=...`

Suggested mobile config:

- Keep API base URL per build type/flavor (emulator vs physical device).

## Testing

### Backend
```bash
cd examies
mvn test
```

### Web
```bash
cd IT342-Bibera-Examies
npm test -- --watchAll=false
```

Existing test documentation:
- `TEST_PLAN.md`
- `REGRESSION_TEST_REPORT.md`

## Troubleshooting

- Backend not starting:
  - Check PostgreSQL/Supabase connectivity and credentials.
  - Verify port `8080` is free.
  - Run `mvn clean install` then retry.
- CORS issues in web:
  - Ensure frontend runs on `http://localhost:3000`.
  - Check CORS config in `SecurityConfig`.
- Login/signup failures:
  - Validate Supabase URL and anon key.
  - Confirm user role matches expected enum (`STUDENT`, `TEACHER`, `ADMIN`).
- Mobile cannot connect:
  - Emulator should use `10.0.2.2` instead of `localhost`.
  - Ensure backend is reachable from host network.

## Security Notes

- Do not commit production credentials, database passwords, or long-lived Supabase keys.
- Use environment variables or secret managers for all sensitive config.
- Restrict CORS origins per deployment environment.
- Harden endpoint authorization rules before production deployment.

## Roadmap

- Complete migration of remaining legacy page imports/usages.
- Add stricter endpoint authorization per role.
- Expand analytics and exam review tooling.
- Improve mobile feature parity with web dashboards.
- Add CI pipeline for backend + frontend + mobile lint/tests.

## Team

- **Course:** IT342 - System Integration and Architecture
- **Project:** Examies
- **Group:** G1
- **Developer:** Edralyn Bibera
- **Status:** In active development
