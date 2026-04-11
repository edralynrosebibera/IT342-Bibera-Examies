import React from "react";
import '../styles/ClassesCard.css';
  
const ClassesCard = ({ classItem }) => {
  return (
    <div className="class-card">

      <div className="class-header">
        <div>
          <h3>{classItem.title}</h3>
          <p className="class-desc">{classItem.description}</p>
        </div>

        <span className="class-badge">
          Class
        </span>
      </div>

      <div className="class-details">
        <span>👥 {classItem.students} Students</span>
        <span>📚 {classItem.exams} Exams</span>
      </div>

      <button className="class-btn">
        View Students
      </button>

    </div>
  );
};

export default ClassesCard;