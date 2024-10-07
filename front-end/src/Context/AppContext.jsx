import React, { createContext, useState } from "react";
import axios from "axios";
export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const url = "https://task-manger-back-end.onrender.com";
  const [userData, setUserData] = useState([]);

  const gettingUserData = async () => {
    const newURL = `${url}/user/management/getting/all/user/data`;
    try {
      const response = await axios.get(newURL);
      if (response.data.success) {
        setUserData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const contextValues = {
    userData,
    gettingUserData,
    url,
  };

  return (
    <AppContext.Provider value={contextValues}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
