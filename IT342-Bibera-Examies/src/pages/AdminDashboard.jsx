import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../assets/styles/AdminDashboard.css";
import { toast } from 'sonner';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState('All');
  const [showDropdown, setShowDropdown] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0
  });

  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const dropdownRef = useRef();

  // Redirect if not admin
  useEffect(() => {
    if (user && user.user_metadata?.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
      calculateStats(data);
      filterUsers(data, filter, search);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  // Calculate statistics
  const calculateStats = (userList) => {
    const stats = {
      totalUsers: userList.length,
      students: userList.filter(u => u.role === 'STUDENT').length,
      teachers: userList.filter(u => u.role === 'TEACHER').length,
      admins: userList.filter(u => u.role === 'ADMIN').length
    };
    setStats(stats);
  };

  // Filter users based on role and search
  const filterUsers = (userList, roleFilter, searchTerm) => {
    let filtered = userList;

    if (roleFilter !== 'All') {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(u =>
        u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(filtered);
  };

  // Handle filter change
  const handleFilterChange = (role) => {
    setFilter(role);
    filterUsers(users, role, search);
    setShowDropdown(false);
  };

  // Handle search change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterUsers(users, filter, value);
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        toast.success('User deleted successfully');
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  // Update user role
  const updateUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      if (res.ok) {
        toast.success('User role updated successfully');
        fetchUsers();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="dashboard-page">
      {/* NAVBAR */}
      <div className="navbar">
        <div className="nav-left">
          <div className="nav-logo">📊</div>
          <div className="nav-brand">Examies</div>
        </div>

        <div className="nav-right">
          <div className="nav-icon">👤</div>
          <div
            className="nav-icon"
            ref={dropdownRef}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            ⚙️
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, Admin</h1>
          <p>Manage all users and system administration</p>
        </div>

        {/* STATS SECTION */}
        <div className="stats-container">
          <div
            className={`stat-btn ${filter === 'All' ? 'active' : ''}`}
            onClick={() => handleFilterChange('All')}
          >
            <div className="icon-box purple-bg">👥</div>
            <div className="text-box">
              <span className="label">Total Users</span>
              <span className="count">{stats.totalUsers}</span>
            </div>
          </div>

          <div
            className={`stat-btn ${filter === 'STUDENT' ? 'active' : ''}`}
            onClick={() => handleFilterChange('STUDENT')}
          >
            <div className="icon-box green-bg">🎓</div>
            <div className="text-box">
              <span className="label">Students</span>
              <span className="count">{stats.students}</span>
            </div>
          </div>

          <div
            className={`stat-btn ${filter === 'TEACHER' ? 'active' : ''}`}
            onClick={() => handleFilterChange('TEACHER')}
          >
            <div className="icon-box blue-bg">👨‍🏫</div>
            <div className="text-box">
              <span className="label">Teachers</span>
              <span className="count">{stats.teachers}</span>
            </div>
          </div>

          <div
            className={`stat-btn ${filter === 'ADMIN' ? 'active' : ''}`}
            onClick={() => handleFilterChange('ADMIN')}
          >
            <div className="icon-box pink-bg">🔐</div>
            <div className="text-box">
              <span className="label">Admins</span>
              <span className="count">{stats.admins}</span>
            </div>
          </div>
        </div>

        {/* SEARCH SECTION */}
        <div className="search-section">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={search}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="users-container">
          <div className="users-header">
            <h2>Users Management</h2>
            <span className="user-count">{filteredUsers.length} users</span>
          </div>

          {filteredUsers.length > 0 ? (
            <div className="users-table">
              <div className="table-header">
                <div className="col-avatar">Avatar</div>
                <div className="col-name">Name</div>
                <div className="col-email">Email</div>
                <div className="col-role">Role</div>
                <div className="col-actions">Actions</div>
              </div>

              {filteredUsers.map((u) => (
                <div key={u.id} className="table-row">
                  <div className="col-avatar">
                    <div className="avatar">
                      {u.firstName.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="col-name">
                    {u.firstName} {u.lastName}
                  </div>
                  <div className="col-email">{u.email}</div>
                  <div className="col-role">
                    <select
                      value={u.role}
                      onChange={(e) => updateUserRole(u.id, e.target.value)}
                      className="role-select"
                    >
                      <option value="STUDENT">Student</option>
                      <option value="TEACHER">Teacher</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div className="col-actions">
                    <button
                      className="delete-btn"
                      onClick={() => deleteUser(u.id)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-users">
              <p>No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
