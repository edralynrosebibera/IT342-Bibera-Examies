# Software Test Plan - Examies

## 1. Project Information
- Project: Examies
- Version: Post Vertical Slice Refactor
- Date: 2026-05-09
- Scope:
  - Backend (`examies`)
  - Web Frontend (`IT342-Bibera-Examies`)
  - Mobile (`mobile`)

## 2. Test Objectives
- Verify implemented core flows still work after architecture and package restructuring.
- Ensure no behavioral regressions across backend APIs, web UI flows, and mobile auth flow.
- Confirm integration points (web/mobile to backend) remain compatible.
- Maintain baseline quality via automated tests where available and structured manual checks where needed.

## 3. Refactoring Context

### Backend
Feature-slice organization:
- `features/auth`
- `features/users`
- `features/classes`
- `features/exams`
- `features/attempts`
- `common/*` for cross-cutting config and utilities

### Web Frontend
- Feature-oriented page entrypoints under `src/features/*/pages`
- Main routing wired in `src/App.js`

### Mobile
- Feature/common package split:
  - `features/auth`
  - `features/dashboard`
  - `common/api`
  - `common/session`

## 4. Functional Requirements Coverage

## 4.1 Backend Functional Coverage

### FR-BE-1 Authentication and Profile
- Sign up (`POST /api/auth/signup`)
- Sign in (`POST /api/auth/signin`)
- Sign out (`POST /api/auth/signout`)
- Get current user by email (`GET /api/auth/me`)
- Update profile (`PUT /api/auth/update-profile`)

### FR-BE-2 User Access
- Get user details (`GET /api/users/{id}`)

### FR-BE-3 Classes and Enrollment
- Create class (`POST /api/classes`)
- Get classes by instructor (`GET /api/classes/instructor/{supabaseUserId}`)
- Get classes by student (`GET /api/classes/student/{supabaseUserId}`)
- Get class by id (`GET /api/classes/{classId}`)
- Join class (`POST /api/enrollments/join`)
- List enrollments for class (`GET /api/enrollments/class/{classId}`)

### FR-BE-4 Exams
- Create full exam (`POST /api/exams`)
- Get exams by teacher (`GET /api/exams/teacher/{supabaseUserId}`)
- Get exams by class (`GET /api/exams/class/{classId}`)
- Start exam (`PUT /api/exams/start/{id}`)
- Close exam (`PUT /api/exams/close/{id}`)
- Update exam (`PUT /api/exams/{id}`)
- Delete exam (`DELETE /api/exams/{id}`)
- Get exam by id (`GET /api/exams/{id}`)
- Get exams for student (`GET /api/exams/student/{supabaseUserId}`)

### FR-BE-5 Attempts
- Submit attempt (`POST /api/attempts`)
- Get attempts by exam (`GET /api/attempts/exam/{examId}`)
- Get answers by attempt (`GET /api/attempts/{attemptId}/answers`)

## 4.2 Web Frontend Functional Coverage

### FR-WEB-1 Auth and Session UX
- Login/signup UI renders and submits expected payloads.
- Auth context updates user state.
- Redirect to role dashboard on successful auth.

### FR-WEB-2 Student Flows
- View enrolled classes and student exam list.
- Join class using class password.
- Open and submit exam attempt flow.
- View profile and update profile fields.

### FR-WEB-3 Teacher Flows
- View teacher dashboard.
- Create class.
- Create, edit, start, close, and delete exams.
- Access analytics and student answers views.

### FR-WEB-4 Admin/Shared
- Route rendering for admin page.
- Toast and error handling behavior does not break primary flows.

## 4.3 Mobile Functional Coverage

### FR-MOB-1 Authentication
- Login form validation.
- Signin API call and token persistence.
- Role selection + signup submission.

### FR-MOB-2 Session and Navigation
- Auto-login when token exists.
- Logout clears session and returns to auth screen.
- Navigation auth -> dashboard and signup -> auth works as expected.

### FR-MOB-3 API Connectivity
- Emulator URL (`10.0.2.2`) reaches backend auth endpoints.
- Basic failure handling shows user feedback on API error.

## 5. Test Cases and Steps

## 5.1 Backend Test Cases

### TC-BE-AUTH-001 Sign Up
- Preconditions: Email is not yet registered.
- Steps:
  1) Send valid signup payload to `/api/auth/signup`.
  2) Verify response includes user data.
  3) Verify user record exists in DB.
- Expected: Account created and persisted.

### TC-BE-AUTH-002 Sign In
- Preconditions: User already exists.
- Steps:
  1) Send valid credentials to `/api/auth/signin`.
  2) Verify access/refresh tokens exist.
- Expected: User authenticated successfully.

### TC-BE-CLS-001 Create Class
- Preconditions: Teacher exists.
- Steps:
  1) Send class payload to `/api/classes`.
  2) Retrieve classes via instructor endpoint.
- Expected: Class appears in instructor class list.

### TC-BE-CLS-002 Join Class
- Preconditions: Student exists, class password valid.
- Steps:
  1) Call `/api/enrollments/join`.
  2) Retrieve enrollments via `/api/enrollments/class/{classId}`.
