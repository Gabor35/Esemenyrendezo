import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalContext } from "../Context/GlobalContext";
import axios from "axios";
import { sha256 } from "js-sha256";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

export const Login = () => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");

  const {
    apiUrl,
    ftpUrl,
    loggedUser,
    setLoggedUser,
    loggedIn,
    setLoggedIn,
    setLoggedUserName
  } = useGlobalContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) {
      alert(loggedUser?.name || loginName + "sikeresen bejelentkezett!");
    }
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
      setAvatar(`${ftpUrl}${storedUser.profilePicturePath}`);
      navigate("/events");
    }
  }, [navigate, loggedIn]);

  const handleLogout = async () => {
    if (user?.token) {
      try {
        await axios.post(`${apiUrl}Logout/${user.token}`);
        console.log("Kijelentkezés sikeres!");
      } catch (error) {
        console.error("Hiba történt a kijelentkezés során:", error);
      }
    }
    localStorage.removeItem("felhasz");
    setUser(null);
    setAvatar("");
    console.log("Sikeres kijelentkezés!");
    navigate("/login");
  };

  const handleLogin = async () => {
    try {
      if (!loginName || !password) {
        alert("Kérjük, töltse ki mindkét mezőt!");
        return;
      }

      const { data: salt } = await axios.post(`${apiUrl}Login/GetSalt/${loginName}`);
      const tmpHash = sha256(password + salt.toString());

      const { data: userData } = await axios.post(`${apiUrl}Login`, {
        loginName,
        tmpHash
      });

      if (userData) {
        const normalizedUser = {
          ...userData,
          name:
            userData.name ||
            userData.Name ||
            userData.teljesNev ||
            userData.felhasznaloNev ||
            loginName,
          profilePicturePath:
            userData.profilePicturePath ||
            userData.ProfilePicturePath ||
            userData.fenykepUtvonal ||
            ''
        };

        setLoggedUser(normalizedUser);
        setLoggedUserName(normalizedUser.name);
        setLoggedIn(true);
        localStorage.setItem("felhasz", JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setAvatar(`${ftpUrl}${normalizedUser.profilePicturePath}`);
        navigate("/events");
      }
    } catch (error) {
      alert("Hiba történt: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLoginWithRefresh = () => {
    handleLogin();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-100 d-flex justify-content-center align-items-center"
      >
        <Card className="glass-card p-4">
          {user ? (
            <Card.Body className="text-center">
              <h2 className="title">Üdv, {user.name}!</h2>
              {avatar && (
                <Image
                  src={avatar}
                  roundedCircle
                  width="120"
                  height="120"
                  className="profile-avatar"
                />
              )}
              <Button
                variant="danger"
                onClick={handleLogout}
                className="w-100 logout-btn"
              >
                Kijelentkezés
              </Button>
            </Card.Body>
          ) : (
            <Card.Body>
              <h2 className="text-center title text-info">Bejelentkezés</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="Felhasználónév"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="input-field"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Jelszó"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  className="w-100 login-btn"
                  onClick={handleLoginWithRefresh}
                >
                  Bejelentkezés
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};
