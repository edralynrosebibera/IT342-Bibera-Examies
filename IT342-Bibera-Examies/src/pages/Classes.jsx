import React from "react";
import ClassesView from "../assets/cards/ClassesView";
import "../assets/styles/TeacherDashboard.css";

const Classes = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <ClassesView />
      </div>
    </div>
  );
};

export default Classes;