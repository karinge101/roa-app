import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddAchievement() {
  const [achievements, setAchievements] = useState([]);
  const [newAchievement, setNewAchievement] = useState({ title: '', description: '', date: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5001/achievements/${userId}`)
      .then(res => res.json())
      .then(data => setAchievements(data))
      .catch(err => console.error('Failed to load achievements', err));
  }, [userId]);

  const handleAddAchievement = async () => {
    const { title, description, date } = newAchievement;
    if (!title.trim() || !description.trim() || !date.trim()) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await fetch('http://localhost:5001/achievements/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAchievement, userId })
      });
      setAchievements(prev => [...prev, { ...newAchievement, id: Date.now() }]);
      setNewAchievement({ title: '', description: '', date: '' });
      setSuccessMessage('Achievement added successfully!');
    } catch (err) {
      console.error('Error adding achievement', err);
      alert('Failed to add achievement.');
    }
  };

  const handleDeleteAchievement = (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) return;

    fetch(`http://localhost:5001/achievements/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) {
          setAchievements(achievements.filter((ach) => ach.id !== id));
        } else {
          console.error('Failed to delete achievement');
          alert('Failed to delete achievement.');
        }
      })
      .catch(err => console.error('Error deleting achievement', err));
  };

  const handleSave = () => {
    navigate('/edit-contact');
  };

  return (
    <div className="section-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: '40%' }}></div>
      </div>

      <h2>Add Achievements</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Achievement Ttile"
          value={newAchievement.title}
          onChange={(e) => setNewAchievement({ ...newAchievement, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newAchievement.description}
          onChange={(e) => setNewAchievement({ ...newAchievement, description: e.target.value })}
        />
        <input
          type="date"
          value={newAchievement.date}
          onChange={(e) => setNewAchievement({ ...newAchievement, date: e.target.value })}
        />
        <button onClick={handleAddAchievement}>Add Achievement</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        {achievements.map((achievement) => (
          <div key={achievement.id}>
            <h4>{achievement.title}</h4>
            <p>{achievement.description}</p>
            <small>{new Date(achievement.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
            <div style={{ marginTop: '8px' }}>
              <button onClick={() => handleDeleteAchievement(achievement.id)}>Delete Achievement</button>
            </div>
          </div>
        ))}
      </div>

      <button style={{ marginTop: '20px' }} onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default AddAchievement;
 