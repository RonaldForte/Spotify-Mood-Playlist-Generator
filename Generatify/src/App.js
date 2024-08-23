import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}

function Home() {
  const [genres, setGenres] = React.useState("");
  const [userDay, setUserDay] = React.useState("");

  const openUrl = "https://api.openai.com/v1/chat/completions";
  const openApiKey = process.env.REACT_APP_OPENAI_API_KEY;

  async function fetchData() {
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
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      const fetchedGenres = data.choices[0]?.message?.content.trim() || "No genres found.";
      setGenres(fetchedGenres);
      console.log("Suggested music genres:", fetchedGenres);

    } catch (error) {
      console.error('Error fetching data:', error);
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
        <button className="search" onClick={fetchData}>
          Generate 
        </button>
        <div>
          <h2 className="suggested">Suggested Music Genres:</h2>
          <p>{genres}</p>
        </div>
      </div>
    </>
  );
}

export default App;