import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function SoftSkillsSection() {
  const [softSkills, setSoftSkills] = useState([]);
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchSoftSkills();
  }, [userId]);

  const fetchSoftSkills = () => {
    fetch(`http://localhost:5001/soft-skills/${userId}`)
      .then(res => res.json())
      .then(data => setSoftSkills(data))
      .catch(err => console.error('Failed to load soft skills', err));
  };

  const handleAdd = async () => {
    if (!newSoftSkill.trim()) {
      alert('Please enter a soft skill.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/soft-skills/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, soft_skill_name: newSoftSkill })
      });

      if (response.ok) {
        setSuccessMessage('Soft skill added successfully!');
        setNewSoftSkill('');
        fetchSoftSkills();
      } else {
        alert('Failed to add soft skill.');
      }
    } catch (error) {
      console.error('Error adding soft skill:', error);
      alert('Error adding soft skill.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this soft skill?')) return;

    try {
      const response = await fetch(`http://localhost:5001/soft-skills/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchSoftSkills();
      } else {
        alert('Failed to delete soft skill.');
      }
    } catch (error) {
      console.error('Error deleting soft skill:', error);
      alert('Error deleting soft skill.');
    }
  };

  return (
    <div className="section-container">
      <h2>Soft Skills</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      {softSkills.map((skill) => (
        <div key={skill.id} style={{ marginBottom: '10px' }}>
          <p>{skill.soft_skill_name}</p>
          <button
            style={{ backgroundColor: 'red', color: 'white', marginLeft: '10px' }}
            onClick={() => handleDelete(skill.id)}
          >
            Delete
          </button>
        </div>
      ))}

      <div style={{ marginTop: '20px' }}>
        <input
          type="text"
          placeholder="New Soft Skill"
          value={newSoftSkill}
          onChange={(e) => setNewSoftSkill(e.target.value)}
        />
        <button onClick={handleAdd} style={{ marginLeft: '10px' }}>
          Add Soft Skill
        </button>
      </div>

      <Link to="/dashboard" className="dashboard-button" style={{ marginTop: '20px', display: 'block' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}

export default SoftSkillsSection;
