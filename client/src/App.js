import React, { useState } from 'react';
import './App.css';
import ChatRoom from './components/ChatRoom';
import NicknameForm from './components/NicknameForm';

function App() {
  const [nickname, setNickname] = useState('');
  const [isJoined, setIsJoined] = useState(false);

  const handleJoin = (userNickname) => {
    setNickname(userNickname);
    setIsJoined(true);
  };

  return (
    <div className="App">
      {!isJoined ? (
        <NicknameForm onJoin={handleJoin} />
      ) : (
        <ChatRoom nickname={nickname} />
      )}
    </div>
  );
}

export default App;
