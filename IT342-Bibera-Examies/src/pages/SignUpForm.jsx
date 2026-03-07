import React, { useState } from 'react';
import { toast } from "sonner";
import "../assets/styles/SignUpForm.css";

const SignUpForm = ({ role, setRole }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: role?.toUpperCase()
    };

    console.log("Signup payload:", payload);

    try {

      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {

        toast.success("Account created successfully! Please check your email to verify your account.");

        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        });

      } else {

        const text = await response.text();
        let errorMessage = "Signup failed";

        if (text) {
          try {
            const errorJson = JSON.parse(text);
            errorMessage = errorJson.message || text;
          } catch {
            errorMessage = text;
          }
        }

        toast.error(errorMessage);
      }

    } catch (error) {

      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");

    } finally {

      setLoading(false);

    }
  };

  return (
    <form className="auth-form fade-in" onSubmit={handleSignUp}>

      <div className="role-header">
        <span className={`role-tag ${role}`}>
          {role === 'student' ? '🎓 Student' : '📖 Teacher'}
        </span>

        <button
          type="button"
          className="change-role-btn"
          onClick={() => setRole(null)}
        >
          Change role
        </button>
      </div>

      <div className="form-row">

        <div className="input-group">
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            placeholder="Juan"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Last Name *</label>
          <input
            type="text"
            name="lastName"
            placeholder="Dela Cruz"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

      </div>

      <div className="input-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          placeholder="you@school.edu"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="input-group">
        <label>Password *</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>

      <button
        type="submit"
        className="submit-btn pink-gradient"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>

    </form>
  );
};

export default SignUpForm;