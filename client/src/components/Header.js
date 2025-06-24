import React from 'react';
import './Header.css';

// 채팅방 상단 헤더 컴포넌트
// props: userCount(접속자 수), isConnected(서버 연결 상태), roomName(방 이름),
//        onBackToRoomList(방 목록으로 이동), onBackToNickname(닉네임 변경)
const Header = ({ userCount, isConnected, roomName, onBackToRoomList, onBackToNickname }) => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          {/* 방 목록으로 돌아가는 버튼 */}
          <button className="back-btn" onClick={onBackToRoomList}>
            ← 방 목록
          </button>
          {/* 닉네임 변경 버튼 */}
          <button className="back-btn" onClick={onBackToNickname}>
            ← 닉네임 변경
          </button>
        </div>
        <div className="header-center">
          {/* 현재 방 이름 표시 */}
          <h1>{roomName}</h1>
        </div>
        <div className="header-right">
          {/* 접속자 수 표시 */}
          <div className="user-count">
            접속자 수: <span>{userCount}</span>명
          </div>
          {/* 서버 연결 상태 표시 */}
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '연결됨' : '연결 끊김'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 