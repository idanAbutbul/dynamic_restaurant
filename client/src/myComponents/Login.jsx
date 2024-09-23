import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setUser(data.user);

        // Redirect based on user role
        if (data.user.id === 1) {
          navigate('/dashboard');
        } else {
          navigate('/reservation');
        }
      } else {
        setLoginError(data.message || 'Failed to login');
      }
    } catch (error) {
      setLoginError('Network error');
    }
  };

  return (
    <>
    <div className='login-container'>

    <div className="login-form">
      <h2>Login To Your Account</h2>
      {loginError && <p >{loginError}</p>}
      <form onSubmit={handleSubmit} className="form-container">
        <div>
          <label>Email:</label>
          <input className="login-form-group" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div >
          <label>Password:</label>
          <input className="login-form-group" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className='login-form-button' type="submit">Login</button>
      </form>
    </div>
    </div>
   
    </>
  );
}

export default Login;
