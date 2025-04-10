import React, { useState } from 'react';
import { uploadImage, saveEvent } from './firebase';

const AddEvent = ({ onAddEvent }) => {
  const [newEvent, setNewEvent] = useState({
    Cime: '',
    Helyszin: '',
    Datum: '',
    Leiras: '',
    Kepurl: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageFile(file);
      setNewEvent(prev => ({
        ...prev,
        Kepurl: imageUrl
      }));
    } else {
      setError("Csak érvényes képfájlt lehet feltölteni.");
      setImageFile(null);
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.Cime || !newEvent.Helyszin || !newEvent.Datum) {
      setError('Minden mezőt ki kell tölteni, kivéve az esemény leírását!');
      return;
    }

    setError('');
    const newEventObj = { ...newEvent, id: Date.now() };

    if (imageFile && imageFile.name) {
      uploadImage(imageFile, (imageURL) => {
        if (!imageURL) {
          setError("Hiba történt a kép feltöltése során.");
          return;
        }

        const updatedEvent = { ...newEventObj, Kepurl: imageURL };
        saveEvent(updatedEvent);
        onAddEvent(updatedEvent);
        resetForm();
      });
    } else {
      saveEvent(newEventObj);
      onAddEvent(newEventObj);
      resetForm();
    }
  };

  const resetForm = () => {
    setNewEvent({
      Cime: '',
      Helyszin: '',
      Datum: '',
      Leiras: '',
      Kepurl: ''
    });
    setImageFile(null);
    setError('');
  };

  return (
    <div>
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
          <label htmlFor="imageUpload" className="form-label">Válassz képet</label>
          <input
            type="file"
            id="imageUpload"
            className="form-control"
            onChange={handleImageChange}
            accept="image/*"
          />
          {newEvent.Kepurl && (
            <div className="mt-3">
              <img src={newEvent.Kepurl} alt="Esemény kép" style={{ maxWidth: '200px' }} />
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
