import React from 'react';
import './MessageList.css';

const MessageList = ({ messages, mySocketId, messagesEndRef }) => {
  const getMessageType = (message) => {
    if (message.type === 'system') return 'system';
    return message.socketId === mySocketId ? 'user' : 'other';
  };

  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <div key={index} className={`message ${getMessageType(message)}`}>
          <div className="message-content">
            {message.type === 'system' ? (
              <div className="system-message">{message.message}</div>
            ) : (
              <>
                {getMessageType(message) === 'other' && (
                  <div className="message-nickname">{message.nickname}</div>
                )}
                <div className="message-text">{message.message}</div>
                <div className="message-time">{message.timestamp}</div>
              </>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 