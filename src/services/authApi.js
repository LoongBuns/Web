const BASE_URL = "https://smart-blinds-ta33o.ondigitalocean.app";

export const login = async ({ username, password }) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "Not logged in");
  }

  return { token: text };
};

export const register = async ({ username, password }) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: username, password }),
  });

  const text = await response.text();

  if (!response.ok) {
    if (response.status === 409) {
      throw new Error("Email already exists. Please login.");
    }
    throw new Error(text || "Registration failed");
  }

  return { token: text };
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) throw new Error("Not Login");

  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to obtain user information");
  }

  return await response.json();
};
