import React, { useState } from "react";
import "./Login.css"; // reuse same design
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("https://timetable-backend-sjr8.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      alert("Registration Successful");
      setTimeout(() => {
        navigate("/login");
      }, 200);
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <center>
          <h2>REGISTER</h2>

          {error && <p className="error">{error}</p>}

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br /><br />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br /><br />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />

          <button onClick={handleRegister}>Register</button>

          <p className="forgot-link">
            Already have account?{" "}
            <span 
                style={{color: "blue", cursor:"pointer"}}
                onClick={() => navigate("/login")} 
            >
              Sign In
            </span>
          </p>
        </center>

      </div>
    </div>
  );
}

export default Register;