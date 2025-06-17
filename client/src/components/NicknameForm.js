import React, { useState } from 'react';
import './NicknameForm.css';

const NicknameForm = ({ onJoin }) => {
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    
    if (!trimmedNickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    
    if (trimmedNickname.length > 20) {
      setError('닉네임은 20자 이하로 입력해주세요.');
      return;
    }
    
    setError('');
    onJoin(trimmedNickname);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="nickname-container">
      <div className="nickname-form">
        <h1>실시간 채팅</h1>
        <h2>채팅방 입장</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="닉네임을 입력하세요"
            maxLength={20}
            autoFocus
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit">입장하기</button>
        </form>
      </div>
    </div>
  );
};

export default NicknameForm; 