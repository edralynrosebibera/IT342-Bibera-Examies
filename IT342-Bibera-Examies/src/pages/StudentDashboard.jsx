import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
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
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All'); // 'All', 'Completed', 'Upcoming'

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const filteredExams = EXAMS_DATA.filter(exam =>
    filter === 'All' ? true : exam.status === filter
  );

  const stats = {
    total: EXAMS_DATA.length,
    completed: EXAMS_DATA.filter(e => e.status === 'Completed').length,
    upcoming: EXAMS_DATA.filter(e => e.status === 'Upcoming').length,
    classes: 4
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Welcome back, {user.user_metadata?.first_name || 'Student'} 👋</h2>
        <p>Here's an overview of your exams</p>
        <button onClick={handleSignOut} className="sign-out-btn">
          Sign Out
        </button>
      </header>

      {/* Stats Grid */}
      <div className="stats-grid">
        <button className={`stat-card ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
          <div className="stat-icon purple">📄</div>
          <div className="stat-info">
            <span className="stat-label">Total Exams</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </button>

        <button className={`stat-card ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>
          <div className="stat-icon green">✔️</div>
          <div className="stat-info">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
        </button>

        <button className={`stat-card ${filter === 'Upcoming' ? 'active' : ''}`} onClick={() => setFilter('Upcoming')}>
          <div className="stat-icon pink">⏰</div>
          <div className="stat-info">
            <span className="stat-label">Upcoming</span>
            <span className="stat-value">{stats.upcoming}</span>
          </div>
        </button>

        <div className="stat-card static">
          <div className="stat-icon blue">🎓</div>
          <div className="stat-info">
            <span className="stat-label">Classes</span>
            <span className="stat-value">{stats.classes}</span>
          </div>
        </div>
      </div>

      <div className="search-bar-container">
        <input type="text" placeholder="Search exams..." className="search-input" />
      </div>

      <div className="exams-grid">
        {filteredExams.map(exam => (
          <ExamCard key={exam.id} exam={exam} />
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;