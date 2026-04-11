import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/CreateClass.css";
import "../assets/styles/TeacherDashboard.css";

const CreateClass = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    navigate("/teacher-dashboard");
  };

  const [form, setForm] = useState({
    title: "",
    description: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      // 🔥 Get teacher from backend
      const userRes = await fetch(
        `http://localhost:8080/api/auth/me?email=${user.email}`
      );
      const userData = await userRes.json();

      // 🔥 Create class
      await fetch("http://localhost:8080/api/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          instructorId: userData.id,
          className: form.title,
          classPassword: form.password
        })
      });

      console.log("Class created!");

      navigate("/teacher-dashboard");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="dashboard-page">

      <nav className="navbar">
        <div className="nav-left">
          <div className="nav-logo">🎓</div>
          <span className="nav-brand">Examies</span>
        </div>

        <div className="nav-right">
          <button className="header-btn secondary" onClick={handleBack}>
            ← Back
          </button>
        </div>
      </nav>

      <div className="dashboard-content">

        <header className="welcome-section">
          <h1>Create Class</h1>
        </header>

        <div className="create-class-container">

          <div className="class-card-box">
            <h3>Class Details</h3>

            <input
              type="text"
              name="title"
              placeholder="Class Title"
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
            />

            <input
              type="text"
              name="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>

          <button className="create-btn large" onClick={handleSubmit}>
            Create Class
          </button>

        </div>

      </div>
    </div>
  );
};

export default CreateClass;