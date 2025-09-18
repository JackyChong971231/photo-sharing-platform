import React, { createContext, useContext, useEffect, useState } from 'react';


const SharedContext = createContext();

export const SharedProvider = ({ children }) => {
  // dummy
  const [dummyStr, setDummyStr] = useState('dummy hihihi');

  // website metadata
  const [role, setRole] = useState('photographer');
  const [user, setUser] = useState({
    isAuthenticated: true, // Replace with actual authentication logic
    role: 'photographer', // Replace with dynamic role ('photographer' or 'customer')
  });

  // User Info
  const [userDetail, setUserDetail] = useState(() => {
    const savedData = localStorage.getItem('userDetail');
    if (savedData) {
      try{
        const jsonParsedSavedData = JSON.parse(savedData);
        return jsonParsedSavedData
      }
      catch {
        return {}
      }
    } else {
      return {}
    }
    // return savedData? JSON.parse(savedData): {};
  });
  const [jwtToken, setJwtToken] = useState(() => {
    const savedData = localStorage.getItem('jwtToken');
    if (savedData) {
      return savedData
    } else {
      return ""
    }
  })

  useEffect(() => {
    localStorage.setItem('userDetail', JSON.stringify(userDetail));
  },[userDetail])

  useEffect(() => {
    localStorage.setItem('jwtToken', jwtToken);
  },[jwtToken])


  return (
    <SharedContext.Provider value={{
      role, setRole,
      user, setUser,

      userDetail, setUserDetail,
      jwtToken, setJwtToken,
      dummyStr, setDummyStr
      }}
    >
      {children}
    </SharedContext.Provider>
  );
};

export const useSharedContext = () => {
  return useContext(SharedContext);
};
