import React, { useState } from 'react';
import API from '../api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      const res = await API.post('/api/auth/login', { username, passwordHash: password });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (e) {
      alert('Login failed');
    }
  };

  return (
    <div style={{ maxWidth:400, margin:'40px auto' }}>
      <h3>Login</h3>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
      <button onClick={submit}>Login</button>
      <p><a href="/register">Register</a></p>
    </div>
  );
}
