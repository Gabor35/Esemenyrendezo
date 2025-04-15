import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  setDoc,
  deleteDoc
} from "firebase/firestore";
import { db } from "./firebase2";
import { Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import heartIcon from "../pictures/heart.svg";
import heartFillIcon from "../pictures/heart-fill.svg";
import { useGlobalContext } from "../Context/GlobalContext";

const EventList = ({ events: initialEvents = [], isGridView = false }) => {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filledHearts, setFilledHearts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { apiUrl } = useGlobalContext();

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem("felhasz"));

  // On mount, if no events passed down, fetch from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, "events"), orderBy("Datum", "desc"));
        const querySnapshot = await getDocs(q);
        const eventsData = querySnapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setEvents(eventsData);
        setLoading(false);
      } catch (e) {
        console.error("Hiba történt az események lekérésekor: ", e);
        setError("Hiba történt az események betöltése során");
        setLoading(false);
      }
    };

    if (!initialEvents.length) {
      fetchEvents();
    } else {
      // Use already passed events from the parent
      setLoading(false);
    }
  }, [initialEvents]);

  // Client‑side lookup to determine which events are saved
  useEffect(() => {
    const fetchSavedStatus = async () => {
      if (!userData || !events.length) return;
      try {
        // Fetch all saved events for the logged-in user from Firestore
        const q = query(
          collection(db, "saveEvents"),
          where("userId", "==", userData.name)
        );
        const querySnapshot = await getDocs(q);
        const savedHeartsData = {};
        querySnapshot.forEach((docSnap) => {
          const { eventId } = docSnap.data();
          savedHeartsData[eventId] = true;
        });
        setFilledHearts(savedHeartsData);
      } catch (err) {
        console.error("Error checking saved events:", err);
      }
    };
    fetchSavedStatus();
  }, [events, userData]);

  // Toggle saving/unsaving an event with Firestore (collection "saveEvents")
  const handleHeartClick = async (eventId, e) => {
    e.preventDefault();
    if (!userData) {
      alert("Be kell jelentkezned az esemény mentéséhez");
      return;
    }
    const userId = userData.name;
    const compositeId = `${userId}_${eventId}`;
    try {
      if (filledHearts[eventId]) {
        // Unsave the event
        await deleteDoc(doc(db, "saveEvents", compositeId));
      } else {
        // Save the event with minimal fields (userId, eventId)
        await setDoc(doc(db, "saveEvents", compositeId), {
          userId,
          eventId,
        });
      }
      setFilledHearts((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
    } catch (error) {
      alert("Hiba: " + error.message);
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
              className={
                isGridView
                  ? "col-md-4 mb-4"
                  : "list-group-item d-flex align-items-center mb-3 p-3 border rounded shadow-sm"
              }
              key={event.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <div
                className="card mb-3"
                style={
                  isGridView
                    ? {}
                    : { display: "flex", flexDirection: "row", width: "100%" }
                }
              >
                {event.Kepurl && (
                  <img
                    src={event.Kepurl}
                    className={isGridView ? "card-img-top" : "img-thumbnail"}
                    alt={event.Cime}
                    style={
                      isGridView
                        ? { height: "200px", objectFit: "cover" }
                        : {
                            maxWidth: "200px",
                            maxHeight: "200px",
                            objectFit: "cover",
                            marginRight: "15px",
                          }
                    }
                  />
                )}
                <div className="card-body" style={isGridView ? {} : { flex: 1 }}>
                  <h5 className="card-title">{event.Cime}</h5>
                  <p className="card-text">
                    Dátum:{" "}
                    {new Date(
                      event.Datum?.seconds
                        ? event.Datum.seconds * 1000
                        : event.Datum
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
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "5px",
                      marginLeft: "10px",
                    }}
                    onClick={(e) => handleHeartClick(event.id, e)}
                  >
                    <motion.img
                      src={filledHearts[event.id] ? heartFillIcon : heartIcon}
                      alt="Heart"
                      style={{ width: "20px", verticalAlign: "middle" }}
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
                  style={{ width: "100%", objectFit: "cover" }}
                />
              )}
              <p>
                <strong>Dátum:</strong>{" "}
                {new Date(
                  selectedEvent.Datum?.seconds
                    ? selectedEvent.Datum.seconds * 1000
                    : selectedEvent.Datum
                ).toLocaleString()}
              </p>
              <p>
                <strong>Helyszín:</strong> {selectedEvent.Helyszin}
              </p>
              <p>
                <strong>Leírás:</strong> {selectedEvent.Leiras}
              </p>
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
