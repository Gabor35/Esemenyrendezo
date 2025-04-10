import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../Context/GlobalContext';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

import heartIcon from '../pictures/heart.svg';
import heartFillIcon from '../pictures/heart-fill.svg';

export const EventList = ({ events, isGridView }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filledHearts, setFilledHearts] = useState({});
  const { apiUrl } = useGlobalContext();

  const userData = JSON.parse(localStorage.getItem('felhasz'));
  const token = userData ? userData.token : null;

  useEffect(() => {
    const checkSavedEvents = async () => {
      if (!token || !events.length) return;

      try {
        const savedHearts = {};
        for (const event of events) {
          // Skip events without a valid ID
          if (!event.id || typeof event.id !== 'number') {
            console.warn(`Skipping event with invalid ID: ${event.id}`);
            continue;
          }

          const response = await axios.get(`${apiUrl}Reszvetel/check/${token}/${event.id}`);
          savedHearts[event.id] = response.data;
        }
        setFilledHearts(savedHearts);
      } catch (error) {
        console.error('Error checking saved events:', error);
      }
    };

    checkSavedEvents();
  }, [events, token, apiUrl]);

  const handleHeartClick = async (eventId, e) => {
    e.preventDefault();
    if (!token) {
      alert('You must be logged in to save events');
      return;
    }
    try {
      if (filledHearts[eventId]) {
        await axios.delete(`${apiUrl}Reszvetel/${token}/${eventId}`);
      } else {
        await axios.post(`${apiUrl}Reszvetel/${token}/${eventId}`);
      }
      setFilledHearts(prev => ({ ...prev, [eventId]: !prev[eventId] }));
    } catch (error) {
      alert('Error: ' + (error.response?.data || error.message));
    }
  };

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <AnimatePresence>
        <motion.div
          key={isGridView ? "grid" : "list"}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className={isGridView ? "row" : "list-group"}
        >
          {events.map((event, index) => (
            <motion.div
              className={isGridView ? "col-md-4" : "list-group-item d-flex align-items-center mb-3 p-3 border rounded shadow-sm"}
              key={event.id || `event-${index}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="card mb-3" style={isGridView ? {} : { display: 'flex', flexDirection: 'row', width: '100%' }}>
                <img
                  src={`https://images-0prm.onrender.com/${event.kepurl}`}
                  className={isGridView ? "card-img-top" : "img-thumbnail"}
                  alt={event.cime}
                  style={isGridView ? { height: '200px', objectFit: 'cover' } : { maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', marginRight: '15px' }}
                />
                <div className="card-body" style={isGridView ? {} : { flex: 1 }}>
                  <h5 className="card-title">{event.cime}</h5>
                  <p className="card-text">Dátum: {new Date(event.datum).toLocaleString()}</p>
                  <p className="card-text">Helyszín: {event.helyszin}</p>
                  <motion.button
                    className="btn btn-secondary"
                    onClick={() => handleShowDetails(event)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Részletek
                  </motion.button>
                  <button
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px', marginLeft: '10px' }}
                    onClick={(e) => handleHeartClick(event.id, e)}
                  >
                    <motion.img
                      src={filledHearts[event.id] ? heartFillIcon : heartIcon}
                      alt="Heart"
                      style={{ width: '20px', verticalAlign: 'middle' }}
                      whileHover={{ scale: 1.2 }}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedEvent?.cime}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              <img
                src={`https://images-0prm.onrender.com/${selectedEvent.kepurl}`}
                alt={selectedEvent.cime}
                className="img-fluid mb-3"
                style={{ width: '100%', objectFit: 'cover' }}
              />
              <p><strong>Dátum:</strong> {new Date(selectedEvent.datum).toLocaleString()}</p>
              <p><strong>Helyszín:</strong> {selectedEvent.helyszin}</p>
              <p><strong>Leírás:</strong> {selectedEvent.leiras}</p>
            </>
          )}
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

export default EventList;