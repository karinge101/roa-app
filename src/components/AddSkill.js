import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddSkill() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:5001/skills/${userId}`)
      .then(res => res.json())
      .then(data => setSkills(data))
      .catch(err => console.error('Failed to load skills', err));
  }, [userId]);

  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      alert('Please enter a skill.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/skills/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, skill_name: newSkill })
      });

      if (response.ok) {
        setSkills(prev => [...prev, { skill_name: newSkill, id: Date.now() }]);
        setNewSkill('');
        setSuccessMessage('Skill added successfully!');
      } else {
        alert('Failed to add skill.');
      }
    } catch (err) {
      console.error('Error adding skill', err);
      alert('Error adding skill.');
    }
  };

  const handleDeleteSkill = (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    fetch(`http://localhost:5001/skills/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          setSkills(skills.filter((s) => s.id !== id));
        } else {
          alert('Failed to delete skill.');
        }
      })
      .catch(err => console.error('Error deleting skill', err));
  };

  const handleSave = () => {
    navigate('/add-soft-skill');
  };

  return (
    <div className="section-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: '80%' }}></div>
      </div>

      <h2>Add Skills</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a skill e.g. Coding"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
        />
        <button onClick={handleAddSkill}>Add Skill</button>
      </div>

      <ul>
        {skills.map((skill) => (
          <li key={skill.id} style={{ marginBottom: '10px' }}>
            {skill.skill_name}
            <button
              style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
              onClick={() => handleDeleteSkill(skill.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <button style={{ marginTop: '20px' }} onClick={handleSave}>
        Save Changes
      </button>
    </div>
  );
}

export default AddSkill;
