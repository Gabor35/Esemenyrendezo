import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase2';
import heartFillIcon from '../pictures/heart-fill.svg';
import { useGlobalContext } from '../Context/GlobalContext';

export const Saved = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { apiUrl } = useGlobalContext();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('felhasz'));

  // Fetch saved event IDs from "saveEvents" for this user,
  // then fetch the actual event details from "events".
  useEffect(() => {
    const fetchSavedEvents = async () => {
      setLoading(true);
      if (!userData) {
        setError('Be kell jelentkezned a mentett események megtekintéséhez');
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "saveEvents"),
          where("userId", "==", userData.name)
        );
        const querySnapshot = await getDocs(q);

        const fetchedEvents = [];

        // For each saveEvents doc, retrieve the event data from "events"
        for (const docSnap of querySnapshot.docs) {
          const { eventId } = docSnap.data();
          const eventRef = doc(db, "events", eventId);
          const eventSnap = await getDoc(eventRef);

          if (eventSnap.exists()) {
            // Merge event data with eventId for display
            fetchedEvents.push({
              eventId,
              // or docSnap.data().userId if needed
              ...eventSnap.data()
            });
          }
        }

        setSavedEvents(fetchedEvents);
        setError(null);
      } catch (err) {
        setError("Nem sikerült lekérni a mentett eseményeket: " + err.message);
        setSavedEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [userData]);

  // Handle showing event details
  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Remove the saved event by deleting the doc from "saveEvents"
  const handleUnsaveEvent = async (eventId, e) => {
    e.preventDefault();
    if (!userData) {
      setError('Be kell jelentkezned az esemény eltávolításához');
      return;
    }
    const compositeId = `${userData.name}_${eventId}`;
    try {
      await deleteDoc(doc(db, "saveEvents", compositeId));
      setSavedEvents(prev => prev.filter(event => event.eventId !== eventId));
    } catch (err) {
      setError('Nem sikerült eltávolítani az eseményt: ' + err.message);
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
      <div
        className="container mt-4 d-flex justify-content-center align-items-center"
        style={{ height: "100vh", fontSize: "30px" }}
      >
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
            key={event.eventId}
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
                <p className="card-text">
                  Dátum:{' '}
                  {new Date(
                    event.Datum?.seconds ? event.Datum.seconds * 1000 : event.Datum
                  ).toLocaleString()}
                </p>
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
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                    onClick={(e) => handleUnsaveEvent(event.eventId, e)}
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
          <p>
            <strong>Dátum:</strong>{' '}
            {new Date(
              selectedEvent?.Datum?.seconds
                ? selectedEvent.Datum.seconds * 1000
                : selectedEvent?.Datum
            ).toLocaleString()}
          </p>
          <p>
            <strong>Helyszín:</strong> {selectedEvent?.Helyszin}
          </p>
          <p>
            <strong>Leírás:</strong> {selectedEvent?.Leiras}
          </p>
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
