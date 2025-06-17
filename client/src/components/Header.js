import React from 'react';
import './Header.css';

const Header = ({ userCount, isConnected, roomName, onBackToRoomList, onBackToNickname }) => {
  return (
    <div className="header">
      <div className="header-content">
        <div className="header-left">
          <button className="back-btn" onClick={onBackToRoomList}>
            ← 방 목록
          </button>
          <button className="back-btn" onClick={onBackToNickname}>
            ← 닉네임 변경
          </button>
        </div>
        <div className="header-center">
          <h1>{roomName}</h1>
        </div>
        <div className="header-right">
          <div className="user-count">
            접속자 수: <span>{userCount}</span>명
          </div>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '연결됨' : '연결 끊김'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 