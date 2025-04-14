import React, { useEffect, useState } from 'react';
import { db } from './firebase2'; // Import the Firestore connection
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const EventList = () => {
  const [events, setEvents] = useState([]); // Store events in state
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(''); // Handle errors

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Query events from Firestore ordered by date
        const q = query(collection(db, 'events'), orderBy('Datum', 'desc'));
        const querySnapshot = await getDocs(q);

        // Collect the documents into an array
        const eventsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setEvents(eventsData);
        setLoading(false);
      } catch (e) {
        console.error("Error fetching events: ", e);
        setError('Hiba történt az események betöltése során');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []); // Run only once on component mount

  if (loading) {
    return <div>Betöltés...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2>Események</h2>
      <div className="list-group">
        {events.map(event => (
          <div 
            key={event.id} 
            className="list-group-item" 
            style={{ 
              margin: '20px 0', 
              padding: '15px', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h5>{event.Cime}</h5>
            <p>{event.Helyszin}</p>
            <p>
              {event.Datum?.seconds 
                ? new Date(event.Datum.seconds * 1000).toLocaleString() 
                : "Dátum nem elérhető"}
            </p>
            {event.Kepurl && (
              <img 
                src={event.Kepurl} 
                alt={event.Cime} 
                style={{ maxWidth: '200px', marginBottom: '10px' }} 
              />
            )}
            <p>{event.Leiras}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;
