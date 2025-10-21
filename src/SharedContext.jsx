import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { hashPassword } from './utils/common';

const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null,
    id: null,
    name: null,
  });

  const login = async (credentials) => {
    try {
      const email = credentials.email
      const password_hash = await hashPassword(credentials.password)

      const response = await fetch("http://127.0.0.1:8000/core/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password_hash: password_hash,
        }),
      });

      const response_body = await response.json();

      if (response.ok) {
        console.log("Logged in user:", response_body.email);
        localStorage.setItem("token", response_body.token);

        const decoded_jwt = jwtDecode(response_body.token);

        setUser({
          isAuthenticated: true,
          role: decoded_jwt.role,
          id: decoded_jwt.id, // typical JWT user id claim
          name: decoded_jwt.first_name+decoded_jwt.last_name,
          email: decoded_jwt.email,
        });
      } else {
        console.log("Login failed")
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser({ isAuthenticated: false, role: null, id: null, name: null });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Optionally check expiration
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            isAuthenticated: true,
            role: decoded.role,
            id: decoded.sub,
            name: decoded.name,
          });
        } else {
          logout(); // token expired
        }
      } catch (e) {
        console.error("Invalid token", e);
        logout();
      }
    }
  }, []);


  return (
    <SharedContext.Provider value={{
      user, setUser, login, logout
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => {
  return useContext(SharedContext);
};
