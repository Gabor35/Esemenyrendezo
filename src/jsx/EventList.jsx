import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase2';
import { Modal } from 'react-bootstrap';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import heartIcon from '../pictures/heart.svg';
import heartFillIcon from '../pictures/heart-fill.svg';
import { useGlobalContext } from '../Context/GlobalContext';

const EventList = ({ isGridView = false }) => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filledHearts, setFilledHearts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { apiUrl } = useGlobalContext();

  const userData = JSON.parse(localStorage.getItem('felhasz'));
  const token = userData ? userData.token : null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('Datum', 'desc'));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEvents(eventsData);
        setLoading(false);
      } catch (e) {
        console.error("Hiba történt az események lekérésekor: ", e);
        setError('Hiba történt az események betöltése során');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const checkSavedEvents = async () => {
      if (!token || !events.length) return;

      try {
        const savedHearts = {};
        for (const event of events) {
          if (!event.id) continue;
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
      alert('Be kell jelentkezned az esemény mentéséhez');
      return;
    }
    try {
      if (filledHearts[eventId]) {
        await axios.delete(`${apiUrl}Reszvetel/${token}/${eventId}`);
      } else {
        // ✅ FIXED: add empty body as second parameter
        await axios.post(`${apiUrl}Reszvetel/${token}/${eventId}`, {});
      }
      setFilledHearts(prev => ({ ...prev, [eventId]: !prev[eventId] }));
    } catch (error) {
      alert('Hiba: ' + (error.response?.data || error.message));
    }
  };
  

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

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
              className={isGridView ? "col-md-4 mb-4" : "list-group-item d-flex align-items-center mb-3 p-3 border rounded shadow-sm"}
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div className="card mb-3" style={isGridView ? {} : { display: 'flex', flexDirection: 'row', width: '100%' }}>
                {event.Kepurl && (
                  <img
                    src={event.Kepurl}
                    className={isGridView ? "card-img-top" : "img-thumbnail"}
                    alt={event.Cime}
                    style={isGridView ? { height: '200px', objectFit: 'cover' } : { maxWidth: '200px', maxHeight: '200px', objectFit: 'cover', marginRight: '15px' }}
                  />
                )}
                <div className="card-body" style={isGridView ? {} : { flex: 1 }}>
                  <h5 className="card-title">{event.Cime}</h5>
                  <p className="card-text">Dátum: {new Date(event.Datum?.seconds ? event.Datum.seconds * 1000 : event.Datum).toLocaleString()}</p>
                  <p className="card-text">Helyszín: {event.Helyszin}</p>
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
          <Modal.Title>{selectedEvent?.Cime}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <>
              {selectedEvent.Kepurl && (
                <img
                  src={selectedEvent.Kepurl}
                  alt={selectedEvent.Cime}
                  className="img-fluid mb-3"
                  style={{ width: '100%', objectFit: 'cover' }}
                />
              )}
              <p><strong>Dátum:</strong> {new Date(selectedEvent.Datum?.seconds ? selectedEvent.Datum.seconds * 1000 : selectedEvent.Datum).toLocaleString()}</p>
              <p><strong>Helyszín:</strong> {selectedEvent.Helyszin}</p>
              <p><strong>Leírás:</strong> {selectedEvent.Leiras}</p>
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
