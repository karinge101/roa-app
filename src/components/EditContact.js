import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function EditContact() {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/contacts/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone })
      });

      if (response.ok) {
        setSuccessMessage('Contact info saved!');
        setTimeout(() => navigate('/add-skill'), 1000);
      } else {
        alert('Failed to save contact info.');
      }
    } catch (error) {
      console.error('Error saving contact info:', error);
      alert('Failed to save contact info.');
    }
  };

  return (
    <div className="section-container">
      <div className="progress-bar">
        <div className="progress" style={{ width: '60%' }}></div>
      </div>

      <h2>Edit Contact Info</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditContact;
