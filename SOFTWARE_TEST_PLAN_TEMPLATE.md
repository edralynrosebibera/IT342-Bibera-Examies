# Software Test Plan Template

> Duplicate this file per milestone/release and rename it (example: `SOFTWARE_TEST_PLAN_PHASE4.md`).

## 1. Document Control
- Document Title:
- Project Name:
- Version:
- Date:
- Prepared By:
- Reviewed By:
- Approved By:

## 2. Project Information
- Project Description:
- System Under Test:
  - Backend:
  - Frontend:
  - Mobile:
- Related Documents:
  - Requirements Spec:
  - Regression Report:
  - API Docs:

## 3. Test Objectives
- Objective 1:
- Objective 2:
- Objective 3:

## 4. Scope

### 4.1 In Scope
- Backend:
- Frontend:
- Mobile:
- Integrations:

### 4.2 Out of Scope
- Item 1:
- Item 2:
- Item 3:

## 5. Test Strategy

### 5.1 Test Levels
- Unit Testing:
- Integration Testing:
- System Testing:
- Regression Testing:
- UAT (if applicable):

### 5.2 Test Types
- Functional:
- API:
- UI:
- Usability:
- Security (basic):
- Performance (basic):

### 5.3 Approach
- Automated Tests:
- Manual Tests:
- Risk-based Prioritization:

## 6. Test Environment

### 6.1 Hardware/OS
- OS:
- Device/Emulator:

### 6.2 Software Stack
- Java:
- Node.js:
- Database:
- Android Studio (if mobile):
- Browser(s):

### 6.3 Runtime Configuration
- Backend Base URL:
- Frontend Base URL:
- Mobile Base URL:
- Environment Variables:
  - `VAR_1=`
  - `VAR_2=`

## 7. Test Data
- Test Account 1 (Student/User):
- Test Account 2 (Teacher/Admin):
- Seed Data Required:
- Reset/Cleanup Procedure:

## 8. Entry and Exit Criteria

### 8.1 Entry Criteria
- Build is deployable locally/staging.
- Required services are running.
- Test data is ready.
- Critical blockers are resolved.

### 8.2 Exit Criteria
- No Critical/High open defects for release scope.
- Planned test cases executed at target completion %.
- Required automated suites pass.
- Test summary report completed.

## 9. Deliverables
- Software Test Plan
- Test Case List
- Defect Log
- Regression Test Report
- Final Test Summary

## 10. Test Items and Features to be Tested

### 10.1 Backend Features
- Auth:
- Users:
- Classes:
- Exams:
- Attempts:

### 10.2 Frontend Features
- Auth/UI flows:
- Dashboard flows:
- Exam flows:
- Profile/Admin flows:

### 10.3 Mobile Features
- Login/Signup:
- Session handling:
- Dashboard/Navigation:

## 11. Test Cases (Template Table)

| Test ID | Module | Test Scenario | Preconditions | Steps | Expected Result | Type | Priority |
|---|---|---|---|---|---|---|---|
| TC-XXX-001 | Backend |  |  |  |  | Manual/Auto | High |
| TC-XXX-002 | Frontend |  |  |  |  | Manual/Auto | Medium |
| TC-XXX-003 | Mobile |  |  |  |  | Manual/Auto | Medium |

## 12. Regression Suite Definition

### 12.1 Backend Regression Set
- TC-BE-...

### 12.2 Frontend Regression Set
- TC-WEB-...

### 12.3 Mobile Regression Set
- TC-MOB-...

## 13. Defect Management Process
- Defect Severity Levels:
  - Critical:
  - High:
  - Medium:
  - Low:
- Defect Workflow:
  - New -> Triaged -> In Progress -> Fixed -> Retest -> Closed
- Defect Tracking Tool/Location:

## 14. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation | Owner |
|---|---|---|---|---|
| Example: API environment unavailable | High | Medium | Prepare fallback local environment | Team |

## 15. Roles and Responsibilities

| Role | Name | Responsibility |
|---|---|---|
| QA Lead |  | Plan and sign-off |
| Backend Tester |  | API and service validation |
| Frontend Tester |  | UI/UX and route flow validation |
| Mobile Tester |  | App flow and session validation |

## 16. Schedule and Milestones

| Milestone | Start Date | End Date | Owner | Status |
|---|---|---|---|---|
| Test Planning |  |  |  |  |
| Test Case Design |  |  |  |  |
| Test Execution |  |  |  |  |
| Regression Pass |  |  |  |  |
| Final Sign-off |  |  |  |  |

## 17. Approvals
- Prepared By:
- Reviewed By:
- Approved By:
- Approval Date:
