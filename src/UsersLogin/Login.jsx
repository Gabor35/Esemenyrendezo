import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGlobalContext } from "../Context/GlobalContext";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Image } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";

// Import Firebase Auth and the sign in function
import { auth } from "../jsx/firebase2";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [avatar, setAvatar] = useState("");

  const {
    ftpUrl,
    loggedUser,
    setLoggedUser,
    loggedIn,
    setLoggedIn,
    setLoggedUserName
  } = useGlobalContext();

  const navigate = useNavigate();

  // When the component loads, check if a user is already logged in (stored in localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
      setLoggedUser(storedUser);
      setLoggedUserName(storedUser.name || storedUser.email);
      navigate("/events");
    }
  }, [navigate, loggedIn, setLoggedUser, setLoggedUserName]);

  // Handle user login using Firebase Auth
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !password) {
      alert("Please fill in both fields!");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const userObject = userCredential.user;
      // Build a normalized user object containing at least the uid
      const normalizedUser = {
        uid: userObject.uid,
        email: userObject.email,
        name: userObject.displayName || loginEmail,
        profilePicturePath: userObject.photoURL || ""
      };

      setLoggedUser(normalizedUser);
      setLoggedUserName(normalizedUser.name);
      setLoggedIn(true);
      // Store the user object in localStorage under "felhasz"
      localStorage.setItem("felhasz", JSON.stringify(normalizedUser));
      setUser(normalizedUser);
      if (normalizedUser.profilePicturePath) {
        setAvatar(`${ftpUrl}${normalizedUser.profilePicturePath}`);
      }
      navigate("/events");
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  // Handle user logout by signing out of Firebase Auth and removing local storage
  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem("felhasz");
      setUser(null);
      setLoggedUser(null);
      setLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out", error);
    }
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
              <h2 className="title">Welcome, {user.name}!</h2>
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
                Logout
              </Button>
            </Card.Body>
          ) : (
            <Card.Body>
              <h2 className="text-center title text-info">Login</h2>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Felhasználónév"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="input-field"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 login-btn"
                >
                  Login
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
