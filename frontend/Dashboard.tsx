import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [title, setTitle] = useState('');

  useEffect(()=>{ fetch(); }, []);
  const fetch = async () => {
    const res = await API.get('/api/projects');
    setProjects(res.data);
  };

  const create = async () => {
    if (!title.trim()) return;
    await API.post('/api/projects', { title });
    setTitle('');
    fetch();
  };

  const remove = async (id:number) => {
    await API.delete(`/api/projects/${id}`);
    fetch();
  };

  const logout = ()=>{ localStorage.removeItem('token'); window.location.href='/login'; };

  return (
    <div style={{ maxWidth:800, margin:'30px auto' }}>
      <h3>Projects</h3>
      <div style={{display:'flex', gap:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New project title" style={{flex:1, padding:8}} />
        <button onClick={create}>Create</button>
        <button onClick={logout}>Logout</button>
      </div>
      <ul>
        {projects.map(p => (
          <li key={p.id} style={{marginTop:10}}>
            <a href={'/projects/' + p.id}>{p.title}</a> {' '}
            <button onClick={()=>remove(p.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
