import React, { useState } from 'react';
import './NicknameForm.css';

// 닉네임 입력 폼 컴포넌트
// props: onJoin(닉네임으로 입장 함수)
const NicknameForm = ({ onJoin }) => {
  // 입력 중인 닉네임 상태
  const [nickname, setNickname] = useState('');
  // 에러 메시지 상태
  const [error, setError] = useState('');

  // 폼 제출(입장 버튼 클릭 또는 엔터) 시 실행
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedNickname = nickname.trim();
    
    // 닉네임이 비었을 때
    if (!trimmedNickname) {
      setError('닉네임을 입력해주세요.');
      return;
    }
    // 닉네임이 20자 초과일 때
    if (trimmedNickname.length > 20) {
      setError('닉네임은 20자 이하로 입력해주세요.');
      return;
    }
    // 정상 입력 시 에러 초기화 및 입장 처리
    setError('');
    onJoin(trimmedNickname);
  };

  // 입력창에서 엔터키 입력 시 바로 제출
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
          {/* 에러 메시지 표시 */}
          {error && <div className="error-message">{error}</div>}
          <button type="submit">입장하기</button>
        </form>
      </div>
    </div>
  );
};

export default NicknameForm; 