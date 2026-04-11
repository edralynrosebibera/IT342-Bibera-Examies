import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ExamCard from '../assets/cards/ExamCard';
import ClassesView from "../assets/cards/ClassesView";
import "../assets/styles/TeacherDashboard.css";



const TeacherDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const { user, signOut } = useAuth();

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

    const fetchExams = async () => {
      try {
        const userRes = await fetch(
          `http://localhost:8080/api/auth/me?email=${user.email}`
        );
        const userData = await userRes.json();

        const res = await fetch(
          `http://localhost:8080/api/exams/teacher/${userData.id}`
        );
        const data = await res.json();

        setExams(Array.isArray(data) ? [...data] : []);

      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    if (user) fetchExams();
  }, [user]);


    const handleLogout = async () => {
    await signOut(); // clears supabase session
    navigate("/");   // goes to ExamFlowAuth
  };

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
                <div 
                  className="dropdown-item logout"
                  onClick={handleLogout}
                >
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
            </div>
          </button>

          <button className={`stat-btn ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>
            <div className="icon-box green-bg">✔️</div>
            <div className="text-box">
              <span className="label">Completed</span>
            </div>
          </button>

          <button className={`stat-btn ${filter === 'Upcoming' ? 'active' : ''}`} onClick={() => setFilter('Upcoming')}>
            <div className="icon-box pink-bg">⏰</div>
            <div className="text-box">
              <span className="label">Upcoming</span>
            </div>
          </button>

          <button 
            className={`stat-btn ${filter === 'Classes' ? 'active' : ''}`}
            onClick={() => setFilter('Classes')}
          >
            <div className="icon-box blue-bg">🎓</div>
            <div className="text-box">
              <span className="label">Classes</span>
            </div>
          </button>
        </div>

        {/* SEARCH + BUTTON */}
        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search exams..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
            Array.isArray(exams) && exams
              .filter(exam => {
                if (filter === "Completed") return exam.closed === true;
                if (filter === "Upcoming") return exam.closed === false;
                return true; // All
              })
                  .map(exam => (
              <ExamCard key={exam.id} exam={exam} refreshExams={fetchExams} />
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;