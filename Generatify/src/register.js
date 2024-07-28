import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Form switcher
document.getElementById('showRegister').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('loginFormContainer').classList.add('hidden');
  document.getElementById('registerFormContainer').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('registerFormContainer').classList.add('hidden');
  document.getElementById('loginFormContainer').classList.remove('hidden');
});

// Register user
document.getElementById('registerForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('User registered successfully!');
      document.getElementById('registerFormContainer').classList.add('hidden');
      document.getElementById('loginFormContainer').classList.remove('hidden');
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});

// Login user
document.getElementById('loginForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert('User logged in successfully!');
      // Redirect or update UI as needed
    })
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
});