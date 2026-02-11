import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Profile Header */}
        <div style={styles.header}>
          <div style={styles.avatar}>
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>

        {/* Profile Details */}
         <div style={styles.details}>
          <div style={styles.row}>
            <span>Username</span>
            <strong>{user.name}</strong>
          </div>

          <div style={styles.row}>
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>

          <div style={styles.row}>
            <span>Role</span>
            <strong>Administrator</strong>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.edit}>Edit Profile</button>
          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Profile;

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
  },

  card: {
    width: "420px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    overflow: "hidden",
  },

  header: {
    backgroundColor: "#2F4F4F",
    color: "white",
    padding: "30px",
    textAlign: "center",
  },

  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    color: "#2F4F4F",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    fontWeight: "bold",
    margin: "0 auto 10px",
  },

  details: {
    padding: "20px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
  },

  edit: {
    padding: "10px 18px",
    backgroundColor: "#008080",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  logout: {
    padding: "10px 18px",
    backgroundColor: "#8B4513",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

