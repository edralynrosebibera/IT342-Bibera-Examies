import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import '../styles/ExamCard.css';

const ExamCard = ({ exam, refreshExams }) => {

  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const role = user?.user_metadata?.role?.toLowerCase();
  const navigate = useNavigate();

  // 🔥 TEACHER ACTIONS
  const handleStart = async () => {
    try {
      await fetch(`http://localhost:8080/api/exams/start/${exam.id}`, {
        method: "PUT"
      });

      await refreshExams();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = async () => {
    try {
      await fetch(`http://localhost:8080/api/exams/close/${exam.id}`, {
        method: "PUT"
      });

      await refreshExams(); // 🔥 IMPORTANT
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:8080/api/exams/${exam.id}`, {
        method: "DELETE"
      });

      setShowConfirm(false);
      await refreshExams();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    navigate(`/edit-exam/${exam.id}`);
  };

  // 🔥 STUDENT ACTION
  const handleStartExam = () => {
    navigate(`/exam/${exam.id}`);
  };

  return (
    <>
      <div className="exam-card">

        {/* HEADER */}
        <div className="card-header">
          <div>
            <h3>{exam.title}</h3>
          
          </div>

          <span className="status-badge">
            {exam.closed
              ? "Closed"
              : exam.started
              ? "Ongoing"
              : "Upcoming"}
          </span>
        </div>

        {/* DETAILS */}
        <div className="exam-details">
          <span>
            📅 {exam.dueDate
              ? new Date(exam.dueDate).toLocaleString()
              : "No Date"}
          </span>

          <span>
            🕒 {exam.timeLimit
              ? `${exam.timeLimit} mins`
              : "No Time"}
          </span>

          <span>📚 {exam.questions?.length || 0} questions</span>
        </div>

        {/* BUTTON LOGIC */}
        {exam.closed ? (
          <button className="action-btn secondary">
            Closed
          </button>

        ) : role === "teacher" ? (

          <>
            {exam.started ? (
              <button 
                className="action-btn primary"
                onClick={handleClose}
              >
                Close Exam
              </button>
            ) : (
              <button 
                className="action-btn primary"
                onClick={handleStart}
              >
                Start Exam
              </button>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
              <button 
                className="action-btn secondary"
                onClick={handleEdit}
              >
                Edit
              </button>

              <button 
                className="action-btn danger"
                onClick={() => setShowConfirm(true)}
              >
                Delete
              </button>
            </div>
          </>

        ) : (

          exam.started ? (
            <button 
              className="action-btn primary"
              onClick={handleStartExam}
            >
              Start Exam
            </button>
          ) : (
            <button className="action-btn secondary">
              Not Available
            </button>
          )

        )}

      </div>

      {/* 🔥 MODAL */}
      {showConfirm && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Delete Exam</h3>
            <p>Are you sure you want to delete this exam?</p>

            <div className="modal-actions">
              <button 
                className="action-btn secondary"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button 
                className="action-btn danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExamCard;