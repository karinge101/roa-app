import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ContactSection() {
  const [contact, setContact] = useState({ email: '', phone: '' });
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      fetchContactInfo();
    }
  }, [userId]);

  const fetchContactInfo = () => {
    fetch(`http://localhost:5001/contacts/${userId}`)
      .then(res => res.json())
      .then(data => {
        setContact({
          email: data.email || '',
          phone: data.phone || ''
        });
      })
      .catch(error => {
        console.error('Failed to fetch contact info:', error);
      });
  };

  const handleSave = () => {
    if (!contact.email || !contact.phone) {
      alert('Please fill in both email and phone number.');
      return;
    }

    fetch(`http://localhost:5001/contacts/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: contact.email,
        phone: contact.phone
      })
    })
    .then(res => {
      if (res.ok) {
        alert('Contact info saved!');
        fetchContactInfo();
      } else {
        alert('Failed to save contact info');
      }
    })
    .catch(error => {
      console.error('Failed to save contact info:', error);
      alert('Error saving contact info');
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="section-container">
      <h2>Contact Info</h2>

      <p><strong>Email:</strong> {contact.email || 'No email set'}</p>
      <p><strong>Phone:</strong> {contact.phone || 'No phone set'}</p>

      <input
        name="email"
        type="email"
        placeholder="Update email"
        value={contact.email}
        onChange={handleChange}
        style={{ marginTop: '8px' }}
      />
      <input
        name="phone"
        type="text"
        placeholder="Update phone"
        value={contact.phone}
        onChange={handleChange}
        style={{ marginTop: '8px' }}
      />

      <button onClick={handleSave} style={{ display: 'block', marginTop: '12px' }}>
        Save Changes
      </button>

      <Link to="/dashboard" className="dashboard-button" style={{ marginTop: '20px', display: 'block' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}

export default ContactSection;
