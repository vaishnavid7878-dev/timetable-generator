import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all stored data (login + timetable data)
    localStorage.clear();

    // Redirect to login page
    navigate("/login");
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Logging out...</h2>
      <p>Please wait</p>
    </div>
  );
}