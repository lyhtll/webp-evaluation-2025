import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './App.css';
import ChatRoom from './components/ChatRoom';
import NicknameForm from './components/NicknameForm';
import RoomList from './components/RoomList';

function App() {
  const [nickname, setNickname] = useState('');
  const [currentRoom, setCurrentRoom] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showRoomList, setShowRoomList] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Socket.IO 연결
    const newSocket = io();
    setSocket(newSocket);

    // 방 목록 업데이트
    newSocket.on('roomList', (roomList) => {
      setRooms(roomList);
    });

    // 방 생성 완료
    newSocket.on('roomCreated', (data) => {
      console.log('방이 생성되었습니다:', data);
    });

    // 방 목록 요청
    newSocket.emit('getRoomList');

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleJoin = (userNickname) => {
    setNickname(userNickname);
    setShowRoomList(true);
  };

  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId);
    setShowRoomList(false);
  };

  const handleCreateRoom = (roomName) => {
    if (socket) {
      socket.emit('createRoom', roomName);
    }
  };

  const handleBackToRoomList = () => {
    setCurrentRoom(null);
    setShowRoomList(true);
  };

  const handleBackToNickname = () => {
    setNickname('');
    setCurrentRoom(null);
    setShowRoomList(false);
  };

  if (!nickname) {
    return <NicknameForm onJoin={handleJoin} />;
  }

  if (showRoomList) {
    return (
      <RoomList 
        rooms={rooms}
        onJoinRoom={handleJoinRoom}
        onCreateRoom={handleCreateRoom}
      />
    );
  }

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

  return null;
}

export default App;
