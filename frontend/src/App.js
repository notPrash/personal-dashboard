import React, { useState, useEffect } from 'react';
import { signup, login, me } from './api';
import './App.css';

function App() {
  const [mode, setMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));

  useEffect(() => {
    if (token && !user) {
      me(token)
        .then(u => {
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => logout());
    }
  }, [token]);

  const handleSignup = async (data) => {
    await signup(data);
    alert('Signup successful — please login');
    setMode('login');
  };

  const handleLogin = async (data) => {
    const res = await login(data);
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    setToken(res.token);
    setUser(res.user);
    setMode('home');
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setMode('login');
  };

  if (!token || !user) {
    return (
      <div className="auth-container">

        <div className="auth-card fadeIn">

          <h2 className="title">{mode === 'login' ? 'Welcome Back 👋' : 'Create Account 🚀'}</h2>
          <p className="subtitle">
            {mode === 'login'
              ? 'Login to continue to your dashboard'
              : 'Sign up to start using your account'}
          </p>

          {mode === 'login' ? (
            <LoginForm
              onLogin={handleLogin}
              switchToSignup={() => setMode('signup')}
            />
          ) : (
            <SignupForm
              onSignup={handleSignup}
              switchToLogin={() => setMode('login')}
            />
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card fadeIn">
        <h2 className="title">Welcome, {user.username} 🎉</h2>
        <p className="subtitle">You are logged in as {user.email}</p>
        <button className="btn logout-btn" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onLogin({ email, password }).catch(err =>
          alert(err.response?.data?.message || 'Login failed')
        );
      }}
    >
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="btn primary-btn" type="submit">Login</button>

      <p className="switch-text">
        Don’t have an account? <span onClick={switchToSignup}>Signup</span>
      </p>
    </form>
  );
}

function SignupForm({ onSignup, switchToLogin }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <form
      className="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSignup({ username, email, password }).catch(err =>
          alert(err.response?.data?.message || 'Signup failed')
        );
      }}
    >
      <input
        className="input"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />

      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button className="btn primary-btn" type="submit">Signup</button>

      <p className="switch-text">
        Already have an account? <span onClick={switchToLogin}>Login</span>
      </p>
    </form>
  );
}

export default App;
