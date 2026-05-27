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

    const resolveRole = (u) => {
      const r = u?.user_metadata?.role || u?.app_metadata?.role || ''
      return r?.toString()?.toLowerCase() || ''
    }

    const role = resolveRole(user);

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
