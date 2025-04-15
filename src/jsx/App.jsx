// App.jsx
import { GlobalProvider } from "../Context/GlobalContext";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  useLocation,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { motion } from "framer-motion";
import { Login } from "../UsersLogin/Login";
import { Register } from "../UsersLogin/Register";
import AddEvent from "./AddEvent";
import EventList from "./EventList";
import logo from "../pictures/logo.jpg";
import hatterGif from "../pictures/background.jpg";
import Chat from "./chat";
import { Calendar } from "./calendar";
import Saved from "./saved";
import axios from "axios";
import Aboutus from "./aboutus";
import gear from "../pictures/gear-fill.svg";
import gridIcon from "../pictures/grid.svg";
import listIcon from "../pictures/card-list.svg";

// Firestore imports
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase2";

const setupAxiosDefaults = () => {
  const userData = JSON.parse(localStorage.getItem("felhasz"));
  if (userData?.token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
  }
};

const AppContent = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Filter states
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterName, setFilterName] = useState("");

  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const isEventListPage = location.pathname === "/events";
  const [isGridView, setIsGridView] = useState(true);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
    }

    // Whenever the App mounts (or a filter changes, if you prefer),
    // we fetch from Firestore:
    fetchEventsFromFirestore();
    setupAxiosDefaults();
  }, []);

  // ------------------------------------------------------------------
  // APPROACH A: Firestore-based filtering for EXACT or range matches
  // Comment/uncomment as needed

  const fetchEventsFromFirestore = async () => {
    try {
      let qRef = query(collection(db, "events"), orderBy("Datum", "desc"));

      // If you only want to do an EXACT date match (no partial):
      // If the user selected 2025-04-15 as filterDate, we can do a range from:
      // 2025-04-15 00:00:00 to 2025-04-15 23:59:59
      if (filterDate) {
        const startDate = new Date(filterDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(filterDate);
        endDate.setHours(23, 59, 59, 999);
        qRef = query(
          qRef,
          where("Datum", ">=", startDate),
          where("Datum", "<=", endDate)
        );
      }

      // For time-based filtering or partial matches on location/name,
      // Firestore has no direct "contains" or "like".
      // So you might do either:
      //   1) exact match: where('Helyszin', '==', filterLocation)
      //   2) client-side partial filtering (see approach B below).

      // Example of an EXACT match for location:
      if (filterLocation) {
        qRef = query(qRef, where("Helyszin", "==", filterLocation));
      }

      // Example of an EXACT match for name (Cime):
      if (filterName) {
        qRef = query(qRef, where("Cime", "==", filterName));
      }

      // getDocs from Firestore
      const querySnapshot = await getDocs(qRef);
      const eventsData = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // If you want partial matching by time-of-day or substring,
      // you can do that in Approach B client-side.
      setEvents(eventsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  // ------------------------------------------------------------------
  // APPROACH B: Client-side filtering for partial strings
  // (You can combine with A by first fetching from Firestore with broad filters,
  // then narrowing further on the client)

  const getFilteredEventsClientSide = () => {
    return events.filter((event) => {
      // If you have Firestore Timestamp, convert to JS date
      const eventDate = event.Datum?.seconds
        ? new Date(event.Datum.seconds * 1000)
        : new Date(event.Datum);

      // 1. Date filtering (if we didn't already do it in fetchEventsFromFirestore)
      const isDateMatch = filterDate
        ? eventDate.toLocaleDateString() ===
          new Date(filterDate).toLocaleDateString()
        : true;

      // 2. Time filtering (partial match for hours:minutes?)
      // e.g. "14:30" must appear in the eventDate toLocaleTimeString
      const isTimeMatch = filterTime
        ? eventDate.toLocaleTimeString().includes(filterTime)
        : true;

      // 3. Location partial match (Firestore has no LIKE operator, so do it here)
      const isLocationMatch = filterLocation
        ? event.Helyszin?.toLowerCase().includes(filterLocation.toLowerCase())
        : true;

      // 4. Name partial match
      const isNameMatch = filterName
        ? event.Cime?.toLowerCase().includes(filterName.toLowerCase())
        : true;

      return isDateMatch && isTimeMatch && isLocationMatch && isNameMatch;
    });
  };

  // In your EventList, we'll pass the final "filtered events" array:
  const displayedEvents = getFilteredEventsClientSide();

  // ------------------------------------------------------------------
  // Add new event locally (from your AddEvent component)
  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      // Sort events by date
      updatedEvents.sort((a, b) => {
        const dateA = a.Datum?.seconds
          ? new Date(a.Datum.seconds * 1000)
          : new Date(a.Datum);
        const dateB = b.Datum?.seconds
          ? new Date(b.Datum.seconds * 1000)
          : new Date(b.Datum);
        return dateA - dateB;
      });
      return updatedEvents;
    });
    setIsModalOpen(false);
  };

  // ------------------------------------------------------------------
  // Render
  return (
    <div
      style={{
        backgroundImage: `url(${hatterGif})`,
        backgroundSize: isEventListPage ? "auto" : "cover",
        backgroundPosition: "center",
        backgroundRepeat: isEventListPage ? "repeat" : "no-repeat",
        minHeight: "110vh",
      }}
    >
      <nav className="navbar navbar-expand-sm navbar-light bg-light">
        <div className="container-fluid">
          <div className="navbar-brand">
            <img
              src={logo}
              alt="Logo"
              className="me-2"
              style={{ width: "50px", height: "50px" }}
            />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="nav nav-pills">
              {user && (
                <>
                  <li className="nav-item">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <NavLink
                        to="/events"
                        style={{
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                        }}
                        className={({ isActive }) =>
                          "nav-link" + (isActive ? " active" : "")
                        }
                      >
                        Eseményrendező
                      </NavLink>
                    </motion.div>
                  </li>

                  {isEventListPage && (
                    <>
                      <li className="nav-item">
                        <motion.button
                          style={{ color: "black" }}
                          className="nav-link btn btn-link"
                          onClick={() => setIsModalOpen(true)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Új Esemény Hozzáadása
                        </motion.button>
                      </li>
                      <li className="nav-item">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <NavLink
                            to="/aboutus"
                            style={{
                              backgroundColor: "transparent",
                              border: "none",
                              color: "black",
                            }}
                            className={({ isActive }) =>
                              "nav-link" + (isActive ? " active" : "")
                            }
                          >
                            Rólunk
                          </NavLink>
                        </motion.div>
                      </li>
                    </>
                  )}

                  <li
                    className="nav-item dropdown"
                    onMouseEnter={() => setShowDropdown(true)}
                    onMouseLeave={() => setShowDropdown(false)}
                  >
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="nav-link dropdown-toggle"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "black",
                      }}
                    >
                      Továbbiak
                    </motion.button>

                    {showDropdown && (
                      <motion.ul
                        className="dropdown-menu show"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <li>
                          <NavLink to="/chat" className="dropdown-item">
                            Chat
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/calendar" className="dropdown-item">
                            Naptár
                          </NavLink>
                        </li>
                        <li>
                          <NavLink to="/saved" className="dropdown-item">
                            Mentések
                          </NavLink>
                        </li>
                      </motion.ul>
                    )}
                  </li>
                </>
              )}
            </ul>
            <ul className="navbar-nav ms-auto">
              {!user ? (
                <>
                  <li className="nav-item">
                    <NavLink
                      to="/login"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <span className="btn btn-light">Bejelentkezés</span>
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      to="/register"
                      className={({ isActive }) =>
                        "nav-link" + (isActive ? " active" : "")
                      }
                    >
                      <span className="btn btn-light">Regisztráció</span>
                    </NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item position-relative d-flex align-items-center">
                  <motion.img
                    src={gear}
                    alt="Beállítások"
                    style={{ width: "30px", height: "30px", cursor: "pointer" }}
                    onClick={() => setShowLogout(!showLogout)}
                    animate={showLogout ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />

                  {showLogout && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="position-absolute bg-white shadow p-2 rounded"
                      style={{
                        right: 0,
                        top: "35px",
                        minWidth: "150px",
                        zIndex: 10,
                      }}
                    >
                      <button
                        onClick={() => {
                          localStorage.removeItem("felhasz");
                          setUser(null);
                          window.location.href = "/login";
                        }}
                        className="btn btn-danger w-100"
                      >
                        Kijelentkezés
                      </button>
                    </motion.div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-4">
        {/* Only show filter controls when on the events page */}
        {isEventListPage && (
          <div className="row mb-4">
            <div className="col-12">
              <div className="p-3 bg-light rounded shadow-sm">
                <div className="d-flex flex-row align-items-center gap-3">
                  {/* Toggle List/Grid View Button */}
                  <motion.button
                    className="btn"
                    onClick={() => setIsGridView(!isGridView)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    style={{ width: "40px", height: "40px", padding: "8px", flexShrink: 0 }}
                  >
                    <img
                      src={isGridView ? listIcon : gridIcon}
                      alt={isGridView ? "List View" : "Grid View"}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </motion.button>

                  <div className="flex-grow-1">
                    <input
                      type="date"
                      className="form-control"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      placeholder="Dátum"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <input
                      type="time"
                      className="form-control"
                      value={filterTime}
                      onChange={(e) => setFilterTime(e.target.value)}
                      placeholder="Időpont"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Helyszín"
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Esemény neve"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>

                  {/* Apply Filter Button (if you want to do server-side again) */}
                  <motion.button
                    className="btn btn-primary"
                    onClick={fetchEventsFromFirestore}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0 }}
                  >
                    Szűrés (Firestore)
                  </motion.button>

                  {/* Clear Filters Button */}
                  <motion.button
                    className="btn btn-secondary"
                    onClick={() => {
                      setFilterDate("");
                      setFilterTime("");
                      setFilterLocation("");
                      setFilterName("");
                      // Optionally re-fetch full list
                      fetchEventsFromFirestore();
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{ flexShrink: 0 }}
                  >
                    Szűrők törlése
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        )}

        <Routes>
          <Route
            path="/events"
            element={
              loading ? (
                <div>Betöltés...</div>
              ) : (
                <EventList events={isEventListPage ? displayedEvents : []} isGridView={isGridView} />
              )
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </div>

      {/* Modal window */}
      {isModalOpen && (
        <div className="modal show" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Új esemény hozzáadása</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <AddEvent onAddEvent={handleAddEvent} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const App = () => {
  return (
    <GlobalProvider>
      <Router>
        <AppContent />
      </Router>
    </GlobalProvider>
  );
};
