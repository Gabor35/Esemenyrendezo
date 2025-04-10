import React, { useState, useEffect } from 'react'; // Added `useEffect` to the import
import { useGlobalContext } from '../Context/GlobalContext';
import axios from 'axios';

const AddEvent = ({ onAddEvent }) => {
  const [newEvent, setNewEvent] = useState({
    Cime: '',
    Helyszin: '',
    Datum: '',
    Leiras: '',
    Kepurl: '' // Stores the uploaded image URL
  });
  const [error, setError] = useState(''); // Stores error messages
  const [isUploading, setIsUploading] = useState(false); // Tracks image upload status

  const GitHubRepoList = () => {
    const { getGitHubRepos } = useGlobalContext();
  
    useEffect(() => {
      getGitHubRepos(); // Call function on mount
    }, []);
  
    return <div>GitHub repo lekérés folyamatban...</div>;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError('Kérjük, válasszon egy fájlt a feltöltéshez.');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result.split(',')[1]; // Extract Base64 content
        const fileName = `${Date.now()}.png`; // Use current datetime in milliseconds as the file name
        const githubApiUrl = `https://api.github.com/repos/Gabor35/Images/contents/kepek/${fileName}`;

        const response = await axios.put(
          githubApiUrl,
          {
            message: `Add image ${fileName}`,
            content: base64File
          },
          {
            headers: {
              Authorization: `Bearer YOUR_TOKEN_HERE`, // Replace with actual token or dynamic fetching logic
              'Content-Type': 'application/json'
            }
          }
        );

        const fileUrl = response.data.content.html_url; // GitHub returns the URL of the uploaded file
        setNewEvent({
          ...newEvent,
          Kepurl: fileUrl
        });
        setIsUploading(false);
      };
    } catch (uploadError) {
      console.error('Error uploading image:', uploadError);
      setError('Hiba történt a kép feltöltése során. Ellenőrizze a fájl méretét és típusát.');
      setIsUploading(false);
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.Cime || !newEvent.Helyszin || !newEvent.Datum) {
      setError('Minden mezőt ki kell tölteni, kivéve az esemény leírását!');
      return;
    }

    if (!newEvent.Kepurl) {
      setError('Kérjük, töltsön fel egy képet az eseményhez.');
      return;
    }

    const newEventObj = { ...newEvent }; // Do not generate an ID here

    const token = localStorage.getItem('authToken');

    axios.post('https://esemenyrendezo1.azurewebsites.net/api/ImageUpload/addEvent', newEventObj, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        const createdEvent = response.data;

        // Log the backend response for debugging
        console.log('Backend response:', createdEvent);

        // Ensure the backend returns a valid ID
        if (!createdEvent.id) {
          console.warn('Backend did not return an ID for the created event. Generating a fallback ID.');
          createdEvent.id = Date.now(); // Fallback to a frontend-generated ID
        }

        onAddEvent(createdEvent); // Call the parent component's callback
        setNewEvent({
          Cime: '',
          Helyszin: '',
          Datum: '',
          Leiras: '',
          Kepurl: '' // Clear the image URL after adding the event
        });
        setError(''); // Clear any errors
      })
      .catch(error => {
        console.error('Error adding event:', error);
        setError('Hiba történt az esemény hozzáadása során.');
      });
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
          />
          {isUploading && <div className="mt-2 text-info">Kép feltöltése...</div>}
          {newEvent.Kepurl && (
            <div className="mt-3">
              <img src={newEvent.Kepurl} alt="Esemény kép" style={{ maxWidth: '200px' }} />
            </div>
          )}
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="button" className="btn btn-secondary" onClick={handleAddEvent}>Hozzáadás</button>
      </form>
    </div>
  );
};

export default AddEvent;
