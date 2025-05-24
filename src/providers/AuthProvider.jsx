import React, { useReducer, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import authReducer from "../reducers/authReducer";
import {
  login as loginApi,
  register as registerApi,
  getCurrentUser as getUserApi,
} from "../services/authApi";

const initialState = {
  isAuthenticated: false,
  token: null,
  loading: true,
  error: null,
  user: null,
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch({ type: "LOGIN_SUCCESS", payload: token });
      getUserApi()
        .then((user) => {
          dispatch({ type: "SET_USER", payload: user });
        })
        .catch(() => {
          dispatch({ type: "LOGOUT" });
        });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  const login = async (credentials) => {
    dispatch({ type: "LOADING" });
    try {
      const response = await loginApi(credentials);
      localStorage.setItem("token", response.token);
      dispatch({ type: "LOGIN_SUCCESS", payload: response.token });

      const user = await getUserApi();
      dispatch({ type: "SET_USER", payload: user });

      return true;
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      return false;
    }
  };

  const register = async (credentials) => {
    dispatch({ type: "LOADING" });
    try {
      await registerApi(credentials);
      return true;
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
