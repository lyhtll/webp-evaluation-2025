import React from 'react';
import './Header.css';

const Header = ({ userCount, isConnected }) => {
  return (
    <div className="header">
      <div className="header-content">
        <h1>실시간 채팅</h1>
        <div className="header-info">
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