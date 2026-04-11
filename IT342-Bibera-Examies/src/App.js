import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ExamFlowAuth from "./pages/ExamFlowAuth";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import CreateExam from "./pages/CreateExam";
import CreateClass from "./pages/Createclass";
import AnimatedBackground from "./pages/AnimatedBackground";
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
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/create-exam" element={<CreateExam />} />
            <Route path="/create-class" element={<CreateClass />} />
          </Routes>

          <Toaster position="top-right" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;