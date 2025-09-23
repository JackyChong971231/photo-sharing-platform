import React, { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";

const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null,
    id: null,
    name: null,
  });

  const login = async (credentials) => {
    // 1. Call your backend login API
    // const response = await fetch("/api/auth/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(credentials),
    // });

    // if (!response.ok) {
    //   throw new Error("Invalid login");
    // }
    

    // const { token } = await response.json();
    const dummy_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIzNDcsIm5hbWUiOiJUb20gSG9sbGFuZCIsInJvbGUiOiJwaG90b2dyYXBocGVyIiwiZXhwIjo0MTAyNDQ0ODAwfQ.dummy-signature";

    // 2. Save token
    localStorage.setItem("token", dummy_token);

    // 3. Decode token to get user info
    const decoded = jwtDecode(dummy_token);
    console.log(decoded)

    setUser({
      isAuthenticated: true,
      role: decoded.role,
      id: decoded.sub, // typical JWT user id claim
      name: decoded.name,
    });
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
