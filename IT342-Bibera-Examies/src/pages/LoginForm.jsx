import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from '../contexts/AuthContext';
import { supabase } from "../lib/supabase"; 
import "../assets/styles/LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Login Successful!");

      const res = await fetch(
        `http://localhost:8080/api/auth/me?email=${data.user.email}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user role");
      }

      const userData = await res.json();
      console.log("userData:", userData);

      const role = userData.role?.toLowerCase();

      await supabase.auth.updateUser({
        data: { role: role }
      });

      await supabase.auth.refreshSession();


        console.log("Backend role:", role);

        if (role === "student") {
          navigate("/student-dashboard");
        } else if (role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form fade-in" onSubmit={handleLogin}>
      <div className="input-group">
        <label>Email</label>
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
        <label>Password</label>
        <div className="password-wrapper">
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      <div className="forgot-password-container">
        <span className="forgot-pw-text">Forgot password?</span>
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        <span className="icon-arrow">{loading ? '⏳' : '➔'}</span>
        {loading ? 'Signing In...' : 'Log In'}
      </button>

      <div className="divider">
      </div>

      <button
        type="button"
        className="google-btn"
        onClick={() => toast.info("Google login coming soon!")}
      >
        <img
          src="https://i.pinimg.com/1200x/45/20/dd/4520ddfc56208707045c56232e946f7f.jpg"
          alt="Google"
          className="google-icon"
        />
        Log in with Google
      </button>
    </form>
  );
};

export default LoginForm;