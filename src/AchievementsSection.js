import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AchievementsSection() {
  const [achievements, setAchievements] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:5001/achievements/${userId}`)
      .then(res => res.json())
      .then(data => setAchievements(data));
  }, [userId]);

  const handleAdd = () => {
    if (!title || !description || !date) return;
    fetch('http://localhost:5001/achievements/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, title, description, date })
    }).then(() => {
      setAchievements([...achievements, { title, description, date }]);
      setTitle('');
      setDescription('');
      setDate('');
    });
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5001/achievements/${id}`, {
      method: 'DELETE'
    }).then(() => {
      setAchievements(achievements.filter(achievement => achievement.id !== id));
    });
  };

  return (
    <div className="section-container">
      <h2>Achievements</h2>

      {achievements.map((achievement) => (
        <div key={achievement.id} style={{ marginBottom: '12px' }}>
          <h4>{achievement.title}</h4>
          <p>{achievement.description}</p>
          <small>{new Date(achievement.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</small>
          <div style={{ marginTop: '8px' }}>
            <button onClick={() => handleDelete(achievement.id)}>Delete Achievement</button>
          </div>
        </div>
      ))}

      <input
        type="text"
        placeholder="Achievement Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ marginTop: '8px' }}
      />
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={{ marginTop: '8px' }}
      />

      <button onClick={handleAdd} style={{ display: 'block', marginTop: '12px' }}>
        Add Achievement
      </button>

      <Link to="/dashboard" className="dashboard-button" style={{ marginTop: '20px', display: 'block' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}

export default AchievementsSection;
