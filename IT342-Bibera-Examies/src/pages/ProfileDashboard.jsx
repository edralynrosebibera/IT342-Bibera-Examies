import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import '../assets/styles/ProfileDashboard.css';

const ProfileDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef();

  // Profile State
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profilePicture: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Fetch user profile data on mount
  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUserProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/auth/me?email=${encodeURIComponent(user.email)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setUserData({
        firstName: data.firstName || data.first_name || '',
        lastName: data.lastName || data.last_name || '',
        email: data.email || user.email,
        role: data.role || user.user_metadata?.role || 'student',
        phoneNumber: data.phoneNumber || data.phone_number || '',
        profilePicture: data.profilePicture || data.profile_picture || ''
      });

      setEditFormData({
        firstName: data.firstName || data.first_name || '',
        lastName: data.lastName || data.last_name || '',
        phoneNumber: data.phoneNumber || data.phone_number || '',
        profilePicture: data.profilePicture || data.profile_picture || ''
      });
    } catch (error) {
      console.error('Error loading profile from server, falling back to metadata:', error);
      const metadata = user.user_metadata || {};
      setUserData({
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        email: user.email,
        role: metadata.role || 'student',
        phoneNumber: '',
        profilePicture: ''
      });
      setEditFormData({
        firstName: metadata.first_name || '',
        lastName: metadata.last_name || '',
        phoneNumber: '',
        profilePicture: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditFormData({
          ...editFormData,
          profilePicture: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setEditLoading(true);

    try {
      const updatePayload = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        phoneNumber: editFormData.phoneNumber,
        profilePicture: editFormData.profilePicture
      };

      const response = await fetch(
        `http://localhost:8080/api/auth/update-profile?email=${user.email}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatePayload)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedData = await response.json();
      setUserData({
        firstName: updatedData.firstName || updatedData.first_name || editFormData.firstName,
        lastName: updatedData.lastName || updatedData.last_name || editFormData.lastName,
        email: updatedData.email || user.email,
        role: user.user_metadata?.role || 'student',
        phoneNumber: updatedData.phoneNumber || updatedData.phone_number || editFormData.phoneNumber,
        profilePicture: updatedData.profilePicture || updatedData.profile_picture || editFormData.profilePicture
      });
      setShowEditModal(false);
      toast.success('Profile updated successfully');

      await supabase.auth.updateUser({
        data: {
          first_name: editFormData.firstName,
          last_name: editFormData.lastName
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDashboardNavigation = () => {
    if (userData?.role?.toLowerCase() === 'teacher') {
      navigate('/teacher-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="navbar">
          <div className="logo">🎓 ExamHub</div>
        </div>
        <div className="profile-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="logo">🎓 ExamHub</div>

        <div className="nav-right">
          <span className="notif">🔔</span>

          <div
            className="profile"
            ref={dropdownRef}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="avatar">
              {userData?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </div>

            {showDropdown && (
              <div className="dropdown-menu">
                <button onClick={handleDashboardNavigation}>Dashboard</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PROFILE CONTAINER */}
      <div className="profile-container">
        {/* LEFT SIDE */}
        <div className="profile-left">
          <div className="profile-picture">
            <img
              src={
                editFormData.profilePicture ||
                userData?.profilePicture ||
                'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              }
              alt="Profile"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="profile-right">
          {/* ROLE */}
          <div className="profile-box role-box">
            <label>Role</label>
            <h3>{userData?.role || 'N/A'}</h3>
          </div>

          {/* NAME */}
          <div className="profile-box name-box">
            <label>Full Name</label>
            <h2>
              {userData?.firstName} {userData?.lastName}
            </h2>
          </div>

          {/* ACTION BOXES */}
          <div className="profile-actions">
            <button
              className="action-box edit-btn"
              onClick={() => setShowEditModal(true)}
            >
              ✏️ Edit Profile
            </button>

            <div className="action-box info-box">
              <label>Linked Email</label>
              <p>{user?.email || 'N/A'}</p>
            </div>

            <div className="action-box info-box">
              <label>Phone Number</label>
              <p>{userData?.phoneNumber || 'Not set'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Edit Profile</h2>
              <button
                className="close-btn"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Profile Picture Upload */}
              <div className="form-group">
                <label>Profile Picture</label>
                <div className="picture-upload">
                  <img
                    src={
                      editFormData.profilePicture ||
                      userData?.profilePicture ||
                      'https://cdn-icons-png.flaticon.com/512/149/149071.png'
                    }
                    alt="Preview"
                    className="preview-img"
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    📷 Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleProfilePictureChange}
                  />
                </div>
              </div>

              {/* First Name */}
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={editFormData.firstName}
                  onChange={handleEditInputChange}
                  placeholder="First Name"
                  className="form-input"
                />
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={editFormData.lastName}
                  onChange={handleEditInputChange}
                  placeholder="Last Name"
                  className="form-input"
                />
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={editFormData.phoneNumber}
                  onChange={handleEditInputChange}
                  placeholder="Phone Number"
                  className="form-input"
                />
              </div>


            </div>

            <div className="modal-footer">
              <button
                className="btn-cancel"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-save"
                onClick={handleSaveProfile}
                disabled={editLoading}
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDashboard;