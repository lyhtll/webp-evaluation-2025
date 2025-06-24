import React from 'react';
import './MessageList.css';

// 채팅 메시지 리스트를 보여주는 컴포넌트
// props: messages(메시지 배열), mySocketId(내 소켓ID), messagesEndRef(맨 아래 ref)
const MessageList = ({ messages, mySocketId, messagesEndRef }) => {
  // 메시지 타입(내 메시지/상대 메시지/시스템 메시지) 구분 함수
  const getMessageType = (message) => {
    if (message.type === 'system') return 'system'; // 시스템 메시지(입장/퇴장 등)
    return message.socketId === mySocketId ? 'user' : 'other'; // 내 메시지/상대 메시지
  };

  return (
    <div className="message-list">
      {/* 메시지 배열을 순회하며 각 메시지 렌더링 */}
      {messages.map((message, index) => {
        const type = getMessageType(message);
        if (type === 'system') {
          // 시스템 메시지는 채팅창 전체 너비에서 중앙에만 띄움
          return (
            <div key={index} className="message system" style={{ width: '100%' }}>
              <div className="system-message">{message.message}</div>
            </div>
          );
        }
        if (type === 'other') {
          // 상대방 메시지: 닉네임, 말풍선, 시간 모두 왼쪽 정렬
          return (
            <div key={index} className="message other">
              <div className="message-bubble">
                <div className="message-nickname">{message.nickname}</div>
                <div className="message-text">{message.message}</div>
                <div className="message-time">{message.timestamp}</div>
              </div>
            </div>
          );
        }
        // 내 메시지
        return (
          <div key={index} className="message user">
            <div className="message-text">{message.message}</div>
            <div className="message-time">{message.timestamp}</div>
          </div>
        );
      })}
      {/* 스크롤 자동 이동을 위한 ref */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 