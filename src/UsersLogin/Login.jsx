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
  // State management
  const [loginName, setLoginName] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");
  
  // Global context values
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

  // Check for logged-in user on component mount
  useEffect(() => {
    if (loggedIn) {
      alert(`${loggedUser.name} sikeresen bejelentkezett!`);
    }
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
      setAvatar(`${ftpUrl}${storedUser.profilePicturePath}`);
      navigate("/events");
    }
  }, [navigate, loggedIn]);

  // Handle user logout
  const handleLogout = async () => {
    if (user?.token) {
      try {
        await axios.post(`${apiUrl}Logout/${user.token}`);
        alert("Kijelentkezés sikeres!");
      } catch (error) {
        console.error("Hiba történt a kijelentkezés során:", error);
      }
    }
    localStorage.removeItem("felhasz");
    setUser(null);
    setAvatar("");
    alert("Sikeres kijelentkezés!");
    navigate("/login");
  };

  // Handle user login
  const handleLogin = async () => {
    try {
      // Get salt for the user
      const { data: salt } = await axios.post(`${apiUrl}Login/GetSalt/${loginName}`);
      
      // Create hash with password and salt
      const tmpHash = sha256(password + salt.toString());
      
      // Attempt login
      const loginResponse = await axios.post(`${apiUrl}Login`, { loginName, tmpHash });

      if (loginResponse.status === 200) {
        const userData = loginResponse.data;
        setLoggedUser(userData);
        setLoggedUserName(loginName);
        setLoggedIn(true);
        localStorage.setItem("felhasz", JSON.stringify(userData));
        setUser(userData);
        setAvatar(`${ftpUrl}${userData.profilePicturePath}`);
        navigate("/events");
        window.location.reload();
      } else {
        alert("Hiba történt a bejelentkezéskor!");
      }
    } catch (error) {
      alert("Hiba történt: " + error.message);
    }
  };

  // Render component
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
            // Logged in user view
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
            // Login form view
            <Card.Body>
              <h2 className="text-center title text-info">Bejelentkezés</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="email"
                    placeholder="E-mail"
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
                  onClick={handleLogin}
                >
                  Bejelentkezés
                </Button>
                <Button
                  variant="link"
                  className="w-100 mt-2 forgot-password-btn"
                  onClick={() => navigate("/ForgotPassword")}
                >
                  Elfelejtett jelszó?
                </Button>
              </Form>
            </Card.Body>
          )}
        </Card>
      </motion.div>
    </Container>
  );
};