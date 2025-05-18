import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/login.css';
import '../styles/main.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-tokopedia-bg">
      <div className="login-tokopedia-container">
        <div className="login-tokopedia-logo">
          <h1>MiniPedia</h1>
        </div>
        <h2 className="login-tokopedia-title">Login</h2>
        <form className="login-tokopedia-form" onSubmit={handleSubmit}>
          <input
            type="email"
            className="login-tokopedia-input"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="login-tokopedia-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              className="login-tokopedia-input"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="login-tokopedia-showpass"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {error && <div className="login-tokopedia-error">{error}</div>}
          <button
            type="submit"
            className="login-tokopedia-btn"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Masuk'}
          </button>
        </form>
        <div className="login-tokopedia-footer">
          <span>Don't have an account?</span>
          <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;