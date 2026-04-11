import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import '../styles/ExamCard.css';

const ExamCard = ({ exam, refreshExams }) => {

  const { user } = useAuth();
  const role = user?.user_metadata?.role?.toLowerCase();
  console.log("ROLE:", user?.user_metadata?.role); 
  const navigate = useNavigate();

  // 🔥 TEACHER ACTIONS
  const handleStart = async () => {
    console.log("CLICKED START");

    try {
      const res = await fetch(`http://localhost:8080/api/exams/start/${exam.id}`, {
        method: "PUT"
      });

      console.log("STATUS:", res.status); // 🔥 ADD THIS

      const updatedExam = await res.json();
      console.log(updatedExam);

      await refreshExams(); 

    } catch (error) {
      console.error("FETCH ERROR:", error);
    }
  };

  const handleClose = async () => {
    try {
      await fetch(`http://localhost:8080/api/exams/close/${exam.id}`, {
        method: "PUT"
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this exam?");
  if (!confirmDelete) return;

  try {
    await fetch(`http://localhost:8080/api/exams/${exam.id}`, {
      method: "DELETE"
    });

    await refreshExams(); // refresh list after delete
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
    <div className="exam-card">

      {/* HEADER */}
      <div className="card-header">
        <div>
          <h3>{exam.title}</h3>
          <p className="subject-text">{exam.subject || "No Subject"}</p>
        </div>

        {/* 🔥 STATUS */}
        <span className={`status-badge`}>
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
            : exam.date || "No Date"}
        </span>

        <span>
          🕒 {exam.timeLimit
            ? `${exam.timeLimit} mins`
            : exam.duration || "No Time"}
        </span>

        {/* KEEP YOUR ORIGINAL */}
        {exam.questions && (
          <span>📚 {exam.questions?.length || 0} questions</span>
        )}
      </div>

      {/* 🔥 BUTTON LOGIC */}
      {exam.closed ? (
        <button className="action-btn secondary">
          Closed
        </button>

      ) : role === "teacher" ? (

    <>
      {exam.started ? (
        <button 
          type="button"
          className="action-btn primary"
          onClick={handleClose}
        >
          Close Exam
        </button>
      ) : (
        <button 
          type="button"
          className="action-btn primary"
          onClick={handleStart}
        >
          Start Exam
        </button>
      )}

      {/* 🔥 NEW BUTTONS */}
      <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
        <button 
          className="action-btn secondary"
          onClick={handleEdit}
        >
          Edit
        </button>

        <button 
          className="action-btn danger"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </>

  ) : (

    exam.started ? (
      <button 
        type="button"
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
  );
};

export default ExamCard;