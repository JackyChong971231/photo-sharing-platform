import React, { createContext, useContext, useEffect, useState, useReducer } from 'react';
import { jwtDecode } from "jwt-decode";
import { hashPassword } from './utils/common';
import { apiGateway, POST } from './apiCalls/apiMaster';
import { userLogin, userRegister, fetchUserInfoShort } from './apiCalls/photographer/authService';

const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  const initialUserInfoShort = {
    id: null,
    first_name: null,
    last_name: null,
    email: null,
    profile_picture: null,
    studios: []
  }

  const userInfoReducerShort = (state, action) => {
    switch (action.type) {
      case "SET_ALL":
        return { ...state, ...action.payload };

      case "UPDATE_FIELD":
        return { ...state, [action.field]: action.value };

      case "CLEAR":
        return initialUserInfoShort;

      default:
        return state;
    }
  }

  const [decodedToken, setDecodedToken] = useState({
    isAuthenticated: false,
    role: null,
    id: null,
    email: null,
  });
  const [userInfoShort, dispatchUserInfoShort] = useReducer(userInfoReducerShort, initialUserInfoShort);

  const register = async (formData) => {
    try {
      const {statusCode, body} = await userRegister(formData)

      if (statusCode === 201) {
        console.log("Registered and logged in user:", body.email);
        localStorage.setItem("token", body.token);

        const decoded_jwt = jwtDecode(body.token);
        console.log(decoded_jwt)

        setDecodedToken({
          isAuthenticated: true,
          role: decoded_jwt.role,
          id: decoded_jwt.user_id, // typical JWT user id claim
          email: decoded_jwt.email,
        });
        getUserInfoShort(decoded_jwt.user_id)
      } else {
        console.log("Registered and logged in failed")
      }
    } catch (error) {
      console.error("Error during register:", error);
    }
  }

  const login = async (credentials) => {
    try {
      const {statusCode, body} = await userLogin(credentials)

      if (statusCode === 200) {
        console.log("Logged in user:", body.email);
        localStorage.setItem("token", body.token);

        const decoded_jwt = jwtDecode(body.token);

        setDecodedToken({
          isAuthenticated: true,
          role: decoded_jwt.role,
          id: decoded_jwt.user_id, // typical JWT user id claim
          email: decoded_jwt.email,
        });
        getUserInfoShort(decoded_jwt.user_id)
        return null
      } else {
        console.log("Login failed")
        return "Wrong email/ password"
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setDecodedToken({ isAuthenticated: false, role: null, id: null, name: null });
    dispatchUserInfoShort({ type: "CLEAR" });


    // dispatchUserInfo({
    //   type: "UPDATE_FIELD",
    //   field: "profile_picture",
    //   value: newFileUrl
    // });
  };

  const getUserInfoShort = async (userId = null) => {
    try {
      const id = userId || decodedToken.id;
      if (!id) return;

      const { statusCode, body } = await fetchUserInfoShort(id);
      if (statusCode === 200) {
        dispatchUserInfoShort({ type: "SET_ALL", payload: body });
        // console.log(body);
      } else {
        logout()
        console.error("Failed to fetch userInfoShort:");
      }
    } catch (error) {
      console.error("Error in getUserInfoShort:", error);
      logout()
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Optionally check expiration
        if (decoded.exp * 1000 > Date.now()) {
          setDecodedToken({
            isAuthenticated: true,
            role: decoded.role,
            id: decoded.user_id,
            email: decoded.email,
          });
          getUserInfoShort(decoded.user_id)
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
      decodedToken, setDecodedToken, 
      userInfoShort, dispatchUserInfoShort, 
      register, login, logout
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => {
  return useContext(SharedContext);
};
