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

  // Alap API URL-ek
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

  // 🔄 GitHub repo lekérő függvény
  const getGitHubRepos = async () => {
    try {
      const response = await fetch(`https://github.com/Gabor35/Images`);
      if (!response.ok) {
        throw new Error("GitHub repo fetch failed");
      }
      const data = await response.json();
      console.log("GitHub repos:", data); // vagy set state
      return data;
    } catch (error) {
      console.error("Hiba a GitHub API hívás közben:", error);
      return null;
    }
  };

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
        getGitHubRepos, // << elérhető más komponensekből
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