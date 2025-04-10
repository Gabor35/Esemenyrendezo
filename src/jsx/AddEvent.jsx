import React, { useState } from 'react';
import axios from 'axios';
import { uploadImage, saveEvent } from './firebase';  // Firebase funkciók importálása

const AddEvent = ({ onAddEvent }) => {
  const [newEvent, setNewEvent] = useState({
    Cime: '',
    Helyszin: '',
    Datum: '',
    Leiras: '',
    Kepurl: ''  // Kép URL-t is tárolunk
  });
  const [error, setError] = useState('');  // Hibák tárolása

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);  // Kép URL létrehozása
      setNewEvent({
        ...newEvent,
        Kepurl: imageUrl  // Kép URL tárolása az állapotban
      });
    }
  };

  const handleAddEvent = () => {
    // Validálás, hogy a kötelező mezők ki vannak-e töltve, és a kép is ki van-e választva
    if (!newEvent.Cime || !newEvent.Helyszin || !newEvent.Datum) {
      setError('Minden mezőt ki kell tölteni, kivéve az esemény leírását!');  // Hibás mezők üzenete
      return;
    }

    const newEventObj = { ...newEvent, EsemenyID: Date.now() };

    // Küldjük a képet Firebase Storage-ba
    if (newEvent.Kepurl) {
      uploadImage(newEvent.Kepurl).then((imageURL) => {
        const updatedEvent = { ...newEventObj, Kepurl: imageURL };
        saveEvent(updatedEvent);  // Esemény mentése Firebase-be
        onAddEvent(updatedEvent); // Új esemény hozzáadása a szülő komponenshez
      });
    } else {
      saveEvent(newEventObj);  // Kép nélküli esemény mentése Firebase-be
      onAddEvent(newEventObj); // Új esemény hozzáadása a szülő komponenshez
    }

    setNewEvent({
      Cime: '',
      Helyszin: '',
      Datum: '',
      Leiras: '',
      Kepurl: ''  // Kép URL törlése, ha az eseményt hozzáadták
    });
    setError('');  // Hiba törlése
  };

  return (
    <div>
      <form>
        {/* Esemény cím */}
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

        {/* Helyszín */}
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

        {/* Dátum */}
        <div className="mb-3">
          <input
            type="datetime-local"
            name="Datum"
            value={newEvent.Datum}
            onChange={handleInputChange}
            className="form-control"
          />
        </div>

        {/* Leírás */}
        <div className="mb-3">
          <textarea
            name="Leiras"
            value={newEvent.Leiras}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Esemény leírása"
          />
        </div>

        {/* Kép feltöltése */}
        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label">Válassz képet</label>
          <input
            type="file"
            id="imageUpload"
            className="form-control"
            onChange={handleImageChange}
          />
          {newEvent.Kepurl && (
            <div className="mt-3">
              <img src={newEvent.Kepurl} alt="Esemény kép" style={{ maxWidth: '200px' }} />
            </div>
          )}
        </div>

        {/* Hibás mezők üzenete */}
        {error && <div className="alert alert-danger">{error}</div>}

        <button type="button" className="btn btn-secondary" onClick={handleAddEvent}>Hozzáadás</button>
      </form>
    </div>
  );
};

export default AddEvent;