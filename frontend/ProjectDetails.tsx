import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [title, setTitle] = useState('');

  useEffect(()=>{ fetch(); }, []);
  const fetch = async () => {
    const res = await API.get('/api/projects');
    const found = res.data.find((p:any)=>p.id.toString()===id);
    setProject(found);
  };

  const addTask = async () => {
    if (!title.trim()) return;
    await API.post(`/api/projects/${id}/tasks`, { title });
    setTitle('');
    fetch();
  };

  const toggle = async (taskId:number) => {
    await API.put(`/api/projects/${id}/tasks/${taskId}`);
    fetch();
  };

  const remove = async (taskId:number) => {
    await API.delete(`/api/projects/${id}/tasks/${taskId}`);
    fetch();
  };

  if (!project) return <div style={{maxWidth:600, margin:'40px auto'}}>Loading...</div>;

  return (
    <div style={{ maxWidth:600, margin:'30px auto' }}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>

      <div style={{display:'flex', gap:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="New task title" style={{flex:1, padding:8}} />
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {project.tasks.map((t:any)=>(
          <li key={t.id} style={{marginTop:8}}>
            <input type="checkbox" checked={t.isCompleted} readOnly onClick={()=>toggle(t.id)} /> {' '}
            <span style={{textDecoration:t.isCompleted?'line-through':''}}>{t.title}</span>
            <button onClick={()=>remove(t.id)} style={{marginLeft:8}}>Delete</button>
          </li>
        ))}
      </ul>
      <p><a href="/dashboard">Back</a></p>
    </div>
  );
}
