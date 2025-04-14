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

const AppContent = () => {
  // Remove the legacy events state and fetching. Now filtering state is passed to EventList.
  const [filterDate, setFilterDate] = useState("");
  const [filterTime, setFilterTime] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const [filterName, setFilterName] = useState("");
  const location = useLocation();
  const [showLogout, setShowLogout] = useState(false);
  const [isGridView, setIsGridView] = useState(true);
  const [user, setUser] = useState(null);

  // Check for an already logged-in user (from localStorage)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("felhasz"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <div
      style={{
        backgroundImage: `url(${hatterGif})`,
        backgroundSize: location.pathname === "/events" ? "auto" : "cover",
        backgroundPosition: "center",
        backgroundRepeat: location.pathname === "/events" ? "repeat" : "no-repeat",
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

                  {location.pathname === "/events" && (
                    <>
                      <li className="nav-item">
                        <motion.button
                          style={{ color: "black" }}
                          className="nav-link btn btn-link"
                          onClick={() => {
                            // Open modal by setting route state or a dedicated state.
                            // For simplicity, we assume modal is rendered on the EventList page
                            // (see AddEvent.jsx integration there if desired).
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          Új Esemény Hozzáadása
                        </motion.button>
                      </li>
                      <li className="nav-item">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
                    onMouseEnter={() => setShowLogout(true)}
                    onMouseLeave={() => setShowLogout(false)}
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
                    {showLogout && (
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
                    onClick={() => {
                      localStorage.removeItem("felhasz");
                      setUser(null);
                      window.location.href = "/login";
                    }}
                    animate={{ rotate: showLogout ? 360 : 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Only show filter controls on the /events page */}
      {location.pathname === "/events" && (
        <div className="container mt-4">
          <div className="row mb-4">
            <div className="col-12">
              <div className="p-3 bg-light rounded shadow-sm">
                <div className="d-flex flex-row align-items-center gap-3">
                  {/* Toggle List/Grid View */}
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
                  <motion.button
                    className="btn btn-secondary"
                    onClick={() => {
                      setFilterDate("");
                      setFilterTime("");
                      setFilterLocation("");
                      setFilterName("");
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
        </div>
      )}

      <div className="container mt-4">
        <Routes>
          <Route
            path="/events"
            element={
              <EventList
                isGridView={isGridView}
                filterDate={filterDate}
                filterTime={filterTime}
                filterLocation={filterLocation}
                filterName={filterName}
              />
            }
          />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/aboutus" element={<Aboutus />} />
          {/* Fallback route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
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
