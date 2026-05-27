import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const redirectByRole = (navigate, role) => {
  if (role === 'student') navigate('/student-dashboard');
  else if (role === 'teacher') navigate('/teacher-dashboard');
  else if (role === 'admin') navigate('/admin');
  else navigate('/profile');
};

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handle = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user || null;

        if (!user) {
          // No session yet — go back to login
          navigate('/');
          return;
        }

        const email = user.email;
        // Query backend to see if user exists
        try {
          const res = await fetch(`http://localhost:8080/api/auth/me?email=${encodeURIComponent(email)}`);
            if (res.ok) {
              const body = await res.json();
              const resolveRole = (u) => {
                const r = u?.user_metadata?.role || u?.app_metadata?.role || ''
                return r?.toString()?.toLowerCase() || ''
              }
              const role = (body.role || body.user_metadata?.role || body.app_metadata?.role || '').toString().toLowerCase();
              const currentRole = resolveRole(user);
              if (role && currentRole !== role) {
                await supabase.auth.updateUser({
                  data: {
                    ...user.user_metadata,
                    role: role.toUpperCase()
                  }
                });
              }
              redirectByRole(navigate, role);
              return;
            }
        } catch (err) {
          console.warn('Error checking backend user:', err);
        }

        // If no backend user, send to signup flow with email prefilled and oauth flag
        navigate(`/?signup=1&email=${encodeURIComponent(email)}&oauth=1&supabaseUserId=${encodeURIComponent(user.id)}`);
      } finally {
        setLoading(false);
      }
    };

    handle();
  }, [navigate]);

  return (
    <div style={{padding:20}}>
      {loading ? <div>Processing Google sign in...</div> : <div>Redirecting...</div>}
    </div>
  );
};

export default OAuthCallback;
