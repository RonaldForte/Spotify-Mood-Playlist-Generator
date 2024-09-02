import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      try {
        const response = await fetch(`http://localhost:5000/callback?code=${code}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        Cookies.set('spotify_access_token', data.access_token, {
          expires: 7,
          path: '/',
          domain: 'localhost'
        });

        navigate('/Home');
      } catch (error) {
        console.error('Error fetching token:', error);
        navigate('/Home');
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Callback;
