import React, { useState } from 'react';
import { db } from './firebase2'; // Import Firestore
import { collection, addDoc } from 'firebase/firestore';

const AddEvent = ({ onAddEvent }) => {
  const [newEvent, setNewEvent] = useState({
    Cime: '',
    Helyszin: '',
    Datum: '',
    Leiras: '',
    Kepurl: ''
  });
  const [error, setError] = useState('');

  // Handle form input changes for all fields (including the image URL)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle adding the event to Firestore
  const handleAddEvent = async () => {
    if (!newEvent.Cime || !newEvent.Helyszin || !newEvent.Datum) {
      setError('Minden mezőt ki kell tölteni, kivéve az esemény leírását!');
      return;
    }

    setError('');
    const newEventObj = { ...newEvent, id: Date.now() };

    try {
      // Add event to Firestore
      await addDoc(collection(db, 'events'), newEventObj);
      onAddEvent(newEventObj);
      resetForm();
    } catch (e) {
      console.error("Error adding document: ", e);
      setError("Hiba történt az esemény mentésekor.");
    }
  };

  // Reset form fields
  const resetForm = () => {
    setNewEvent({
      Cime: '',
      Helyszin: '',
      Datum: '',
      Leiras: '',
      Kepurl: ''
    });
    setError('');
  };

  return (
    <div className="event-container" style={{ margin: '20px' }}>
      <form>
        <div className="mb-3">
          <input
            type="text"
            name="Cime"
            value={newEvent.Cime}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Esemény címe"
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="Helyszin"
            value={newEvent.Helyszin}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Helyszín"
          />
        </div>

        <div className="mb-3">
          <input
            type="datetime-local"
            name="Datum"
            value={newEvent.Datum}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <textarea
            name="Leiras"
            value={newEvent.Leiras}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Esemény leírása"
          />
        </div>

        <div className="mb-3">
          {/* Image URL input field */}
          <input
            type="text"
            name="Kepurl"
            value={newEvent.Kepurl}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Kép URL-je"
          />
          {/* Display image preview if image URL is provided */}
          {newEvent.Kepurl && (
            <div className="mt-3">
              <img
                src={newEvent.Kepurl}
                alt="Esemény előnézet"
                style={{ width: '500px', height: '500px', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddEvent}
        >
          Hozzáadás
        </button>
      </form>
    </div>
  );
};

export default AddEvent;
