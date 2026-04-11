import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import ExamCard from '../assets/cards/ExamCard';
import ClassesView from "../assets/cards/ClassesView";
import "../assets/styles/TeacherDashboard.css";

const EXAMS_DATA = [
  { id: 1, title: "Mathematics Final", subject: "Mathematics", date: "Mar 10, 2026", duration: "2 hours", questions: 40, status: "Upcoming" },
  { id: 2, title: "Physics Midterm", subject: "Physics", date: "Mar 8, 2026", duration: "1.5 hours", questions: 30, status: "Upcoming" },
  { id: 3, title: "English Literature", subject: "English", date: "Mar 5, 2026", duration: "1 hour", questions: 25, status: "Completed" },
  { id: 4, title: "Chemistry Quiz", subject: "Chemistry", date: "Mar 3, 2026", duration: "45 mins", questions: 20, status: "Completed" },
  { id: 5, title: "History Essay", subject: "History", date: "Feb 28, 2026", duration: "2 hours", questions: 5, status: "Completed" },
  { id: 6, title: "Biology Lab Test", subject: "Biology", date: "Mar 12, 2026", duration: "1 hour", questions: 35, status: "Upcoming" },
];

const TeacherDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredExams = EXAMS_DATA.filter(exam => 
    filter === 'All' ? true : exam.status === filter
  );

  const handleLogout = () => console.log("Logout clicked");
  const handleViewProfile = () => console.log("View Profile clicked");
  const handleCreateExam = () => {
    navigate("/create-exam");
  };

  return (
    <div className="dashboard-page">
      
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">🎓</div>
          <span className="nav-brand">ExamHub</span>
        </div>

        <div className="nav-right">
          <div className="nav-icon">
            🔔
            <span className="dot"></span>
          </div>

          <div className="nav-profile-wrapper" ref={dropdownRef}>
            <div 
              className="nav-profile"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              👤
            </div>

            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item" onClick={handleViewProfile}>
                  View Profile
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="dashboard-content">

        <header className="welcome-section">
          <h1>Welcome back, Teacher 👋</h1>
          <p>Manage and create your exams</p>
        </header>

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

          <button 
            className={`stat-btn ${filter === 'Classes' ? 'active' : ''}`}
            onClick={() => setFilter('Classes')}
          >
            <div className="icon-box blue-bg">🎓</div>
            <div className="text-box">
              <span className="label">Classes</span>
              <span className="count">4</span>
            </div>
          </button>
        </div>

        {/* SEARCH + BUTTON */}
        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search exams..." />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>

            <button className="create-btn" onClick={handleCreateExam}>
              + Create Exam
            </button>

            {filter === "Classes" && (
              <button 
                className="create-btn secondary"
                onClick={() => navigate("/create-class")}
              >
                + Create Class
              </button>
            )}

          </div>
        </div>

        <div className="exams-display-grid">

          {filter === "Classes" ? (
            <ClassesView />
          ) : (
            filteredExams.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;