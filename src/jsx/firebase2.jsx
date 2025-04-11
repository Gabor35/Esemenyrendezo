// firebase2.jsx
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyApLu5bmYByHbdzuuQ7Qged9Qj8dpgi570",
  authDomain: "esemenyrendezo-71f5b.firebaseapp.com",
  databaseURL: "https://esemenyrendezo-71f5b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "esemenyrendezo-71f5b",
  storageBucket: "esemenyrendezo-71f5b.appspot.com",
  messagingSenderId: "185020967631",
  appId: "1:185020967631:web:f3c79109d7b984052625ba",
  measurementId: "G-8M407FEJEP"
};

// Inicializálás
if (!getApps().length) {
  initializeApp(firebaseConfig);
}

// Exportálás
const db = getFirestore();
const database = getDatabase();
const storage = getStorage();

export { db, database, storage };
