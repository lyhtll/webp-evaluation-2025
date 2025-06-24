import React, { useState } from 'react';
import './RoomList.css';

// 채팅방 목록 컴포넌트
// props: rooms(방 목록), onJoinRoom(방 입장 함수), onCreateRoom(방 생성 함수)
const RoomList = ({ rooms, onJoinRoom, onCreateRoom }) => {
  // 방 생성 모달 표시 여부 상태
  const [showCreateModal, setShowCreateModal] = useState(false);
  // 새 방 이름 입력 상태
  const [newRoomName, setNewRoomName] = useState('');

  // 방 생성 폼 제출 시 실행되는 함수
  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      onCreateRoom(newRoomName.trim()); // 부모 컴포넌트에 새 방 생성 요청
      setNewRoomName(''); // 입력창 초기화
      setShowCreateModal(false); // 모달 닫기
    }
  };

  return (
    <div className="roomlist-outer">
      <div className="roomlist-header">
        <h2>채팅방 목록</h2>
      </div>
      <div className="roomlist-list">
        {rooms.length === 0 ? (
          // 방이 없을 때 안내 메시지
          <div className="roomlist-empty">아직 생성된 채팅방이 없습니다.<br/>오른쪽 아래 + 버튼으로 방을 만들어보세요!</div>
        ) : (
          // 방이 있을 때 목록 표시
          rooms.map(room => (
            <div key={room.id} className="roomlist-card">
              <div className="roomlist-card-main">
                <div className="roomlist-card-title">{room.name}</div>
                <div className="roomlist-card-users">👥 {room.userCount}명</div>
              </div>
              {/* 방 입장 버튼 */}
              <button 
                className="roomlist-join-btn"
                onClick={() => onJoinRoom(room.id)}
              >
                입장
              </button>
            </div>
          ))
        )}
      </div>
      <button className="roomlist-fab" onClick={() => setShowCreateModal(true)}>＋</button>
      {showCreateModal && (
        <div className="roomlist-modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="roomlist-modal" onClick={e => e.stopPropagation()}>
            <h3>새 채팅방 만들기</h3>
            <form onSubmit={handleCreateRoom} className="roomlist-modal-form">
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
            <button className="roomlist-modal-close" onClick={() => setShowCreateModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomList; 