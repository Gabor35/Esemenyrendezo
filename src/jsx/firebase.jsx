import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref as dbRef,
  set,
  push,
  onValue
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from 'firebase/storage';

// Firebase konfiguráció
const firebaseConfig = {
  apiKey: "AIzaSyApLu5bmYByHbdzuuQ7Qged9Qj8dpgi570",
  authDomain: "esemenyrendezo-71f5b.firebaseapp.com",
  databaseURL: "https://esemenyrendezo-71f5b-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "esemenyrendezo-71f5b",
  storageBucket: "esemenyrendezo-71f5b.firebasestorage.app",
  messagingSenderId: "185020967631",
  appId: "1:185020967631:web:a501cb8e6695bda12625ba",
  measurementId: "G-X9VW5Y4CS4"
};

// Firebase inicializálás
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// 🔹 Üzenet küldése Firebase-be
export function sendMessage(messageText, userId) {
  const newMessageRef = push(dbRef(database, 'chats/'));
  set(newMessageRef, {
    userId: userId,
    message: messageText,
    timestamp: Date.now(),
  });
}

// 🔹 Üzenetek lekérése valós időben
export function listenForMessages(setMessages) {
  const messagesRef = dbRef(database, 'chats/');
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = [];
    for (let key in data) {
      messages.push(data[key]);
    }
    setMessages(messages);
  });
}

// 🔹 Kép feltöltése Firebase Storage-ba
export const uploadImage = (file, callback) => {
  const fileRef = storageRef(storage, `images/${file.name}`);

  uploadBytes(fileRef, file).then((snapshot) => {
    getDownloadURL(snapshot.ref).then((downloadURL) => {
      console.log('Fájl URL:', downloadURL);
      if (callback) callback(downloadURL);
    });
  });
};

// 🔹 Esemény mentése Realtime Database-be
export const saveEvent = (event) => {
  const eventRef = dbRef(database, 'events/' + event.id);
  set(eventRef, event)
    .then(() => {
      console.log('Esemény sikeresen mentve!');
    })
    .catch((error) => {
      console.error('Hiba az esemény mentésekor:', error);
    });
};
