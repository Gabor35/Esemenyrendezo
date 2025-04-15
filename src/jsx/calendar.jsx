import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from './firebase2';
import '../calendar.css';

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  // Fetch saved events from Firebase instead of localStorage
  useEffect(() => {
    const fetchSavedEvents = async () => {
      const storedUser = JSON.parse(localStorage.getItem('felhasz'));
      if (!storedUser) return;

      try {
        // Query the "saveEvents" collection for events saved by the current user
        const savesQuery = query(
          collection(db, "saveEvents"),
          where("userId", "==", storedUser.name)
        );
        const savesSnapshot = await getDocs(savesQuery);

        if (savesSnapshot.empty) {
          setEvents([]);
          return;
        }

        // Retrieve event details for each saved event
        const eventPromises = savesSnapshot.docs.map(async (docSnap) => {
          const eventId = docSnap.data().eventId;
          const eventDoc = await getDoc(doc(db, "events", String(eventId)));
          if (eventDoc.exists()) {
            return { id: eventDoc.id, ...eventDoc.data() };
          }
          return null;
        });

        const eventsData = await Promise.all(eventPromises);
        const validEvents = eventsData.filter(event => event !== null);
        setEvents(validEvents);
      } catch (err) {
        console.error("Error fetching firebase saved events:", err);
      }
    };

    fetchSavedEvents();
  }, []);

  const renderHeader = () => (
    <motion.div 
      className="calendar-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => setCurrentDate(moment(currentDate).subtract(1, 'month'))}>
        &lt;
      </button>
      <h2>{currentDate.format('MMMM YYYY')}</h2>
      <button onClick={() => setCurrentDate(moment(currentDate).add(1, 'month'))}>
        &gt;
      </button>
    </motion.div>
  );

  const renderDays = () => {
    const weekdays = ['Vas', 'Hét', 'Ke', 'Sze', 'Csü', 'Pén', 'Szo'];
    return (
      <motion.div 
        className="calendar-days"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {weekdays.map((day, index) => (
          <motion.div 
            key={day} 
            className="calendar-day-name"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            {day}
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderCells = () => {
    const monthStart = moment(currentDate).startOf('month');
    const monthEnd = moment(currentDate).endOf('month');
    const startDate = moment(monthStart).startOf('week');
    const endDate = moment(monthEnd).endOf('week');

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      // Build one week of cells
      for (let i = 0; i < 7; i++) {
        const cloneDay = moment(day);
        // Convert Firebase timestamps if needed for correct date comparison
        const eventsForDay = events.filter(event => {
          let eventDate = event.Datum;
          if (eventDate && eventDate.seconds) {
            eventDate = moment(eventDate.seconds * 1000);
          } else {
            eventDate = moment(eventDate);
          }
          return eventDate.format('YYYY-MM-DD') === cloneDay.format('YYYY-MM-DD');
        });
        
        days.push(
          <motion.div
            key={cloneDay.format('YYYY-MM-DD')}
            className={`calendar-cell ${
              !cloneDay.isSame(currentDate, 'month') ? 'disabled' : ''
            } ${cloneDay.isSame(moment(), 'day') ? 'today' : ''}`}
            onClick={() => setSelectedDate(cloneDay)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: (day.diff(startDate, 'days') * 0.05) }}
          >
            <span>{cloneDay.format('D')}</span>
            {eventsForDay.length > 0 && (
              <div className="event-dot">{eventsForDay.length}</div>
            )}
          </motion.div>
        );
        day = moment(day).add(1, 'day');
      }
      rows.push(
        <motion.div 
          key={day.format('YYYY-MM-DD')}
          className="calendar-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {days}
        </motion.div>
      );
      days = [];
    }
    return rows;
  };

  return (
    <motion.div 
      className="calendar-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {renderHeader()}
      {renderDays()}
      <div className="calendar-body">{renderCells()}</div>
      {/* Removed the separate selected-date events details block 
          to only mark saved events on the calendar */}
    </motion.div>
  );
};
