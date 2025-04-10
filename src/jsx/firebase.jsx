import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, onValue } from 'firebase/database';

// Firebase konfigurációs adataink (cseréld ki a saját adataiddal)
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

// Firebase alkalmazás inicializálása
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Üzenet küldése Firebase-be
function sendMessage(messageText, userId) {
  const newMessageRef = push(ref(database, 'chats/'));  // 'chats' a mappa, ahol az üzeneteket tároljuk
  set(newMessageRef, {
    userId: userId,      // Felhasználó azonosítója
    message: messageText,  // Üzenet szövege
    timestamp: Date.now(),  // Időbélyeg, hogy mikor küldték
  });
}

// Üzenetek lekérése Firebase-ből és figyelése valós időben
function listenForMessages(setMessages) {
  const messagesRef = ref(database, 'chats/');  // A 'chats' mappában tárolt üzenetek lekérése
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();  // Az összes üzenet
    const messages = [];
    for (let key in data) {
      messages.push(data[key]);  // Üzenetek hozzáadása az állapothoz
    }
    setMessages(messages);  // Üzenetek állapotban való frissítése
  });
}

// Firebase.js exportálása, hogy más fájlokban használni tudjuk
export { sendMessage, listenForMessages };