import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";
import AuthContext from "./authContext";

function AuthProvider({ children }) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await api.get("/auth/me");

        setUser(response.data.user);
      } catch {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreSession();
  }, []);

  async function register(values) {
    const response =
      await api.post(
        "/auth/register",
        values
      );

    localStorage.setItem(
      "token",
      response.data.token
    );

    setUser(response.data.user);

    return response.data.user;
  }

  async function login(values) {
    const response =
      await api.post(
        "/auth/login",
        values
      );

    localStorage.setItem(
      "token",
      response.data.token
    );

    setUser(response.data.user);

    return response.data.user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;