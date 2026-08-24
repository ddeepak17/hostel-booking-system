import {
  useEffect,
  useState,
} from "react";

import api from "../api/axios";
import AuthContext from "./authContext";


function AuthProvider({
  children,
}) {
  const [
    user,
    setUser,
  ] =
    useState(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      () =>
        Boolean(
          localStorage.getItem(
            "token"
          )
        )
    );


  async function refreshUser() {
    const response =
      await api.get(
        "/auth/me"
      );

    setUser(
      response.data.user
    );

    return response.data.user;
  }


  useEffect(() => {
    let ignore =
      false;


    const token =
      localStorage.getItem(
        "token"
      );


    if (!token) {
      return;
    }


    api.get(
      "/auth/me"
    )
      .then(
        (
          response
        ) => {
          if (
            !ignore
          ) {
            setUser(
              response.data.user
            );
          }
        }
      )
      .catch(
        () => {
          localStorage.removeItem(
            "token"
          );

          if (
            !ignore
          ) {
            setUser(
              null
            );
          }
        }
      )
      .finally(
        () => {
          if (
            !ignore
          ) {
            setLoading(
              false
            );
          }
        }
      );


    return () => {
      ignore =
        true;
    };
  }, []);


  useEffect(() => {
    function handleExpiredSession() {
      setUser(null);
      setLoading(false);
    }

    window.addEventListener(
      "hostelhub:auth-expired",
      handleExpiredSession
    );

    return () => {
      window.removeEventListener(
        "hostelhub:auth-expired",
        handleExpiredSession
      );
    };
  }, []);


  async function register(
    values
  ) {
    const response =
      await api.post(
        "/auth/register",
        values
      );


    localStorage.setItem(
      "token",
      response.data.token
    );


    setUser(
      response.data.user
    );


    return response.data.user;
  }


  async function login(
    values
  ) {
    const response =
      await api.post(
        "/auth/login",
        values
      );


    localStorage.setItem(
      "token",
      response.data.token
    );


    setUser(
      response.data.user
    );


    return response.data.user;
  }


  function logout() {
    localStorage.removeItem(
      "token"
    );

    setUser(
      null
    );
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export default AuthProvider;
