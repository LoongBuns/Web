import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { useDeviceContext } from "../context/DeviceContext";
import "../styles/Login.css";

export default function Login() {
  const [formType, setFormType] = useState("login");
  const { login, register, error } = useAuth();
  const { state } = useDeviceContext();
  const navigate = useNavigate();

  const waitForGroupTree = () =>
    new Promise((resolve) => {
      const check = () => {
        if (state.groups.length > 0 && !state.loading) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });

  const handleLogin = async (formData) => {
    const success = await login(formData);
    if (success) {
      await waitForGroupTree();
      const group = state.groups?.[0];
      const region = group?.regions?.[0];
      const device = region?.devices?.[0];

      if (device) {
        navigate(`/group/${group.id}`);
      } else if (region) {
        navigate(`/region/${region.id}`);
      } else if (group) {
        navigate(`/device/${device.id}`);
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleSignup = async (formData) => {
    const success = await register(formData);
    if (success) {
      alert("Registration successful. Please login.");
      setFormType("login");
    } else {
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      {formType === "login" ? (
        <LoginForm
          onSubmit={handleLogin}
          error={error}
          FormSwitcher={() => setFormType("signup")}
        />
      ) : (
        <SignupForm
          onSubmit={handleSignup}
          error={error}
          FormSwitcher={() => setFormType("login")}
        />
      )}
    </div>
  );
}
