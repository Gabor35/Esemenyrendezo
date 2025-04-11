// firebase.jsx
import { ref as dbRef, set, push, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { database, storage } from './firebase2';

// 🔹 Üzenet küldése Firebase-be
export function sendMessage(messageText, userId) {
  const newMessageRef = push(dbRef(database, 'chats/'));
  set(newMessageRef, {
    userId,
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

// 🔹 Kép feltöltése Firebase Storage-ba (hibakezeléssel)
export const uploadImage = async (file, callback) => {
  if (!file || !file.name) {
    console.error("❌ Hibás vagy hiányzó fájl a feltöltéshez:", file);
    return;
  }

  try {
    const fileRef = storageRef(storage, `images/${file.name}`);
    const snapshot = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('✅ Fájl feltöltve, elérési URL:', downloadURL);
    if (callback) callback(downloadURL);
  } catch (error) {
    console.error('🔥 Hiba a fájl feltöltése közben:', error);
  }
};

// 🔹 Esemény mentése Realtime Database-be
export const saveEvent = (event) => {
  const eventRef = dbRef(database, 'events/' + event.id);
  set(eventRef, event)
    .then(() => {
      console.log('✅ Esemény sikeresen mentve!');
    })
    .catch((error) => {
      console.error('❌ Hiba az esemény mentésekor:', error);
    });
};
