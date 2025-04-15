// firebase.jsx
import { database } from './firebase2';
import { ref as dbRef, set, push, onValue } from 'firebase/database';

// 🔹 Send a chat message
export function sendMessage(messageText, userId) {
  const newMessageRef = push(dbRef(database, 'chats/'));
  set(newMessageRef, {
    userId,
    message: messageText,
    timestamp: Date.now(),
  });
}

// 🔹 Listen for chat messages in real-time
export function listenForMessages(setMessages) {
  const messagesRef = dbRef(database, 'chats/');
  onValue(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const messages = [];
    for (let key in data) {
      messages.push(data[key]);
    }
    // Sort messages by timestamp
    messages.sort((a, b) => a.timestamp - b.timestamp);
    setMessages(messages);
  });
}
