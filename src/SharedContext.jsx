import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { hashPassword } from './utils/common';
import { apiGateway, POST } from './apiCalls/apiMaster';

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

      // const response = await fetch("http://127.0.0.1:8000/core/login/", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     email,
      //     password_hash: password_hash,
      //   }),
      // });
      const request_body = {
        email,
        password_hash: password_hash,
      }
      const {statusCode, body} = await apiGateway(POST, '/core/login/', request_body)

      console.log(statusCode, body)

      if (statusCode === 200) {
        console.log("Logged in user:", body.email);
        localStorage.setItem("token", body.token);

        const decoded_jwt = jwtDecode(body.token);
        console.log(decoded_jwt)

        setUser({
          isAuthenticated: true,
          role: decoded_jwt.role,
          id: decoded_jwt.user_id, // typical JWT user id claim
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
            id: decoded.user_id,
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
