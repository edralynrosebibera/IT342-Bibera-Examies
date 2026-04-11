import React from "react";
import "../../assets/styles/StudentClassesCard.css";

const StudentClassesCard = ({ classItem }) => {
  return (
    <div className="student-class-card">

      <div className="card-header">
        <div>
          <h3>{classItem.className}</h3>
          <p className="class-sub">Enrolled Class</p>
        </div>

        <span className="class-badge">Active</span>
      </div>

      <div className="class-details">
        <span>🆔 {classItem.id}</span>
        <span>📚 Exams</span>
      </div>

      <button className="class-action-btn">
        View Class
      </button>

    </div>
  );
};

export default StudentClassesCard;