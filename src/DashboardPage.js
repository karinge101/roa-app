import React from 'react';
import { Link } from 'react-router-dom';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h1>RECORD OF ACHIEVEMENT</h1> 
      <p>Welcome to your Record of Achievement!</p>

      <div className="dashboard-buttons">
        <Link to="/profile" className="dashboard-button">View Profile</Link>
        <Link to="/achievements" className="dashboard-button">View Achievements</Link>
        <Link to="/skills" className="dashboard-button">View Skills</Link>
        <Link to="/soft-skills" className="dashboard-button">View Soft Skills</Link>
        <Link to="/cv" className="dashboard-button">View CV</Link>
        <Link to="/contact" className="dashboard-button">View Contact Info</Link>
      </div>
    </div>
  );
}

export default DashboardPage;

