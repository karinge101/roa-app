import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import AuthPage from './AuthPage';
import CvPage from './CvPage';
import ProfileSection from './ProfileSection';
import AchievementsSection from './AchievementsSection';
import SkillsSection from './SkillsSection';
import SoftSkillsSection from './SoftSkillsSection';
import ContactSection from './ContactSection';
import EditProfile from './components/EditProfile';
import AddAchievement from './components/AddAchievement';
import EditContact from './components/EditContact';
import AddSkill from './components/AddSkill';
import AddSoftSkill from './components/AddSoftSkill';
import UploadCV from './components/UploadCV';
import './App.css';

function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [burgerOpen, setBurgerOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const first = localStorage.getItem('firstLogin');
    if (userId) {
      setIsLoggedIn(true);
      setIsFirstLogin(first === 'true');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const toggleBurger = (e) => {
    e.stopPropagation();
    setBurgerOpen(!burgerOpen);
  };

  const closeBurger = () => {
    setBurgerOpen(false);
  };

  const hideNavbarOnLogin = location.pathname === '/';

  return (
    <div className="app-container" onClick={closeBurger}>
      {/* Navbar only if logged in and not on login page */}
      {!hideNavbarOnLogin && isLoggedIn && (
        <>
          <div className="navbar" onClick={(e) => e.stopPropagation()}>
            <div className="burger" onClick={toggleBurger}>
              &#9776;
            </div>
            <div className="nav-right">
              <span className="welcome-text">Welcome!</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
          </div>

          <div className={`side-menu ${burgerOpen ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <Link to="/dashboard" onClick={closeBurger}>Dashboard</Link>
            <Link to="/profile" onClick={closeBurger}>Profile</Link>
            <Link to="/achievements" onClick={closeBurger}>Achievements</Link>
            <Link to="/skills" onClick={closeBurger}>Skills</Link>
            <Link to="/soft-skills" onClick={closeBurger}>Soft Skills</Link>
            <Link to="/cv" onClick={closeBurger}>CV</Link>
            <Link to="/contact" onClick={closeBurger}>Contact</Link>
          </div>
        </>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<AuthPage setIsLoggedIn={setIsLoggedIn} setIsFirstLogin={setIsFirstLogin} />} />

        {isLoggedIn && isFirstLogin && (
          <>
            <Route path="/edit-profile" element={<EditProfile setIsFirstLogin={setIsFirstLogin} />} />
            <Route path="/add-achievement" element={<AddAchievement />} />
            <Route path="/edit-contact" element={<EditContact />} />
            <Route path="/add-skill" element={<AddSkill />} />
            <Route path="/add-soft-skill" element={<AddSoftSkill />} />
            <Route path="/upload-cv" element={<UploadCV />} />
            <Route path="*" element={<Navigate to="/edit-profile" />} />
          </>
        )}

        {isLoggedIn && !isFirstLogin && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfileSection />} />
            <Route path="/achievements" element={<AchievementsSection />} />
            <Route path="/skills" element={<SkillsSection />} />
            <Route path="/soft-skills" element={<SoftSkillsSection />} />
            <Route path="/cv" element={<CvPage />} />
            <Route path="/contact" element={<ContactSection />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}

        {/* Redirect users who are not logged in */}
        {!isLoggedIn && <Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </div>
  );
}

export default App;
