import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getDatabase, ref as dbRef, set } from 'firebase/database';

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyApLu5bmYByHbdzuuQ7Qged9Qj8dpgi570",
  authDomain: "esemenyrendezo-71f5b.firebaseapp.com",
  databaseURL: "https://esemenyrendezo-71f5b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "esemenyrendezo-71f5b",
  storageBucket: "esemenyrendezo-71f5b.firebasestorage.app",
  messagingSenderId: "185020967631",
  appId: "1:185020967631:web:90cc9dad2be2dc332625ba",
  measurementId: "G-TZ7QNVTX12"
};

// Firebase inicializálása
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const database = getDatabase(app);

// Kép feltöltése Firebase Storage-ba
export const uploadImage = (file) => {
  const storageRef = ref(storage, `images/${file.name}`);

  uploadBytes(storageRef, file).then((snapshot) => {
    // Miután a fájl sikeresen feltöltődött, lekérjük a letöltési URL-t
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      console.log('Fájl URL: ', downloadURL);
      // A letöltési URL-t itt használhatod, például elmentheted az adatbázisba
    });
  });
};

// Esemény adatainak mentése Firebase Realtime Database-be
export const saveEvent = (event) => {
  const eventsRef = dbRef(database, 'events/' + event.id);
  set(eventsRef, event)
    .then(() => {
      console.log('Esemény sikeresen mentve!');
    })
    .catch((error) => {
      console.error('Hiba az esemény mentésekor: ', error);
    });
};