import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showForgot, setShowForgot] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

     try {
      const response = await fetch("https://timetable-backend-sjr8.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Login failed");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    navigate("/dashboard");

  } catch (err) {
    setError("Server error");
  }
 };


  const handleForgotPassword = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email first");
      return;
    }

    alert(`Password reset link sent to ${email}`);
    setShowForgot(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">

        {!showForgot ? (
          <>
            <center>
              <h2>LOGIN</h2>

              {/* Error message */}
              {error && <p className="error">{error}</p>}

              <br /><br />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <br /><br />

              <div className="password-wrapper" >
              
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
              }}
              /> 
              <span
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {/*showPassword ? "🙈" : "👁️"*/}
              </span>
            </div>
              <br /><br />

              <button onClick={handleLogin}>Login</button>
              <p
                className="forgot-link"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </p>
              <p className="forget-link">
                New User?{" "}
                <span
                  style={{ color: "blue", cursor: "pointer" }}
                  onClick={() => navigate("/register")}
                >
                  Register Here
                </span>                   
              </p>
            </center>
          </>
        ) : (
          <>
            <h2>Forgot Password</h2>

            <form onSubmit={handleForgotPassword}>
              <input
                type="email"
                placeholder="Enter registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br /><br />

              <button type="submit">Send Reset Link</button>
            </form>

            <p
              className="forgot-link"
              onClick={() => setShowForgot(false)}
            >
              Back to Login
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default Login;
