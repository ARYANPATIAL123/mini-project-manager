import React, { useState } from 'react';
import API from '../api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = async () => {
    try {
      await API.post('/api/auth/register', { username, passwordHash: password });
      alert('Registered. Please login.');
      window.location.href = '/login';
    } catch (e:any) {
      alert('Register failed: ' + (e.response?.data?.message || ''));
    }
  };

  return (
    <div style={{ maxWidth:400, margin:'40px auto' }}>
      <h3>Register</h3>
      <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{width:'100%', padding:8, marginBottom:8}} />
      <button onClick={submit}>Register</button>
      <p><a href="/login">Login</a></p>
    </div>
  );
}
