import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import '../assets/styles/SignUpForm.css';

const SignUpForm = ({ role, setRole, initialEmail = '', oauth = false, supabaseUserId = '' }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: initialEmail || '',
    password: ''
  });

  const navigate = useNavigate();
  const { signIn } = useAuth();

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      email: initialEmail || current.email
    }));
  }, [initialEmail]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const redirectByRole = (userRole) => {
    const normalizedRole = userRole?.toLowerCase();
    if (normalizedRole === 'student') {
      navigate('/student-dashboard');
    } else if (normalizedRole === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (normalizedRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      email: formData.email,
      password: oauth ? undefined : formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      role: role?.toUpperCase(),
      oauth: oauth || false,
      supabaseUserId: oauth ? supabaseUserId : undefined
    };

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text();
        let errorMessage = 'Signup failed';
        if (text) {
          try {
            const errorJson = JSON.parse(text);
            errorMessage = errorJson.message || text;
          } catch {
            errorMessage = text;
          }
        }
        toast.error(errorMessage);
        return;
      }

      toast.success('Account created successfully!');

      // For OAuth signups we assume the Supabase session is already active.
      // Do not attempt to sign in with password when `oauth` is true.
      if (oauth) {
        await supabase.auth.updateUser({
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            role: role?.toUpperCase()
          }
        });
        redirectByRole(role);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        });
        return;
      }

      const { data: signInData, error: signInError } = await signIn(formData.email, formData.password);
      if (signInError || !signInData?.user) {
        console.warn('Signup succeeded, but auto-login failed:', signInError?.message);
        navigate('/');
        return;
      }

      redirectByRole(role);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      });
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
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
        <button type="button" className="change-role-btn" onClick={() => setRole(null)}>
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
          readOnly={!!initialEmail}
        />
        {oauth && initialEmail && (
          <small className="note">Email provided by Google</small>
        )}
      </div>

      {!oauth && (
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
      )}

      <button type="submit" className="submit-btn pink-gradient" disabled={loading}>
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignUpForm;
