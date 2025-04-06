// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import socket from '../../utils/Socket';
import './Chat.css'; // Import your CSS for styling

// eslint-disable-next-line react/prop-types
const Chat = ({ room, user }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', room);

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    return () => {
      socket.off('message');
      socket.off('connect_error');
    };
  }, [room]);

  const sendMessage = () => {
    if (message.trim()) {
      const messageData = {
        room,
        content: message,
        // eslint-disable-next-line react/prop-types
        sender: user.username, // Replace with actual user data
        timestamp: new Date().toISOString()
      };
      socket.emit('message', messageData);
      setMessage(''); // Clear the message input
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className="chat-message">
            <strong>{msg.sender}</strong>: {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
        />
        <button onClick={sendMessage} className="chat-send-button">Send</button>
      </div>
    </div>
  );
};

export default Chat;
