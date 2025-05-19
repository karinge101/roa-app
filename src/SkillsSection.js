import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SkillsSection() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:5001/skills/${userId}`)
      .then(res => res.json())
      .then(data => setSkills(data));
  }, [userId]);

  const handleAdd = () => {
    if (!newSkill) return;
    fetch('http://localhost:5001/skills/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, skill_name: newSkill })
    }).then(() => {
      setSkills([...skills, { skill_name: newSkill }]);
      setNewSkill('');
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/skills/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setSkills(skills.filter(s => s.id !== id));
    });
  };

  return (
    <div className="section-container">
      <h2>Skills</h2>

      {skills.map((s) => (
        <div key={s.id} style={{ marginBottom: '12px' }}>
          <p>{s.skill_name}</p>
          <button onClick={() => handleDelete(s.id)}>Delete Skill</button>
        </div>
      ))}

      <input
        type="text"
        placeholder="New Skill"
        value={newSkill}
        onChange={e => setNewSkill(e.target.value)}
      />
      <button onClick={handleAdd} style={{ display: 'block', marginTop: '12px' }}>
        Add Skill
      </button>

      <Link to="/dashboard" className="dashboard-button" style={{ marginTop: '20px', display: 'block' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}

export default SkillsSection;
