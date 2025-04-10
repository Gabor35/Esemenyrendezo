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

  // Fallbacks provided in case environment variables are missing
  const [apiUrl] = useState(
    () =>
      process.env.REACT_APP_API_URL ||
      "https://esemenyrendezo1.azurewebsites.net/api/"
  );
  const [ftpUrl] = useState(
    () =>
      process.env.REACT_APP_FTP_URL ||
      "https://esemenyrendezo.onrender.com/"
  );
  const [TokenUrl] = useState(
    () =>
      process.env.REACT_APP_GITHUB_TOKEN ||
      "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"
  );

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
        TokenUrl,
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

export default GlobalContext;
