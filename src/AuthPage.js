import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

function AuthPage({ setIsLoggedIn, setIsFirstLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register' && password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const url = mode === 'login' ? 'http://localhost:5001/login' : 'http://localhost:5001/register';
    const body = mode === 'login' ? { email, password } : { name, email, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);

        setIsLoggedIn(true);

        if (mode === 'register') {
          localStorage.setItem('firstLogin', 'true');
          setIsFirstLogin(true);
          navigate('/edit-profile');
        } else {
          localStorage.setItem('firstLogin', 'false');
          setIsFirstLogin(false);
          navigate('/dashboard');
        }
      } else {
        const error = await response.text();
        alert(error);
      }
    } catch (error) {
      console.error(error);
      alert('Request failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === 'register' && (
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        )}
        <button type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
      </form>
      <p>
        {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
        >
          Switch to {mode === 'login' ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

export default AuthPage;
