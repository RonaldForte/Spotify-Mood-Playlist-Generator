import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './Home.css';

function Home() {
  const [genres, setGenres] = useState("");
  const [userDay, setUserDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [spotifyLoggedIn, setSpotifyLoggedIn] = useState(false);

  const openUrl = "https://api.openai.com/v1/chat/completions";
  const openApiKey = process.env.REACT_APP_OPENAI_API_KEY;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

  useEffect(() => {
    const token = Cookies.get('spotify_access_token');
    setSpotifyLoggedIn(!!token);
    console.log('Access Token from Cookie:', token);
  }, []);

  const handleSpotifyLogin = () => {
    const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const scope = 'playlist-modify-private playlist-read-private';
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}`;
  };

  async function fetchData() {
    setLoading(true);
  
    try {
      const response = await fetch(openUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: `Generate a list of music genres of size 5 for the day described as: "${userDay}" only using spotify genres` }],
          max_tokens: 30
        })
      });
  
      if (response.status === 429) {
        console.error('Rate limit exceeded.');
        setLoading(false);
        return;
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const fetchedGenres = data.choices[0]?.message?.content.trim() || "No genres found.";
      setGenres(fetchedGenres);
  
      const spotifyToken = Cookies.get('spotify_access_token');
      console.log('Spotify Token:', spotifyToken);
  
      if (!spotifyToken) {
        console.error('No Spotify access token found.');
        setLoading(false);
        return;
      }

      const playlistResponse = await fetch('https://api.spotify.com/v1/me/playlists', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `Playlist for ${userDay}`,
          description: `Playlist generated based on your mood: ${userDay}`,
          public: false
        })
      });
  
      if (!playlistResponse.ok) {
        const errorData = await playlistResponse.json();
        console.error('Error creating playlist:', errorData);
        throw new Error(`Error creating playlist: ${playlistResponse.status}`);
      }
  
      const playlistData = await playlistResponse.json();
      const playlistId = playlistData.id;
      console.log('Playlist ID:', playlistId);
  
      const genreArray = fetchedGenres.split('\n').map(genre => genre.trim()).filter(genre => genre.length > 0);
      console.log('Genre Array:', genreArray);
  
      const trackUris = [];
      for (const genre of genreArray) {
        const searchResponse = await fetch(`https://api.spotify.com/v1/search?query=genre:${encodeURIComponent(genre)}&type=track&limit=5`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${spotifyToken}`
          }
        });
  
        if (!searchResponse.ok) {
          const errorData = await searchResponse.json();
          console.error('Error searching tracks:', errorData);
          throw new Error(`Error searching tracks: ${searchResponse.status}`);
        }
  
        const searchData = await searchResponse.json();
        const tracks = searchData.tracks.items.map(track => track.uri);
        trackUris.push(...tracks);
      }
  
      console.log('Track URIs:', trackUris);
  
      const trackResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uris: trackUris
        })
      });
  
      if (!trackResponse.ok) {
        const errorData = await trackResponse.json();
        console.error('Error adding tracks to playlist:', errorData);
        throw new Error(`Error adding tracks to playlist: ${trackResponse.status}`);
      }
  
      const trackData = await trackResponse.json();
      setPlaylistUrl(playlistData.external_urls.spotify);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }
  

  return (
    <>
      <div className="background"> </div>
      <div className="container">
        <h1 className="heading">Generate a Spotify Playlist</h1>
        <input
          id="moodInput"
          type="text"
          placeholder="How are you feeling today?"
          value={userDay}
          onChange={(e) => setUserDay(e.target.value)}
        />
        <button className="search" onClick={fetchData} disabled={loading}>
          {loading ? 'Generating...' : 'Generate'}
        </button>
        <div>
          <h2 className="suggested">Suggested Music Genres:</h2>
          <p>{genres}</p>
        </div>
        {playlistUrl && (
          <a href={playlistUrl} target="_blank" rel="noopener noreferrer">
            <button className="search">Open playlist on Spotify</button>
          </a>
        )}
        {!spotifyLoggedIn && (
          <button className="search" onClick={handleSpotifyLogin}>
            Log in with Spotify
          </button>
        )}
      </div>
    </>
  );
}

export default Home;
