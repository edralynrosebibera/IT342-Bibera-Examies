import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamFlowAuth from "./features/auth/pages/ExamFlowAuth";
import StudentDashboard from "./features/users/pages/StudentDashboard";
import TeacherDashboard from "./features/users/pages/TeacherDashboard";
import CreateExam from "./features/exams/pages/CreateExam";
import CreateClass from "./features/classes/pages/Createclass";
import ExamAttempt from "./features/exams/pages/ExamAttempt";
import ProfileDashboard from "./features/users/pages/ProfileDashboard";
import AnimatedBackground from "./features/shared/pages/AnimatedBackground";
import AdminDashboard from "./features/users/pages/AdminDashboard";
import Analytics from "./features/analytics/pages/Analytics";
import ViewStudentAnswers from "./features/exams/pages/ViewStudentAnswers";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AnimatedBackground />

          <Routes>
            {/* The Login/Signup Page */}
            <Route path="/" element={<ExamFlowAuth />} />

            {/* The Student Dashboard Page */}
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/edit-exam/:id" element={<CreateExam />} />
            <Route path="/create-class" element={<CreateClass />} />
            <Route path="/exam/:examId" element={<ExamAttempt />} />
            <Route path="/profile" element={<ProfileDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/analytics/:classId" element={<Analytics />} />
            <Route path="/view-answers/:classId/:examId/:studentId/:attemptId" element={<ViewStudentAnswers />} />

          </Routes>

          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;