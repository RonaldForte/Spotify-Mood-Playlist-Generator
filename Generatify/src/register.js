import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './Register.css';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function Register() {
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleFormSwitch = (showRegister) => {
    setIsRegister(showRegister);
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const email = event.target.elements['register-email'].value;
    const password = event.target.elements['register-password'].value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        alert('User registered successfully!');
        handleFormSwitch(false);
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const email = event.target.elements['login-email'].value;
    const password = event.target.elements['login-password'].value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate('/Home');
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  return (
    <div className="register-background">
      <div className="login-container">
        <div id="loginFormContainer" className={`form-container ${isRegister ? 'hidden' : ''}`}>
          <h2 className="header">Welcome to Generatify</h2>
          <form id="loginForm" onSubmit={handleLogin}>
            <h1>Login:</h1>
            <div className="form-group">
              <label htmlFor="login-email">Enter Email:</label>
              <input type="email" id="login-email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Enter Password:</label>
              <input type="password" id="login-password" name="password" required />
            </div>
            <button type="submit">Generatify Now!</button>
            <p>Don't have an account? <a href="#" onClick={() => handleFormSwitch(true)}>Register here</a></p>
          </form>
        </div>

        <div id="registerFormContainer" className={`form-container ${isRegister ? '' : 'hidden'}`}>
          <h2 className="header">Create an Account</h2>
          <form id="registerForm" onSubmit={handleRegister}>
            <h1>Register:</h1>
            <div className="form-group">
              <label htmlFor="register-email">Enter Email:</label>
              <input type="email" id="register-email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="register-password">Enter Password:</label>
              <input type="password" id="register-password" name="password" required />
            </div>
            <button type="submit">Create Account</button>
            <p><strong>Already have an account?</strong> <a href="#" onClick={() => handleFormSwitch(false)}>Login here</a></p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;