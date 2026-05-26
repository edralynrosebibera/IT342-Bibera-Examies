import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const role = user.user_metadata?.role?.toLowerCase();

    if (role === 'student') {
      navigate('/student-dashboard');
    } else if (role === 'teacher') {
      navigate('/teacher-dashboard');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profile');
    }
  }, [navigate, user]);

  return null;
};

export default DashboardRedirect;
