// src/Context/GlobalContext.jsx
import { createContext, useContext, useState } from "react";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState({
    name: "",
    email: "",
    permission: 0,
    profilePicturePath: "",
    token: "",
    refreshToken: "",
  });
  const [loggedIn, setLoggedIn] = useState(false);
  const [loggedUserName, setLoggedUserName] = useState("");
  const [apiUrl] = useState(() => process.env.REACT_APP_API_URL || "");
  const [ftpUrl] = useState(() => process.env.REACT_APP_FTP_URL || "");

  return (
    <GlobalContext.Provider
      value={{
        loggedUser,
        setLoggedUser,
        loggedIn,
        setLoggedIn,
        loggedUserName,
        setLoggedUserName,
        apiUrl,
        ftpUrl,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};
