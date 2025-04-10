import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { sendMessage, listenForMessages } from './firebase';  // Importáljuk a Firebase üzenetküldő és lekérő funkciókat

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId] = useState("user123");  // Példa felhasználói ID, amit a Firebase-ben használunk

  // Üzenetek lekérése Firebase-ből valós időben
  useEffect(() => {
    listenForMessages(setMessages);  // Firebase üzenetek figyelése
  }, []);

  // Üzenet küldése Firebase-be
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      sendMessage(newMessage, userId);  // Üzenet küldése Firebase-be
      setMessages([...messages, { userId: userId, message: newMessage, timestamp: Date.now() }]);  // Helyi üzenet hozzáadása
      setNewMessage("");  // Üzenet bevitel törlése
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <motion.div
        className="card shadow-lg p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "700px" }}
      >
        <motion.h1
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          💬 Chat Fórum
        </motion.h1>

        <div
          className="p-3 rounded-lg border border-gray-300 bg-light shadow-sm"
          style={{ maxHeight: "450px", overflowY: "auto" }} // Nem görget le automatikusan
        >
          {messages.map((message, index) => (
            <motion.div
              key={index}
              className="mb-3 p-2 rounded bg-light border border-gray-200 shadow-sm"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="d-flex justify-content-between">
                <strong className={message.userId === "user123" ? "text-primary" : "text-success"}>
                  {message.userId}
                </strong>
                <span className="text-muted small">{new Date(message.timestamp).toLocaleString()}</span>
              </div>
              <p className="mt-2">{message.message}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-3 d-flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Írj egy üzenetet..."
            className="form-control"
          />
          <motion.button
            onClick={handleSendMessage}
            className="btn btn-primary"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ➤
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Chat;