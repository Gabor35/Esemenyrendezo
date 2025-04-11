import React, { useEffect, useState } from 'react';
import { db } from './firebase2'; // Importáljuk a Firestore kapcsolatot
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const EventList = () => {
  const [events, setEvents] = useState([]); // Az események tárolása a state-ben
  const [loading, setLoading] = useState(true); // Betöltési állapot kezelése
  const [error, setError] = useState(''); // Hiba kezelése

  // Az események lekérése a Firestore-ból
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Események lekérése a Firestore-ból, és rendezés dátum szerint
        const q = query(collection(db, 'events'), orderBy('Datum', 'desc'));
        const querySnapshot = await getDocs(q);

        // A dokumentumok tömbjének kigyűjtése
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
  }, []); // Csak egyszer hajtódik végre, amikor a komponens betöltődik

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
          <div key={event.id} className="list-group-item">
            <h5>{event.Cime}</h5>
            <p>{event.Helyszin}</p>
            <p>{event.Datum?.toDate().toLocaleString()}</p>
            {event.Kepurl && <img src={event.Kepurl} alt={event.Cime} style={{ maxWidth: '200px' }} />}
            <p>{event.Leiras}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventList;