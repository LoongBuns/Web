// src/components/LoginForm.jsx
import React, { useState } from "react";
import { CiUser, CiLock } from "react-icons/ci";
import "../styles/Login.css";

export default function LoginForm({ onSubmit, error, FormHandle }) {
  const [User, setUser] = useState("");
  const [Password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!User || !Password) return;
    await onSubmit({ username: User, password: Password });
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleLogin}>
        <div className="input-wrapper">
          <CiUser className="input-icon" />
          <input
            type="text"
            placeholder="Enter your email or user email"
            value={User}
            onChange={(e) => setUser(e.target.value)}
            required
          />
        </div>

        <div className="input-wrapper">
          <CiLock className="input-icon" />
          <input
            type="password"
            placeholder="Enter your password"
            value={Password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Sign In
        </button>
      </form>
      <p className="switch-form">
        Don't have an account?{" "}
        <span onClick={() => FormHandle?.("signup")} className="switch-link">
          Sign up
        </span>
      </p>
    </div>
  );
}
