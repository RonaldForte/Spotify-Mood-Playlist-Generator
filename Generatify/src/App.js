import logo from './logo.svg';
import './App.css';

//const CLIENT_ID = %PUT_ID_HERE%
//const SECRET_ID = %PUT_ID_HERE%

function App() {


  return(
    <div class="container">
      <h1 class="heading">Generate a Spotify Playlist</h1>
      <input id="moodInput" class="input" type="text" placeholder="Enter your mood"></input>
      <button id="searchButton" class="search">Search</button>
    </div>
  );
}

export default App;
