# Software Test Plan - Examies

## 1. Project Information
- Project: Examies
- Version: Post Vertical Slice Refactor
- Date: 2026-05-09
- Scope: Backend (`examies`), Web Frontend (`IT342-Bibera-Examies`), Mobile (`mobile`)

## 2. Test Objectives
- Verify all implemented functional requirements still work after vertical slice restructuring.
- Confirm module boundaries and behavior are preserved after package-level refactor.
- Ensure core flows are covered by automated and manual tests.

## 3. Refactoring Context
Backend is organized by feature slices:
- `features/auth`
- `features/users`
- `features/classes`
- `features/exams` (includes question aggregate)
- `features/attempts`
- `common/*` for cross-cutting concerns

## 4. Functional Requirements Coverage

### FR-1 Authentication and Profile
- Sign up (`POST /api/auth/signup`)
- Sign in (`POST /api/auth/signin`)
- Sign out (`POST /api/auth/signout`)
- Get current user by email (`GET /api/auth/me`)
- Update profile (`PUT /api/auth/update-profile`)

### FR-2 User Access
- Get user details (`GET /api/users/{id}`)

### FR-3 Classes and Enrollment
- Create class (`POST /api/classes`)
- Get classes by instructor (`GET /api/classes/instructor/{supabaseUserId}`)
- Get classes by student (`GET /api/classes/student/{supabaseUserId}`)
- Get class by id (`GET /api/classes/{classId}`)
- Join class (`POST /api/enrollment/join`)
- List enrollments for a class (`GET /api/enrollment/{classId}`)

### FR-4 Exams and Questions
- Create full exam (`POST /api/exams`)
- Get exams by teacher (`GET /api/exams/teacher/{supabaseUserId}`)
- Get exams by class (`GET /api/exams/class/{classId}`)
- Start exam (`PUT /api/exams/start/{id}`)
- Close exam (`PUT /api/exams/close/{id}`)
- Update exam (`PUT /api/exams/{id}`)
- Delete exam (`DELETE /api/exams/{id}`)
- Get exam by id (`GET /api/exams/{id}`)
- Get exams for student (`GET /api/exams/student/{supabaseUserId}`)

### FR-5 Attempts
- Submit attempt (`POST /api/attempts`)
- Get attempts by exam (`GET /api/attempts/exam/{examId}`)
- Get answers by attempt (`GET /api/attempts/{attemptId}/answers`)

## 5. Test Cases and Steps

### TC-AUTH-001 Sign Up
- Preconditions: Email is not yet registered.
- Steps:
  1) Send valid signup payload to `/api/auth/signup`.
  2) Verify response includes user data.
  3) Verify user record exists in DB.
- Expected: Account created and persisted.

### TC-AUTH-002 Sign In
- Preconditions: User already exists.
- Steps:
  1) Send valid credentials to `/api/auth/signin`.
  2) Verify access/refresh tokens exist.
- Expected: User authenticated successfully.

### TC-CLS-001 Create Class
- Preconditions: Teacher exists.
- Steps:
  1) Send class payload to `/api/classes`.
  2) Retrieve by instructor endpoint.
- Expected: Class appears in instructor class list.

### TC-CLS-002 Join Class
- Preconditions: Student exists, class password valid.
- Steps:
  1) Call `/api/enrollment/join`.
  2) Retrieve enrollment list for class.
- Expected: Student appears in enrollment results.

### TC-EXAM-001 Create Full Exam
- Preconditions: Class exists.
- Steps:
  1) Create exam with nested questions/options.
  2) Retrieve exam by id.
- Expected: Exam and nested question data persist.

### TC-EXAM-002 Update Exam
- Preconditions: Exam exists.
- Steps:
  1) Update metadata and questions.
  2) Read back using `GET /api/exams/{id}`.
- Expected: Latest values returned.

### TC-ATT-001 Submit Attempt
- Preconditions: Exam started for student.
- Steps:
  1) Submit attempt + answers to `/api/attempts`.
  2) Query attempts by exam.
  3) Query answers by attempt id.
- Expected: Attempt saved with computed metadata (`status`, `total`) and linked answers.

## 6. Automated Test Cases

### Backend (JUnit + Mockito)
- `ExamiesApplicationTests` (context load smoke test)
- `features.users.service.UsersServiceTest`
- `features.classes.service.ClassesServiceTest`
- `features.attempts.service.AttemptServiceTest`

### Web Frontend
- Existing CRA test entrypoint (`src/App.test.js`) and Jest setup (`src/setupTests.js`).

### Mobile
- No automated test module currently configured in repository.

## 7. Regression Execution Procedure
1. Backend
   - `cd examies`
   - `mvn test`
2. Web frontend
   - `cd IT342-Bibera-Examies`
   - `npm test -- --watchAll=false`
3. Mobile (manual)
   - Build + run app module in Android Studio and execute core auth/dashboard flows.

## 8. Entry/Exit Criteria
- Entry:
  - Refactor branch builds.
  - DB/schema available for runtime checks.
- Exit:
  - No critical/major regression in core flows.
  - Automated suite passes for backend and frontend.
  - Manual checks completed for remaining flows.
