import React, { useState } from 'react';
import './RoomList.css';

const RoomList = ({ rooms, onJoinRoom, onCreateRoom }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName.trim());
      setNewRoomName('');
      setShowCreateForm(false);
    }
  };

  return (
    <div className="room-list-container">
      <div className="room-list-header">
        <h2>채팅방 목록</h2>
        <button 
          className="create-room-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '취소' : '방 만들기'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateRoom} className="create-room-form">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="방 이름을 입력하세요"
            maxLength={30}
            autoFocus
          />
          <button type="submit">생성</button>
        </form>
      )}

      <div className="rooms">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>채팅방이 없습니다.</p>
            <p>방을 만들어보세요!</p>
          </div>
        ) : (
          rooms.map(room => (
            <div key={room.id} className="room-item">
              <div className="room-info">
                <h3>{room.name}</h3>
                <p className="room-users">👥 {room.userCount}명</p>
              </div>
              <button 
                className="join-room-btn"
                onClick={() => onJoinRoom(room.id)}
              >
                입장
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomList; 