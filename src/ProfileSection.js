import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function ProfileSection() {
  const [profile, setProfile] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = () => {
    fetch(`http://localhost:5001/profile/${userId}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setSuccessMessage('Profile loaded successfully!');
      })
      .catch(err => {
        console.error('Failed to fetch profile', err);
        setSuccessMessage('');
      });
  };

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="section-container">
      <h2>My Profile</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      <p><strong>Title:</strong> {profile.title || 'No title yet'}</p>
      <p><strong>Description:</strong> {profile.description || 'No description yet'}</p>
      <p><strong>University:</strong> {profile.university || 'No university added'}</p>
      <p><strong>Degree:</strong> {profile.degree || 'No degree added'}</p>
      <p><strong>Graduation Year:</strong> {profile.graduation_year || 'No graduation year added'}</p>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/dashboard">
          <button>Back to Dashboard</button>
        </Link>
      </div>
    </div>
  );
}

export default ProfileSection;
