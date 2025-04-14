import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { useGlobalContext } from '../Context/GlobalContext';
import { motion } from 'framer-motion';
import heartFillIcon from '../pictures/heart-fill.svg';

export const Saved = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { apiUrl } = useGlobalContext();

  const userData = JSON.parse(localStorage.getItem('felhasz'));
  const token = userData ? userData.token : null;

  useEffect(() => {
    const fetchSavedEvents = async () => {
      setLoading(true);
      try {
        if (!token) {
          setError('Be kell jelentkezned a mentett események megtekintéséhez');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${apiUrl}Reszvetel/saved/${token}`);
        const formatted = response.data.map(event => ({
          ...event,
          Datum: new Date(event.datum),
          Kepurl: `https://images-0prm.onrender.com/${event.kepurl}`, // Normalize URL
          Cime: event.cime,
          Helyszin: event.helyszin,
          Leiras: event.leiras
        }));
        setSavedEvents(formatted);
        setError(null);
      } catch (err) {
        setError('Nem sikerült lekérni a mentett eseményeket: ' + (err.response?.data || err.message));
        setSavedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [token, apiUrl]);

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleUnsaveEvent = async (eventId, e) => {
    e.preventDefault();
    if (!token) {
      setError('Be kell jelentkezned az esemény eltávolításához');
      return;
    }
    try {
      await axios.delete(`${apiUrl}Reszvetel/${token}/${eventId}`);
      setSavedEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      setError('Nem sikerült eltávolítani az eseményt: ' + (err.response?.data || err.message));
    }
  };

  if (loading) {
    return <div className="container mt-4">Mentett események betöltése...</div>;
  }

  if (error) {
    return <div className="container mt-4 alert alert-danger">{error}</div>;
  }

  if (savedEvents.length === 0) {
    return (
      <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ height: "100vh", fontSize: "30px" }}>
        <div className="text-white">Nincsenek mentések!</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {savedEvents.map((event, index) => (
          <motion.div
            className="col-md-4"
            key={event.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <div className="card mb-3">
              {event.Kepurl && (
                <img
                  src={event.Kepurl}
                  className="card-img-top"
                  alt={event.Cime}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{event.Cime}</h5>
                <p className="card-text">Dátum: {new Date(event.Datum).toLocaleString()}</p>
                <p className="card-text">Helyszín: {event.Helyszin}</p>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => handleShowDetails(event)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Részletek
                </motion.button>
                <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}
                    onClick={(e) => handleUnsaveEvent(event.id, e)}
                  >
                    <motion.img
                      src={heartFillIcon}
                      alt="Unsave"
                      style={{ width: '20px', verticalAlign: 'middle' }}
                      whileHover={{ scale: 1.2 }}
                    />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.Cime}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent?.Kepurl && (
            <img
              src={selectedEvent.Kepurl}
              alt={selectedEvent.Cime}
              className="img-fluid mb-3"
              style={{ width: '100%', objectFit: 'cover' }}
            />
          )}
          <p><strong>Dátum:</strong> {new Date(selectedEvent?.Datum).toLocaleString()}</p>
          <p><strong>Helyszín:</strong> {selectedEvent?.Helyszin}</p>
          <p><strong>Leírás:</strong> {selectedEvent?.Leiras}</p>
        </Modal.Body>
        <Modal.Footer>
          <motion.button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Bezárás
          </motion.button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Saved;
