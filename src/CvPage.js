import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function CvPage() {
  const [cv, setCv] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetch(`http://localhost:5001/cv/${userId}`)
      .then(res => res.json())
      .then(data => setCv(data));
  }, [userId]);

  const handleFakeClick = (e) => {
    e.preventDefault();
    alert('Download not available');
  };

  return (
    <div className="section-container" style={{ textAlign: 'center' }}>
      <h2>Your CV</h2>

      {cv && cv.file_path ? (
        <div style={{ marginTop: '20px' }}>
          <a
            href="#"
            onClick={handleFakeClick}
            style={{ textDecoration: 'underline', color: '#007bff', fontSize: '16px' }}
          >
            View Uploaded CV
          </a>
        </div>
      ) : (
        <p style={{ marginTop: '20px', color: 'grey' }}>
          No CV uploaded
        </p>
      )}

      <Link to="/dashboard" className="dashboard-button" style={{ marginTop: '30px', display: 'block' }}>
        Back to Dashboard
      </Link>
    </div>
  );
}

export default CvPage;
