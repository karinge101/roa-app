import React, { useState } from 'react';

function UploadCV() {
  const [cvLink, setCvLink] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const userId = localStorage.getItem('userId');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cvLink.trim()) {
      alert('Please type your CV file name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/cv/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          filePath: `/uploads/${cvLink}`,
          uploadDate: new Date().toISOString().slice(0, 10)
        })
      });

      if (response.ok) {
        setSuccessMessage('CV uploaded successfully!');
        localStorage.setItem('firstLogin', 'false');
        setTimeout(() => window.location.href = '/dashboard', 1000);
      } else {
        alert('Failed to upload CV.');
      }
    } catch (error) {
      console.error('Failed to upload CV:', error);
      alert('Failed to upload CV.');
    }
  };

  return (
    <div className="section-container">
      <div className="progress-bar" style={{ marginBottom: '20px' }}>
        <div className="progress" style={{ width: '100%', height: '6px', backgroundColor: '#3498db', borderRadius: '5px' }}></div>
      </div>

      <h2>Upload Your CV</h2>

      {successMessage && (
        <div style={{ color: 'green', marginBottom: '10px' }}>{successMessage}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Upload your CV"
          value={cvLink}
          onChange={(e) => setCvLink(e.target.value)}
          required
        />
        <button type="submit" className="save-btn" style={{ marginTop: '20px' }}>
          Complete Setup
        </button>
      </form>
    </div>
  );
}

export default UploadCV;
