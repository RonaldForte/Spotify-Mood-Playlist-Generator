import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const response = await fetch('/api/spotify/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
      
        const data = await response.json();
        localStorage.setItem('spotify_access_token', data.access_token);
        navigate('/app');
      };

    fetchToken();
  }, [navigate]);

  return <div>Loading...</div>;
}

export default Callback;