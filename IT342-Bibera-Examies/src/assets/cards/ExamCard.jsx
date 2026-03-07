import React from 'react';
import '../styles/ExamCard.css';

const ExamCard = ({ exam }) => {
  const isCompleted = exam.status === 'Completed';

  return (
    <div className="exam-card">
      <div className="card-header">
        <div>
          <h3>{exam.title}</h3>
          <p className="subject-text">{exam.subject}</p>
        </div>
        <span className={`status-badge ${exam.status.toLowerCase()}`}>
          {exam.status}
        </span>
      </div>

      <div className="exam-details">
        <span>📅 {exam.date}</span>
        <span>🕒 {exam.duration}</span>
        <span>📚 {exam.questions} questions</span>
      </div>

      <button className={`action-btn ${isCompleted ? 'secondary' : 'primary'}`}>
        {isCompleted ? 'View Results' : 'Start Exam'}
      </button>
    </div>
  );
};

export default ExamCard;