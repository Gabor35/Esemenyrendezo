import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button } from "react-bootstrap";

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    profilePicture: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalData, setModalData] = useState({ field: "", value: "" });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://esemenyrendezo1.azurewebsites.net/api/user/profile"
        );
        setProfile(response.data);
      } catch (error) {
        console.error("Hiba a profil betöltésekor:", error);
        setError("Nem sikerült betölteni a profilt.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put("https://esemenyrendezo1.azurewebsites.net/api/user/profile", profile);
    } catch (error) {
      console.error("Hiba a mentéskor:", error);
      setError("Nem sikerült menteni a profiladatokat.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Biztosan törölni szeretnéd a fiókodat?")) {
      try {
        await axios.delete("https://esemenyrendezo1.azurewebsites.net/api/user/profile");
        alert("Fiók törölve");
      } catch (error) {
        console.error("Hiba a fiók törlésekor:", error);
        setError("Nem sikerült törölni a fiókot.");
      }
    }
  };

  const handleOpenModal = (field, value) => {
    setModalData({ field, value });
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setModalData((prev) => ({ ...prev, value: e.target.value }));
  };

  const handleModalSave = () => {
    setProfile((prev) => ({ ...prev, [modalData.field]: modalData.value }));
    setShowModal(false);
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "transparent" }}
    >
      <motion.div
        className="card shadow-lg p-4 bg-white text-dark"
        style={{ width: "500px" }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 className="text-center mb-4">🛠 Profil Beállítások</motion.h2>

        {profile.profilePicture && (
          <div className="text-center mb-3">
            <img
              src={profile.profilePicture}
              alt="Profilkép"
              className="rounded-circle border border-light shadow"
              width="80"
              height="80"
            />
          </div>
        )}

        {[
          { label: "Név", name: "name" },
          { label: "Telefonszám", name: "phone" },
          { label: "Profilkép", name: "profilePicture" },
          { label: "Jelszó", name: "password" },
          { label: "Technikai probléma jelentése", name: "technikaiproblema" },
        ].map(({ label, name }) => (
          <motion.div key={name} className="mb-3">
            <Button
              variant="success"
              className="w-100"
              onClick={() => handleOpenModal(name, profile[name])}
            >
              {label} módosítása
            </Button>
          </motion.div>
        ))}
        <motion.h2 className="text-center mb-4">Biztonság</motion.h2>

      </motion.div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Módosítás</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            value={modalData.value}
            onChange={handleModalChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Mégse
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            Mentés
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfileSettings;
