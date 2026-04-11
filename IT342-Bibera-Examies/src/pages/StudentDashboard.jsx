import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ExamCard from '../assets/cards/ExamCard';
import StudentClassesView from "../assets/cards/StudentClassesView";
import "../assets/styles/StudentDashboard.css";



const StudentDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [exams, setExams] = useState([]);

  // 🔥 NEW STATES
  const [classPassword, setClassPassword] = useState("");

  const dropdownRef = useRef();

  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

        document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }
  
  , []);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const userRes = await fetch(
          `http://localhost:8080/api/auth/me?email=${user.email}`
        );
        const userData = await userRes.json();

        const classRes = await fetch(
          `http://localhost:8080/api/classes/student/${userData.id}`
        );
        const classes = await classRes.json();

        let allExams = [];

        for (let cls of classes) {
          const res = await fetch(
            `http://localhost:8080/api/exams/class/${cls.id}`
          );
          const exams = await res.json();
          allExams = [...allExams, ...exams];
        }

        setExams(allExams);

      } catch (error) {
        console.error(error);
      }
    };

    if (user) fetchExams();
  }, [user]);





  // 🔥 WORKING LOGOUT
  const handleLogout = async () => {
    await signOut(); // clears supabase session
    navigate("/");   // goes to ExamFlowAuth
  };

  const handleViewProfile = () => {
    console.log("View Profile clicked");
  };

  // 🔥 JOIN CLASS FUNCTION
  const handleJoinClass = async () => {
    try {
      const userRes = await fetch(
        `http://localhost:8080/api/auth/me?email=${user.email}`
      );
      const userData = await userRes.json();

      await fetch("http://localhost:8080/api/enrollments/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          studentId: userData.id,
          classPassword: classPassword
        })
      });

      console.log("Joined class!");

      
      setClassPassword("");
      

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-page">
      
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">🎓</div>
          <span className="nav-brand">Examies</span>
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
                <div 
                  className="dropdown-item"
                  onClick={handleViewProfile}
                >
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

        {/* HEADER */}
        <header className="welcome-section">
          <h1>Welcome back, Student 👋</h1>
          <p>Here's an overview of your exams</p>
        </header>

        {/* STATS */}
        <div className="stats-container">
          <button 
            className={`stat-btn ${filter === 'All' ? 'active' : ''}`} 
            onClick={() => setFilter('All')}
          >
            <div className="icon-box purple-bg">📄</div>
            <div className="text-box">
              <span className="label">Total Exams</span>
              <span className="count">6</span>
            </div>
          </button>

          <button 
            className={`stat-btn ${filter === 'Completed' ? 'active' : ''}`} 
            onClick={() => setFilter('Completed')}
          >
            <div className="icon-box green-bg">✔️</div>
            <div className="text-box">
              <span className="label">Completed</span>
              <span className="count">3</span>
            </div>
          </button>

          <button
            className={`stat-btn ${filter === 'Upcoming' ? 'active' : ''}`} 
            onClick={() => setFilter('Upcoming')}
          >
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
            <span className="count">--</span>
          </div>

        </button>

        </div>

        {/* 🔥 SEARCH + JOIN CLASS */}
        <div className="search-section">

          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Search exams..." />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "-30px"}}>
  
          <input
            type="text"
            placeholder="Class Password"
            value={classPassword}
            onChange={(e) => setClassPassword(e.target.value)}
          />

          <button className="create-btn" onClick={handleJoinClass}>
            Join Class
          </button>

        </div>

        </div>

        {/* EXAMS GRID */}
        <div className="exams-display-grid">

          {filter === "Classes" ? (
            <StudentClassesView />
          ) : (
            exams.map(exam => (
              <ExamCard key={exam.id} exam={exam} />
            ))
          )}

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;