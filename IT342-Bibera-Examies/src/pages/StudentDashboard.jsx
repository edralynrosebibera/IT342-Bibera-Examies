import React, { useState } from 'react';
import ExamCard from '../assets/cards/ExamCard';
import "../assets/styles/StudentDashboard.css";

const EXAMS_DATA = [
  { id: 1, title: "Mathematics Final", subject: "Mathematics", date: "Mar 10, 2026", duration: "2 hours", questions: 40, status: "Upcoming" },
  { id: 2, title: "Physics Midterm", subject: "Physics", date: "Mar 8, 2026", duration: "1.5 hours", questions: 30, status: "Upcoming" },
  { id: 3, title: "English Literature", subject: "English", date: "Mar 5, 2026", duration: "1 hour", questions: 25, status: "Completed" },
  { id: 4, title: "Chemistry Quiz", subject: "Chemistry", date: "Mar 3, 2026", duration: "45 mins", questions: 20, status: "Completed" },
  { id: 5, title: "History Essay", subject: "History", date: "Feb 28, 2026", duration: "2 hours", questions: 5, status: "Completed" },
  { id: 6, title: "Biology Lab Test", subject: "Biology", date: "Mar 12, 2026", duration: "1 hour", questions: 35, status: "Upcoming" },
];

const StudentDashboard = () => {
  const [filter, setFilter] = useState('All');

  const filteredExams = EXAMS_DATA.filter(exam => 
    filter === 'All' ? true : exam.status === filter
  );

  return (
    <div className="dashboard-page">
      {/* 1. TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">🎓</div>
          <span className="nav-brand">ExamHub</span>
        </div>
        <div className="nav-right">
          <div className="nav-icon">🔔<span className="dot"></span></div>
          <div className="nav-profile">👤</div>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* 2. WELCOME HEADER */}
        <header className="welcome-section">
          <h1>Welcome back, Student 👋</h1>
          <p>Here's an overview of your exams</p>
        </header>

        {/* 3. STAT BUTTONS GRID */}
        <div className="stats-container">
          <button className={`stat-btn ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
            <div className="icon-box purple-bg">📄</div>
            <div className="text-box">
              <span className="label">Total Exams</span>
              <span className="count">6</span>
            </div>
          </button>

          <button className={`stat-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>
            <div className="icon-box green-bg">✔️</div>
            <div className="text-box">
              <span className="label">Completed</span>
              <span className="count">3</span>
            </div>
          </button>

          <button className={`stat-btn ${filter === 'Upcoming' ? 'active' : ''}`} onClick={() => setFilter('Upcoming')}>
            <div className="icon-box pink-bg">⏰</div>
            <div className="text-box">
              <span className="label">Upcoming</span>
              <span className="count">3</span>
            </div>
          </button>

          <button className="stat-btn">
            <div className="icon-box blue-bg">🎓</div>
            <div className="text-box">
              <span className="label">Classes</span>
              <span className="count">4</span>
            </div>
          </button>
        </div>

        {/* 4. SEARCH BAR */}
        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search exams..." />
          </div>
        </div>

        {/* 5. EXAM CARDS GRID */}
        <div className="exams-display-grid">
          {filteredExams.map(exam => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;