- Expected: Student appears in class enrollment results.

### TC-BE-EXAM-001 Create Full Exam
- Preconditions: Class exists.
- Steps:
  1) Create exam with nested questions/options.
  2) Retrieve exam by id.
- Expected: Exam and nested question data persist.

### TC-BE-ATT-001 Submit Attempt
- Preconditions: Exam started for student.
- Steps:
  1) Submit attempt + answers to `/api/attempts`.
  2) Query attempts by exam.
  3) Query answers by attempt id.
- Expected: Attempt saved with computed metadata and linked answers.

## 5.2 Web Frontend Regression Cases

### TC-WEB-AUTH-001 Login/Signup Flow
- Preconditions: Backend available.
- Steps:
  1) Open `/`.
  2) Register or login with valid credentials.
  3) Confirm routing to appropriate dashboard.
- Expected: Auth flow completes without UI/runtime errors.

### TC-WEB-STU-001 Join Class and View Exams
- Preconditions: Student account exists.
- Steps:
  1) Login as student.
  2) Submit class password join action.
  3) Refresh student dashboard and class/exam cards.
- Expected: Joined class and related exams become visible.

### TC-WEB-TEA-001 Create and Manage Exam
- Preconditions: Teacher account exists.
- Steps:
  1) Login as teacher.
  2) Create exam with questions and options.
  3) Start exam, then close exam.
- Expected: Exam state transitions correctly and reflects in dashboard.

### TC-WEB-EXAM-001 Student Attempt Submission
- Preconditions: Started exam assigned to class.
- Steps:
  1) Open `/exam/:examId`.
  2) Submit answers until completion.
  3) Verify no client-side crash and successful API response handling.
- Expected: Attempt is submitted and user sees successful completion behavior.

### TC-WEB-PROF-001 Profile Update
- Preconditions: Authenticated user.
- Steps:
  1) Open `/profile`.
  2) Update editable profile fields.
  3) Save and reload.
- Expected: Updated profile is persisted and displayed.

## 5.3 Mobile Regression Cases

### TC-MOB-AUTH-001 Login Success + Auto Session
- Preconditions: Existing user and running backend.
- Steps:
  1) Open app login screen.
  2) Login with valid credentials.
  3) Relaunch app.
- Expected: Token is saved and app auto-navigates to dashboard.

### TC-MOB-AUTH-002 Signup and Return Login
- Preconditions: New email.
- Steps:
  1) Open signup flow from auth screen.
  2) Select role and submit registration.
  3) Return to login and authenticate.
- Expected: Signup succeeds and login works with new account.

### TC-MOB-SESS-001 Logout Behavior
- Preconditions: Logged in user.
- Steps:
  1) Tap logout.
  2) Verify back stack is cleared.
  3) Relaunch app.
- Expected: User returns to auth screen and is not auto-logged in.

### TC-MOB-ERR-001 API Error Handling
- Preconditions: Stop backend or use invalid credentials.
- Steps:
  1) Trigger login/signup request.
  2) Observe app behavior.
- Expected: App remains stable and shows error toast.

## 6. Automated Test Inventory

### 6.1 Backend (JUnit + Mockito)
- `ExamiesApplicationTests` (context load smoke test)
- `features.users.service.UsersServiceTest`
- `features.classes.service.ClassesServiceTest`
- `features.attempts.service.AttemptServiceTest`

### 6.2 Web Frontend
- Existing CRA test entrypoint:
  - `src/App.test.js`
  - `src/setupTests.js`
- Current baseline focuses on smoke-level test coverage.

### 6.3 Mobile
- Baseline Android test stubs present:
  - `app/src/test/java/com/example/mobile/ExampleUnitTest.kt`
  - `app/src/androidTest/java/com/example/mobile/ExampleInstrumentedTest.kt`
- No full automated regression suite yet; manual regression required per release.

## 7. Regression Execution Procedure

### 7.1 Backend
1. `cd examies`
2. `mvn test`
3. Start API for integration checks: `mvn spring-boot:run`

### 7.2 Web Frontend
1. `cd IT342-Bibera-Examies`
2. `npm install`
3. `npm test -- --watchAll=false`
4. `npm start`
5. Execute manual regression cases TC-WEB-* with backend running.

### 7.3 Mobile
1. Open `mobile` in Android Studio.
2. Sync Gradle and run unit/instrumented baseline tests.
3. Launch app on emulator/device.
4. Execute manual regression cases TC-MOB-* against running backend.

## 8. Entry/Exit Criteria

### Entry
- Refactor branch builds successfully for backend, web, and mobile modules.
- Database/schema and Supabase config are reachable for runtime tests.
- Required test data accounts exist (student, teacher, optional admin).

### Exit
- No critical or major regressions in backend, web, or mobile core flows.
- Backend automated tests pass.
- Web automated baseline test command passes.
- Mobile baseline automated tests (if executed) pass and manual auth/session checks pass.
- All failed test cases are documented with severity and owner.

