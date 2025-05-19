import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddSoftSkill() {
  const [softSkills, setSoftSkills] = useState([]);
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5001/soft-skills/${userId}`)
      .then(res => res.json())
      .then(data => setSoftSkills(data))
      .catch(err => console.error('Failed to load soft skills:', err));
  }, [userId]);

  const handleAddSoftSkill = async () => {
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
        setSoftSkills(prev => [...prev, { soft_skill_name: newSoftSkill, id: Date.now() }]);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add soft skill.');
      }
    } catch (err) {
      console.error('Error adding soft skill:', err);
      alert('Error adding soft skill.');
    }
  };

  const handleDeleteSoftSkill = (id) => {
    if (!window.confirm('Are you sure you want to delete this soft skill?')) return;

    fetch(`http://localhost:5001/soft-skills/${id}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setSoftSkills(prev => prev.filter(skill => skill.id !== id));
        } else {
          alert('Failed to delete soft skill.');
        }
      })
      .catch(err => console.error('Error deleting soft skill:', err));
  };

  const handleSave = () => {
    navigate('/upload-cv');
  };

  return (
    <div className="section-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: '80%' }}></div>
      </div>

      <h2>Add Soft Skills</h2>

      {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Enter a soft skill"
          value={newSoftSkill}
          onChange={(e) => setNewSoftSkill(e.target.value)}
        />
        <button onClick={handleAddSoftSkill}>Add Soft Skill</button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {softSkills.map((skill) => (
          <li key={skill.id} style={{ marginBottom: '10px' }}>
            {skill.soft_skill_name} 
            <button
              style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
              onClick={() => handleDeleteSoftSkill(skill.id)}
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

export default AddSoftSkill;
