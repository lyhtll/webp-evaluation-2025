import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './ChatRoom.css';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Header from './Header';

// 채팅방 컴포넌트
// props: nickname(닉네임), roomId(방ID), onBackToRoomList(방 목록으로), onBackToNickname(닉네임 변경)
const ChatRoom = ({ nickname, roomId, onBackToRoomList, onBackToNickname }) => {
  // 소켓 인스턴스 상태
  const [socket, setSocket] = useState(null);
  // 채팅 메시지 배열 상태
  const [messages, setMessages] = useState([]);
  // 현재 방의 접속자 수
  const [userCount, setUserCount] = useState(0);
  // 서버 연결 상태
  const [isConnected, setIsConnected] = useState(false);
  // 방 이름
  const [roomName, setRoomName] = useState(`방 ${roomId}`);
  // 내 소켓 ID (내가 보낸 메시지 구분용)
  const [mySocketId, setMySocketId] = useState(null);
  // 메시지 리스트의 맨 아래 ref (자동 스크롤용)
  const messagesEndRef = useRef(null);

  // 컴포넌트 마운트 시 소켓 연결 및 이벤트 등록
  useEffect(() => {
    // Socket.IO 서버에 연결
    const newSocket = io();
    setSocket(newSocket);

    // 서버와 연결되었을 때
    newSocket.on('connect', () => {
      console.log('서버에 연결되었습니다.');
      setMySocketId(newSocket.id); // 내 소켓 ID 저장
      setIsConnected(true); // 연결 상태 true
      // 서버에 join 이벤트로 닉네임, 방ID 전달
      console.log('join emit nickname:', nickname);
      newSocket.emit('join', { nickname, roomId });
    });

    // 서버와 연결이 끊겼을 때
    newSocket.on('disconnect', () => {
      console.log('서버와의 연결이 끊어졌습니다.');
      setIsConnected(false);
    });

    // 방 정보 수신 (방 이름 등)
    newSocket.on('roomInfo', (data) => {
      setRoomName(data.name);
    });

    // 일반 메시지 수신
    newSocket.on('message', (data) => {
      console.log('클라에서 수신:', data);
      setMessages(prev => {
        const newMsg = { ...data, type: 'message' };
        console.log('setMessages newMsg:', newMsg);
        return [...prev, newMsg];
      });
    });

    // 시스템 메시지: 사용자 입장
    newSocket.on('userJoined', (data) => {
      setMessages(prev => [...prev, { ...data, type: 'system' }]);
    });

    // 시스템 메시지: 사용자 퇴장
    newSocket.on('userLeft', (data) => {
      setMessages(prev => [...prev, { ...data, type: 'system' }]);
    });

    // 접속자 수 업데이트
    newSocket.on('userCount', (count) => {
      setUserCount(count);
    });

    // 연결 오류 발생 시
    newSocket.on('connect_error', (error) => {
      console.error('연결 오류:', error);
      alert('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, [nickname, roomId]);

  // 메시지 전송 함수 (MessageInput에서 호출)
  const sendMessage = (message) => {
    if (socket && message.trim()) {
      console.log('메시지 전송:', message, '사용자:', nickname);
      socket.emit('chatMessage', { message: message.trim() });
    }
  };

  // 메시지 리스트를 맨 아래로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 배열이 바뀔 때마다 자동 스크롤
  useEffect(() => {
    scrollToBottom();
    console.log('messages 배열 상태:', messages);
  }, [messages]);

  // 실제 렌더링되는 UI
  return (
    <div className="chat-room">
      {/* 상단 헤더: 방 이름, 접속자 수, 뒤로가기 등 */}
      <Header 
        userCount={userCount} 
        isConnected={isConnected}
        roomName={roomName}
        onBackToRoomList={onBackToRoomList}
        onBackToNickname={onBackToNickname}
      />
      {/* 메시지 리스트 영역 */}
      <MessageList 
        messages={messages} 
        mySocketId={mySocketId}
        messagesEndRef={messagesEndRef}
      />
      {/* 메시지 입력창 */}
      <MessageInput onSendMessage={sendMessage} />
    </div>
  );
};

export default ChatRoom; 