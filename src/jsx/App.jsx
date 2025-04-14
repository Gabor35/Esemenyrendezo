import { GlobalProvider } from "../Context/GlobalContext";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { motion } from "framer-motion";
import { Login } from "../UsersLogin/Login";
import { Register } from "../UsersLogin/Register";
import ForgotPassword from "./ForgotPassword";
import AddEvent from "./AddEvent";
import EventList from "./EventList";
import logo from "../pictures/logo.jpg";
import hatterGif from "../pictures/background.jpg";
import Chat from "./chat";
import { Calendar } from "./calendar";
import { Saved } from "./saved";
import axios from "axios";
import Aboutus from "./aboutus";
import gear from "../pictures/gear-fill.svg";
import gridIcon from "../pictures/grid.svg";
import listIcon from "../pictures/card-list.svg";

// Axios konfigurálás
const setupAxiosDefaults = () => {
  const userData = JSON.parse(localStorage.getItem('felhasz'));
  if (userData?.token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  }
};

const AppContent = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterName, setFilterName] = useState("");
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const isEventListPage = location.pathname === "/events";
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
    }
    let url = "https://esemenyrendezo1.azurewebsites.net/api/Esemeny/";
    axios
      .get(url)
      .then((response) => {
        setEvents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
    setupAxiosDefaults();
  }, []);

  const handleAddEvent = (newEvent) => {
    setEvents((prevEvents) => {
      const updatedEvents = [...prevEvents, newEvent];
      updatedEvents.sort((a, b) => new Date(a.datum) - new Date(b.datum));
      return updatedEvents;
    });
    setIsModalOpen(false);
  };

  const filteredEvents = events.filter((event) => {
    const isDateMatch = filterDate
      ? new Date(event.datum).toLocaleDateString() ===
      new Date(filterDate).toLocaleDateString()
      : true;

    const isTimeMatch = filterTime
      ? new Date(event.datum).toLocaleTimeString().includes(filterTime)
      : true;

    const isLocationMatch = filterLocation
      ? event.helyszin?.toLowerCase().includes(filterLocation.toLowerCase())
      : true;

    const isNameMatch = filterName
      ? event.cime?.toLowerCase().includes(filterName.toLowerCase())
      : true;

    return isDateMatch && isTimeMatch && isLocationMatch && isNameMatch;
  });

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
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <NavLink
                        to="/events"
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
                    onClick={() => setShowDropdown(!showDropdown)}
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
        <Routes>
          <Route path="/" element={<EventList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/events" element={<EventList />} />
          <Route path="/add-event" element={<AddEvent onAddEvent={handleAddEvent} />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/aboutus" element={<Aboutus />} />
        </Routes>
      </div>

      <footer className="footer mt-auto py-3 bg-light">
        <div className="container text-center">
          <span className="text-muted">&copy; 2025 Esemény Rendező</span>
        </div>
      </footer>
    </div>
  );
};

export const App = () => (
  <GlobalProvider>
    <Router>
      <AppContent />
    </Router>
  </GlobalProvider>
);

