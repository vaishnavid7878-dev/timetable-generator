import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {

  const navigate = useNavigate();

  return (
    <div className="landing-container">

      <header className="landing-header">
        <h1>Smart Timetable Generator</h1>
        <p>Automated Timetable Scheduling For Educational Institutions</p>

        <div className="landing-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </header>

      <section className="landing-features">
        <h2>Project Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <h3>Teacher Management</h3>
            <p>Add and manage teachers easily.</p>
          </div>

          <div className="feature-card">
            <h3>Classroom Allocation</h3>
            <p>Organize classrooms and labs efficiently.</p>
          </div>

          <div className="feature-card">
            <h3>Subject Allocation</h3>
            <p>Assign subjects with proper constraints.</p>
          </div>

          <div className="feature-card">
            <h3>Automatic Timetable</h3>
            <p>Generate timetable instantly with smart algorithm.</p>
          </div>

        </div>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Smart Timetable Generator Project</p>
      </footer>

    </div>
  );
}

export default Landing;