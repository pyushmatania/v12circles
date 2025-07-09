import React, { useEffect, useState } from 'react';
import { Project } from '../types/Project';

const API_URL = 'http://localhost:3001/api/projects';

export const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
      })
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{padding: 32}}>Loading projects...</div>;
  if (error) return <div style={{color: 'red', padding: 32}}>Error: {error}</div>;

  // Filter out disabled projects (or you can show them with a visual indicator)
  const enabledProjects = projects.filter(p => !p.disabled);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
      {enabledProjects.map(project => (
        <div key={project.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, width: 300, opacity: project.disabled ? 0.5 : 1, background: project.disabled ? '#f8d7da' : '#fff' }}>
          <img src={project.poster} alt={project.title} style={{ width: '100%', borderRadius: 4 }} loading="lazy" />
          <h2>{project.title}</h2>
          {project.disabled && <div style={{color: 'red', fontWeight: 'bold'}}>DISABLED</div>}
          <p><b>Type:</b> {project.type}</p>
          <p><b>Genre:</b> {project.genre}</p>
          <p><b>Director:</b> {project.director}</p>
          <p><b>Description:</b> {project.description}</p>
          <p><b>Tags:</b> {project.tags.join(', ')}</p>
          <p><b>Funding:</b> {project.fundedPercentage}% of ₹{project.targetAmount.toLocaleString()}</p>
          {project.trailer && (
            <a href={project.trailer} target="_blank" rel="noopener noreferrer">
              <button>Watch Trailer</button>
            </a>
          )}
        </div>
      ))}
      {enabledProjects.length === 0 && <div style={{padding: 32}}>No enabled projects to display.</div>}
    </div>
  );
}; 