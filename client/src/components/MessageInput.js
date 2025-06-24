import React, { useState } from 'react';
import './MessageInput.css';

// 채팅 메시지 입력창 컴포넌트
// props: onSendMessage(메시지 전송 함수)
const MessageInput = ({ onSendMessage }) => {
  // 입력 중인 메시지 상태
  const [message, setMessage] = useState('');

  // 폼 제출(전송 버튼 클릭 또는 엔터) 시 실행
  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message); // 부모 컴포넌트로 메시지 전송
      setMessage(''); // 입력창 초기화
    }
  };

  // 입력창에서 엔터키 입력 시 전송 (shift+enter는 줄바꿈)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="message-input-container">
      {/* 입력창과 전송 버튼이 들어있는 폼 */}
      <form onSubmit={handleSubmit} className="message-input-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          maxLength={200}
          className="message-input"
        />
        {/* 메시지가 있을 때만 전송 버튼 활성화 */}
        <button 
          type="submit" 
          className="send-button"
          disabled={!message.trim()}
        >
          전송
        </button>
      </form>
    </div>
  );
};

export default MessageInput; 