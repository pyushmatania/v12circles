const axios = require('axios');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Remove the movies array and all OMDb/poster-fetching logic

app.use(cors());

app.get('/api/projects', (req, res) => {
  fs.readFile('./projects.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read projects.json' });
    } else {
      try {
        let projects = JSON.parse(data);
        // Filter out disabled projects if requested
        if (req.query.enabledOnly === 'true') {
          projects = projects.filter(p => !p.disabled);
        }
        // Support search by title
        if (req.query.title) {
          const q = req.query.title.toLowerCase();
          projects = projects.filter(p => p.title.toLowerCase().includes(q));
        }
        res.json(projects);
      } catch (e) {
        res.status(500).json({ error: 'Malformed projects.json' });
      }
    }
  });
});

app.use(express.json());

// Add new project
app.post('/api/projects', (req, res) => {
  fs.readFile('./projects.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read projects.json' });
    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Malformed projects.json' });
    }
    const newProject = req.body;
    if (!newProject.title || !newProject.type) {
      return res.status(400).json({ error: 'Missing required fields: title, type' });
    }
    newProject.id = String(Math.max(0, ...projects.map(p => parseInt(p.id, 10) || 0)) + 1);
    projects.push(newProject);
    fs.writeFile('./projects.json', JSON.stringify(projects, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to write projects.json' });
      res.status(201).json(newProject);
    });
  });
});

// Update existing project
app.put('/api/projects/:id', (req, res) => {
  fs.readFile('./projects.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read projects.json' });
    let projects = [];
    try {
      projects = JSON.parse(data);
    } catch (e) {
      return res.status(500).json({ error: 'Malformed projects.json' });
    }
    const idx = projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Project not found' });
    projects[idx] = { ...projects[idx], ...req.body };
    fs.writeFile('./projects.json', JSON.stringify(projects, null, 2), err2 => {
      if (err2) return res.status(500).json({ error: 'Failed to write projects.json' });
      res.json(projects[idx]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
