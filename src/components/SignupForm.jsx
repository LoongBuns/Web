import React, { useState } from "react";
import { CiUser, CiLock } from "react-icons/ci";
import "../styles/Login.css";

export default function SignupForm({ onSubmit, error, FormHandle }) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.confirmPassword)
      return;
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    await onSubmit(formData);
  };

  return (
    <div className="login-card">
      <h2 className="login-title">Sign Up</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSignup}>
        <div className="input-wrapper">
          <CiUser className="input-icon" />
          <input
            type="text"
            name="username"
            placeholder="Enter your email"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <CiLock className="input-icon" />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-wrapper">
          <CiLock className="input-icon" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
      <p className="switch-form">
        Already have an account?{" "}
        <span onClick={() => FormHandle?.("login")} className="switch-link">
          Log in
        </span>
      </p>
    </div>
  );
}
