import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useGlobalContext } from "../Context/GlobalContext";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { loggedUser } = useGlobalContext(); // Get the logged user from global context
  
  // Get token from the loggedUser (if available)
  const token = loggedUser?.token || "";

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("https://esemenyrendezo1.azurewebsites.net/api/ChatMessage");
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const newMessageObj = {
        user: "You",
        text: newMessage,
        time: new Date().toISOString(),
      };

      try {
        // Use the token from loggedUser here in the API endpoint
        await axios.post(`https://esemenyrendezo1.azurewebsites.net/api/ChatMessage/${token}`, newMessageObj);
        setMessages([...messages, newMessageObj]);
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
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
          Chat
        </motion.h1>

        <div
          className="p-3 rounded-lg border border-gray-300 bg-light shadow-sm"
          style={{ maxHeight: "450px", overflowY: "auto" }}
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
                <strong className={message.user === "You" ? "text-primary" : "text-success"}>
                  {message.user}
                </strong>
                <span className="text-muted small">{new Date(message.time).toLocaleString()}</span>
              </div>
              <p className="mt-2">{message.text}</p>
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
