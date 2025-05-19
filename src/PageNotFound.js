import React from 'react';

function PageNotFound() {
  return (
    <div className="section-container">
      <h2>404 - Page Not Found</h2>
      <p>Sorry, the page you’re looking for doesn’t exist.</p>
      <br />
      <button onClick={() => window.location.href = '/dashboard'}>Back to Dashboard</button>
    </div>
  );
}

export default PageNotFound;
