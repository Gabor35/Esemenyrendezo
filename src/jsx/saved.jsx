// Saved.jsx
import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { collection, query, where, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase2';
import heartFillIcon from '../pictures/heart-fill.svg';
import { useGlobalContext } from '../Context/GlobalContext';

const Saved = () => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { /*apiUrl*/ } = useGlobalContext();

  // Read user info from localStorage; must include uid.
  const userData = JSON.parse(localStorage.getItem('felhasz'));
  const userUid = userData ? userData.uid : null;

  // Fetch saved events for the current user from the "savedEvents" collection
  useEffect(() => {
    const fetchSavedEvents = async () => {
      setLoading(true);
      if (!userUid) {
        setError('You must be logged in to view saved events');
        setLoading(false);
        return;
      }

      try {
        // Query for saved events where userId equals the current user’s UID
        const savedQuery = query(
          collection(db, 'savedEvents'),
          where('userId', '==', userUid)
        );
        const querySnapshot = await getDocs(savedQuery);
        // For each saved event document, retrieve the event detail from "events" collection.
        const eventPromises = querySnapshot.docs.map(async (docSnap) => {
          const { eventId } = docSnap.data();
          const eventDocRef = doc(db, 'events', eventId);
          const eventDoc = await getDoc(eventDocRef);
          if (eventDoc.exists()) {
            return { id: eventDoc.id, ...eventDoc.data() };
          }
          return null;
        });

        const eventsData = (await Promise.all(eventPromises)).filter(Boolean);
        setSavedEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching saved events:", err);
        setError("Error fetching saved events.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedEvents();
  }, [userUid]);

  const handleShowDetails = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // To unsave an event, remove the corresponding document from "savedEvents"
  const handleUnsaveEvent = async (eventId, e) => {
    e.preventDefault();
    if (!userUid) {
      setError('You must be logged in to unsave an event');
      return;
    }

    try {
      // Build the document ID as in EventList.jsx
      const docId = `${userUid}_${eventId}`;
      // Delete the document from Firestore
      await deleteDoc(doc(db, 'savedEvents', docId));
      // Remove event from the local state
      setSavedEvents(prev => prev.filter(event => event.id !== eventId));
    } catch (err) {
      console.error("Error unsaving event:", err);
      setError("Error unsaving event.");
    }
  };

  if (loading) return <div className="container mt-4">Loading saved events...</div>;
  if (error) return <div className="container mt-4 alert alert-danger">{error}</div>;
  if (savedEvents.length === 0) {
    return (
      <div className="container mt-4 d-flex justify-content-center align-items-center" style={{ height: "100vh", fontSize: "30px" }}>
        <div>No saved events!</div>
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
                <p className="card-text">Date: {new Date(event.Datum?.seconds ? event.Datum.seconds * 1000 : event.Datum).toLocaleString()}</p>
                <p className="card-text">Location: {event.Helyszin}</p>
                <motion.button
                  className="btn btn-secondary"
                  onClick={() => handleShowDetails(event)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Details
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
          <p><strong>Date:</strong> {new Date(selectedEvent?.Datum?.seconds ? selectedEvent.Datum.seconds * 1000 : selectedEvent.Datum).toLocaleString()}</p>
          <p><strong>Location:</strong> {selectedEvent?.Helyszin}</p>
          <p><strong>Description:</strong> {selectedEvent?.Leiras}</p>
        </Modal.Body>
        <Modal.Footer>
          <motion.button
            className="btn btn-secondary"
            onClick={() => setShowModal(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Close
          </motion.button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Saved;
