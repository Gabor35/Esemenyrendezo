import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalContext } from "../Context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import axios from "axios";
import { sha256 } from "js-sha256";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

const Login = () => {
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");

  const {
    ftpUrl,
    apiUrl,
    loggedUser,
    setLoggedUser,
    loggedIn,
    setLoggedIn,
    setLoggedUserName
  } = useGlobalContext();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedUser(storedUser);
      setLoggedUserName(storedUser.name || storedUser.loginName);
      navigate("/events");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginName || !password) {
      alert("Kérjük, töltse ki mindkét mezőt!");
      return;
    }

    try {
      const { data: salt } = await axios.post(`${apiUrl}Login/GetSalt/${loginName}`);
      const tmpHash = sha256(password + salt.toString());

      const { data: userData } = await axios.post(`${apiUrl}Login`, {
        loginName,
        tmpHash
      });

      const normalizedUser = {
        ...userData,
        name: userData.name || loginName,
        profilePicturePath: userData.profilePicturePath || ""
      };

      setLoggedUser(normalizedUser);
      setLoggedUserName(normalizedUser.name);
      setLoggedIn(true);
      localStorage.setItem("felhasz", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      if (normalizedUser.profilePicturePath) {
        setAvatar(`${ftpUrl}${normalizedUser.profilePicturePath}`);
      }
      navigate("/events");
    } catch (error) {
      alert("Hiba történt: " + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("felhasz");
    setUser(null);
    setLoggedUser(null);
    setLoggedIn(false);
    navigate("/login");
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
              <Button variant="danger" onClick={handleLogout} className="w-100 logout-btn">
                Kijelentkezés
              </Button>
            </Card.Body>
          ) : (
            <Card.Body>
              <h2 className="text-center title text-info">Bejelentkezés</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
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
                <Button variant="primary" type="submit" className="w-100 login-btn">
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

export default Login;
