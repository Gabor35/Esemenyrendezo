import React, { useState } from 'react';
import { db } from './firebase2';  // Import Firestore
import { collection, addDoc } from 'firebase/firestore';  // Firestore functions
import axios from 'axios';

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image file input changes
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

  // Handle event addition
  const handleAddEvent = async () => {
    if (!newEvent.Cime || !newEvent.Helyszin || !newEvent.Datum) {
      setError('Minden mezőt ki kell tölteni, kivéve az esemény leírását!');
      return;
    }

    setError('');
    const newEventObj = { ...newEvent, id: Date.now() };

    // If an image is selected, upload it to Cloudinary and get the URL
    if (imageFile && imageFile.name) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'esemenyek');  // Cloudinary upload preset
      formData.append('cloud_name', 'darnx8tnf');  // Cloudinary cloud name

      // Cloudinary API call to upload the image
      try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/darnx8tnf/image/upload', formData);
        const imageURL = response.data.secure_url;

        if (!imageURL) {
          setError("Hiba történt a kép feltöltése során.");
          return;
        }

        const updatedEvent = { ...newEventObj, Kepurl: imageURL };

        // Add event to Firestore
        await addDoc(collection(db, 'events'), updatedEvent);
        onAddEvent(updatedEvent);
        resetForm();
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        setError("Hiba történt a kép feltöltése során.");
      }
    } else {
      // Add event to Firestore without an image
      try {
        await addDoc(collection(db, 'events'), newEventObj);
        onAddEvent(newEventObj);
        resetForm();
      } catch (e) {
        console.error("Error adding document: ", e);
        setError("Hiba történt az esemény mentésekor.");
      }
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