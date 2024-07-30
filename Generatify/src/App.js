import React, { useState, useEffect } from 'react';
import './App.css';

//const openApiKey = "Enter OpenAI API Key Here";
const openUrl = "https://api.openai.com/v1/chat/completions";

function App() {
  const [genres, setGenres] = useState("");
  const [userDay, setUserDay] = useState("");

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
    <div className="container">
      <h1 className="heading">Generate a Spotify Playlist</h1>
      <input
        id="moodInput"
        className="input"
        type="text"
        placeholder="How are you feeling today?"
        value={userDay}
        onChange={(e) => setUserDay(e.target.value)}
      />
      <button id="searchButton" className="search" onClick={fetchData}>
        Search
      </button>
      <div>
        <h2>Suggested Music Genres:</h2>
        <p>{genres}</p>
      </div>
    </div>
  );
}

export default App;