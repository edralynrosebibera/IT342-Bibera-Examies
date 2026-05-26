import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/Analytics.css";
import { toast } from 'sonner';

const Analytics = () => {
  const { classId } = useParams();
  const [classData, setClassData] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [filteredEnrollments, setFilteredEnrollments] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [attemptMap, setAttemptMap] = useState({});
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    studentsPassed: 0,
    studentsAnswered: 0,
    highestScore: 0,
    averageScore: 0,
    lowestScore: 0,
    totalPoints: 0,
    averageTime: 'N/A',
    fastestTime: 'N/A',
    slowestTime: 'N/A'
  });
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef();

  // Close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter enrollments by search term
  useEffect(() => {
    const filtered = enrollments.filter((enrollment) => {
      const query = search.toLowerCase();
      return (
        enrollment.studentName.toLowerCase().includes(query) ||
        enrollment.studentEmail.toLowerCase().includes(query)
      );
    });
    setFilteredEnrollments(filtered);
  }, [search, enrollments]);

  // Fetch class, enrollments, and exams
  useEffect(() => {
    const fetchData = async () => {
      try {
        const classRes = await fetch(`http://localhost:8080/api/classes/${classId}`);
        if (!classRes.ok) throw new Error('Unable to fetch class data');
        const classData = await classRes.json();
        setClassData(classData);

        const enrollmentsRes = await fetch(`http://localhost:8080/api/enrollments/class/${classId}`);
        if (!enrollmentsRes.ok) throw new Error('Unable to fetch enrollments');
        const enrollmentsData = await enrollmentsRes.json();
        setEnrollments(Array.isArray(enrollmentsData) ? enrollmentsData : []);

        const examsRes = await fetch(`http://localhost:8080/api/exams/class/${classId}`);
        if (!examsRes.ok) throw new Error('Unable to fetch exams');
        const examsData = await examsRes.json();
        setExams(Array.isArray(examsData) ? examsData : []);

        if (Array.isArray(examsData) && examsData.length > 0) {
          setSelectedExam(examsData[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load analytics data');
      }
    };

    if (classId && user) {
      fetchData();
    }
  }, [classId, user]);

  useEffect(() => {
    if (selectedExam) {
      loadAttemptsAndAnalytics(selectedExam.id);
    }
  }, [selectedExam, enrollments]);

  const loadAttemptsAndAnalytics = async (examId) => {
    try {
      const attemptsRes = await fetch(`http://localhost:8080/api/attempts/exam/${examId}`);
      const attemptsData = await attemptsRes.json();
      const validAttempts = Array.isArray(attemptsData) ? attemptsData : [];

      const enrichedAttempts = validAttempts.map((attempt) => {
        if (attempt.startTime && attempt.submittedAt) {
          const durationSeconds = Math.max(
            0,
            Math.round(
              (new Date(attempt.submittedAt).getTime() - new Date(attempt.startTime).getTime()) / 1000
            )
          );
          return {
            ...attempt,
            timeTakenSeconds: durationSeconds,
            timeTaken: formatDuration(durationSeconds)
          };
        }

        return {
          ...attempt,
          timeTakenSeconds: null,
          timeTaken: 'N/A'
        };
      });

      setAttempts(enrichedAttempts);

      const map = enrichedAttempts.reduce((acc, attempt) => {
        const existing = acc[attempt.studentId];
        const existingTime = existing?.submittedAt ? new Date(existing.submittedAt).getTime() : 0;
        const attemptTime = attempt.submittedAt ? new Date(attempt.submittedAt).getTime() : 0;
        if (!existing || attemptTime > existingTime) {
          acc[attempt.studentId] = attempt;
        }
        return acc;
      }, {});
      setAttemptMap(map);

      const examRes = await fetch(`http://localhost:8080/api/exams/${examId}`);
      const examData = await examRes.json();
      const totalPoints = examData.totalPoints || 100;
      const passingScore = totalPoints * 0.6;

      const studentsAnswered = new Set(enrichedAttempts.map(a => a.studentId)).size;
      const studentsPassed = new Set(enrichedAttempts.filter(a => a.score >= passingScore).map(a => a.studentId)).size;
      const scores = enrichedAttempts.map(a => a.score || 0);
      const times = enrichedAttempts.filter(a => a.timeTakenSeconds !== null).map(a => a.timeTakenSeconds);

      setAnalytics({
        totalStudents: enrollments.length,
        studentsPassed,
        studentsAnswered,
        highestScore: scores.length > 0 ? Math.max(...scores) : 0,
        averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
        totalPoints,
        averageTime: times.length > 0 ? formatDuration(Math.round(times.reduce((a, b) => a + b, 0) / times.length)) : 'N/A',
        fastestTime: times.length > 0 ? formatDuration(Math.min(...times)) : 'N/A',
        slowestTime: times.length > 0 ? formatDuration(Math.max(...times)) : 'N/A'
      });
    } catch (error) {
      console.error('Error calculating analytics:', error);
      toast.error('Could not calculate analytics');
    }
  };

  const formatDuration = (seconds) => {
    if (seconds === null || seconds === undefined) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const handleViewAnswers = (studentId) => {
    const attempt = attemptMap[studentId];
    if (!attempt) {
      toast.error('This student has not submitted an attempt yet');
      return;
    }
    navigate(`/view-answers/${classId}/${selectedExam.id}/${studentId}/${attempt.id}`);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  if (!classData) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-logo">📊</div>
          <div className="nav-brand">Examies</div>
        </div>

        <div className="nav-right">
          <div className="nav-icon">👤</div>
          <div
            className="nav-icon"
            ref={dropdownRef}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ⚙️
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => navigate('/teacher-dashboard')}>
                  Back to Dashboard
                </div>
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="analytics-header">
          <div>
            <h1>Analytics</h1>
            <p className="class-name">Class: {classData.className}</p>
          </div>

          {/* EXAM SELECTOR */}
          <div className="exam-selector">
            <label>Select Exam:</label>
            <select
              value={selectedExam?.id || ''}
              onChange={(e) => {
                const exam = exams.find(ex => ex.id === parseInt(e.target.value));
                setSelectedExam(exam);
              }}
              className="exam-dropdown"
            >
              <option value="">-- Select an Exam --</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedExam && (
          <>
            {/* ANALYTICS CARDS */}
            <div className="analytics-cards">
              <div className="analytics-card">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <div className="card-label">Total Students</div>
                  <div className="card-value">{analytics.totalStudents}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">✅</div>
                <div className="card-content">
                  <div className="card-label">Students Passed</div>
                  <div className="card-value">{analytics.studentsPassed}</div>
                  <div className="card-subtitle">60% required to pass</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">📝</div>
                <div className="card-content">
                  <div className="card-label">Students Answered</div>
                  <div className="card-value">{analytics.studentsAnswered}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">🏆</div>
                <div className="card-content">
                  <div className="card-label">Highest Score</div>
                  <div className="card-value">{analytics.highestScore}/{analytics.totalPoints}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <div className="card-label">Average Score</div>
                  <div className="card-value">{analytics.averageScore}/{analytics.totalPoints}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">📉</div>
                <div className="card-content">
                  <div className="card-label">Lowest Score</div>
                  <div className="card-value">{analytics.lowestScore}/{analytics.totalPoints}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">⏱️</div>
                <div className="card-content">
                  <div className="card-label">Average Time</div>
                  <div className="card-value">{analytics.averageTime}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">⚡</div>
                <div className="card-content">
                  <div className="card-label">Fastest Time</div>
                  <div className="card-value">{analytics.fastestTime}</div>
                </div>
              </div>

              <div className="analytics-card">
                <div className="card-icon">🐢</div>
                <div className="card-content">
                  <div className="card-label">Slowest Time</div>
                  <div className="card-value">{analytics.slowestTime}</div>
                </div>
              </div>
            </div>

            {/* SEARCH */}
            <div className="search-section">
              <div className="search-wrapper">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            {/* STUDENTS LIST */}
            <div className="students-list-container">
              <h2>Students in Class</h2>
              {filteredEnrollments.length > 0 ? (
                <div className="students-grid">
                  {filteredEnrollments.map((enrollment) => {
                    const studentAttempt = attemptMap[enrollment.studentId];
                    return (
                      <div key={enrollment.id} className="student-card">
                        <div className="student-avatar">
                          {enrollment.studentName?.charAt(0).toUpperCase() || 'S'}
                        </div>
                        <div className="student-info">
                          <div className="student-name">{enrollment.studentName}</div>
                          <div className="student-email">{enrollment.studentEmail}</div>
                          <div className="student-meta">
                            <span>Time Taken: {studentAttempt?.timeTaken || 'Not submitted'}</span>
                          </div>
                        </div>
                        <button
                          className="view-answers-btn"
                          onClick={() => handleViewAnswers(enrollment.studentId)}
                        >
                          📋 View Answers
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-students">
                  <p>No students enrolled in this class yet</p>
                </div>
              )}
            </div>
          </>
        )}

        {!selectedExam && exams.length === 0 && (
          <div className="no-exams">
            <p>No exams created for this class yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
