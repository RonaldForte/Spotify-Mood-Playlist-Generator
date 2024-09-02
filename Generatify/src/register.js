import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import './register.css';

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
