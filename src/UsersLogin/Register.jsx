import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import sha256 from "js-sha256";
import { Container, Card, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";

export const Register = () => {
  const [formData, setFormData] = useState({
    felhasznaloNev: "",
    jelszo: "",
    teljesNev: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const generateSalt = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let salt = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      salt += characters.charAt(randomIndex);
    }
    return salt;
  };

  const handleSubmit = async () => {
    const salt = generateSalt(64);
    const hashedPassword = sha256(formData.jelszo + salt);

    const requestBody = {
      id: 0,
      felhasznaloNev: formData.felhasznaloNev,
      teljesNev: formData.teljesNev,
      salt,
      hash: hashedPassword,
      email: formData.email,
      jogosultsag: 1,
      aktiv: 0,
      regisztracioDatuma: new Date().toISOString(),
      fenykepUtvonal: "default.jpg",
    };

    try {
      const response = await axios.post("https://esemenyrendezo1.azurewebsites.net/api/Regisztracio", requestBody);
      alert(response.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Hiba történt a regisztráció során!");
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
          <Card.Body>
            <h2 className="text-center title text-info">Regisztráció</h2>
            <Form>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="felhasznaloNev"
                  placeholder="Felhasználónév"
                  value={formData.felhasznaloNev}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="jelszo"
                  placeholder="Jelszó"
                  value={formData.jelszo}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="teljesNev"
                  placeholder="Teljes név"
                  value={formData.teljesNev}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </Form.Group>
              <Button variant="primary" className="w-100 register-btn" onClick={handleSubmit}>
                Regisztráció
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </motion.div>
    </Container>
  );
};
