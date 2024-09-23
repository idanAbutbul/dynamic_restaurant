import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (registrationSuccess) {
      alert('Registration successful!');
      navigate('/login');
    }
  }, [registrationSuccess, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setRegistrationSuccess(true);
    } else {
      alert('Registration failed: ' + (data.error || 'An error occurred'));
    }
  };

  return (
    <>
    <div className='registration-container'>   
     <div className="registration-form">
      <h2>Register For New Account</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div >
          <label>Email:</label>
          <input className="register-form-group" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div >
          <label>Password:</label>
          <input className="register-form-group" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <button className='register-button' type="submit">Register</button>
      </form>
    </div>
    </div>
    </>
   
  );
}

export default Register;
