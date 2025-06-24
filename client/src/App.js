import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatRoom from './components/ChatRoom';
import NicknameForm from './components/NicknameForm';
import RoomList from './components/RoomList';

// 앱의 최상위 컴포넌트
function App() {
  // 닉네임 상태 (닉네임이 없으면 닉네임 입력 폼 표시)
  const [nickname, setNickname] = useState('');
  // 현재 입장한 방 ID (null이면 방에 입장하지 않은 상태)
  const [currentRoom, setCurrentRoom] = useState(null);
  // 전체 방 목록 상태
  const [rooms, setRooms] = useState([]);
  // 방 목록 화면 표시 여부
  const [showRoomList, setShowRoomList] = useState(false);
  // 소켓 인스턴스 상태
  const [socket, setSocket] = useState(null);

  // 컴포넌트 마운트 시 소켓 연결 및 이벤트 등록
  useEffect(() => {
    // Socket.IO 서버에 연결
    const newSocket = io();
    setSocket(newSocket);

    // 서버에서 방 목록을 받을 때
    newSocket.on('roomList', (roomList) => {
      setRooms(roomList);
    });

    // 방 생성 완료 시(알림용)
    newSocket.on('roomCreated', (data) => {
      console.log('방이 생성되었습니다:', data);
    });

    // 서버에 방 목록 요청
    newSocket.emit('getRoomList');

    // 언마운트 시 소켓 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // 닉네임 입력 후 입장 처리
  const handleJoin = (userNickname) => {
    setNickname(userNickname);
    setShowRoomList(true); // 방 목록 화면으로 이동
  };

  // 방 입장 처리
  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId);
    setShowRoomList(false); // 채팅방 화면으로 이동
  };

  // 방 생성 처리
  const handleCreateRoom = (roomName) => {
    if (socket) {
      socket.emit('createRoom', roomName);
    }
  };

  // 채팅방에서 방 목록으로 돌아가기
  const handleBackToRoomList = () => {
    setCurrentRoom(null);
    setShowRoomList(true);
  };

  // 닉네임 변경(처음 화면으로 돌아가기)
  const handleBackToNickname = () => {
    setNickname('');
    setCurrentRoom(null);
    setShowRoomList(false);
  };

  // 닉네임이 없으면 닉네임 입력 폼 표시
  if (!nickname) {
    return <NicknameForm onJoin={handleJoin} />;
  }

  // 방 목록 화면 표시
  if (showRoomList) {
    return (
      <RoomList 
        rooms={rooms}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
    );
  }

  // 채팅방 화면 표시
  if (currentRoom) {
    return (
      <ChatRoom 
        nickname={nickname}
        roomId={currentRoom}
        onBackToRoomList={handleBackToRoomList}
        onBackToNickname={handleBackToNickname}
      />
    );
  }

  // 아무것도 없을 때(null 반환)
  return null;
}

export default App;
