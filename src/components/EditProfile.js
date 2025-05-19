import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditProfile() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [university, setUniversity] = useState('');
  const [degree, setDegree] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, description, university, degree, graduation_year: graduationYear })
      });
      if (response.ok) {
        setSuccessMessage('Profile saved successfully!');
        setTimeout(() => navigate('/add-achievement'), 1000);
      } else {
        alert('Failed to save profile.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile.');
    }
  };

  return (
    <div className="section-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: '20%' }}></div>
      </div>

      <h2>Edit Profile</h2>

      {successMessage && <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Profile Title: IT Specialist" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Profile Description: I am an IT Specialist" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="text" placeholder="University/School: Birmingham City University" value={university} onChange={(e) => setUniversity(e.target.value)} required />
        <input type="text" placeholder="Degree/Qualification: B.Sc. Computer Science" value={degree} onChange={(e) => setDegree(e.target.value)} required />
        <input type="text" placeholder="Graduation/Qualification Year: 2025" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditProfile;
