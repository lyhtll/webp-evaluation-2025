import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatRoom.css';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';

const ChatRoom = ({ nickname }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Socket.IO 연결
    const newSocket = io();
    setSocket(newSocket);

    // 연결 이벤트
    newSocket.on('connect', () => {
      console.log('서버에 연결되었습니다.');
      setIsConnected(true);
      
      // 닉네임으로 입장
      newSocket.emit('join', nickname);
    });

    // 연결 해제 이벤트
    newSocket.on('disconnect', () => {
      console.log('서버와의 연결이 끊어졌습니다.');
      setIsConnected(false);
    });

    // 메시지 수신
    newSocket.on('message', (data) => {
      setMessages(prev => [...prev, { ...data, type: 'message' }]);
    });

    // 사용자 입장
    newSocket.on('userJoined', (data) => {
      setMessages(prev => [...prev, { ...data, type: 'system' }]);
    });

    // 사용자 퇴장
    newSocket.on('userLeft', (data) => {
      setMessages(prev => [...prev, { ...data, type: 'system' }]);
    });

    // 접속자 수 업데이트
    newSocket.on('userCount', (count) => {
      setUserCount(count);
    });

    // 연결 오류
    newSocket.on('connect_error', (error) => {
      console.error('연결 오류:', error);
      alert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    });

    // 컴포넌트 언마운트 시 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, [nickname]);

  // 메시지 전송
  const sendMessage = (message) => {
    if (socket && message.trim()) {
      socket.emit('chatMessage', { message: message.trim() });
    }
  };

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-room">
      <Header userCount={userCount} isConnected={isConnected} />
      <MessageList 
        messages={messages} 
        currentUser={nickname}
        messagesEndRef={messagesEndRef}
      />
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom; 