// Socket.IO 연결
const socket = io();

// DOM 요소들
const nicknameScreen = document.getElementById('nicknameScreen');
const chatScreen = document.getElementById('chatScreen');
const nicknameInput = document.getElementById('nicknameInput');
const joinBtn = document.getElementById('joinBtn');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const userCountSpan = document.getElementById('userCount');

// 현재 사용자 정보
let currentUser = null;

// 유틸리티 함수들
function showError(message) {
    alert(message);
}

function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(data, type = 'other') {
    try {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        if (type === 'system') {
            messageContent.textContent = data.message;
        } else {
            const nicknameDiv = document.createElement('div');
            nicknameDiv.className = 'message-nickname';
            nicknameDiv.textContent = data.nickname;
            messageContent.appendChild(nicknameDiv);
            
            const textDiv = document.createElement('div');
            textDiv.textContent = data.message;
            messageContent.appendChild(textDiv);
        }
        
        const infoDiv = document.createElement('div');
        infoDiv.className = 'message-info';
        infoDiv.textContent = data.timestamp;
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(infoDiv);
        
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    } catch (error) {
        console.error('메시지 추가 중 오류:', error);
    }
}

// 이벤트 리스너들
joinBtn.addEventListener('click', () => {
    const nickname = nicknameInput.value.trim();
    
    if (!nickname) {
        showError('닉네임을 입력해주세요.');
        return;
    }
    
    if (nickname.length > 20) {
        showError('닉네임은 20자 이하로 입력해주세요.');
        return;
    }
    
    try {
        currentUser = nickname;
        socket.emit('join', nickname);
        
        // 화면 전환
        nicknameScreen.style.display = 'none';
        chatScreen.style.display = 'flex';
        
        // 입력 필드 초기화
        nicknameInput.value = '';
        
        // 메시지 입력 필드에 포커스
        messageInput.focus();
    } catch (error) {
        console.error('입장 처리 중 오류:', error);
        showError('입장 중 오류가 발생했습니다.');
    }
});

nicknameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinBtn.click();
    }
});

sendBtn.addEventListener('click', () => {
    sendMessage();
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) {
        return;
    }
    
    if (message.length > 200) {
        showError('메시지는 200자 이하로 입력해주세요.');
        return;
    }
    
    try {
        socket.emit('chatMessage', { message: message.trim() });
        messageInput.value = '';
    } catch (error) {
        console.error('메시지 전송 중 오류:', error);
        showError('메시지 전송 중 오류가 발생했습니다.');
    }
}

// Socket.IO 이벤트 핸들러들
socket.on('connect', () => {
    console.log('서버에 연결되었습니다.');
});

socket.on('disconnect', () => {
    console.log('서버와의 연결이 끊어졌습니다.');
    showError('서버와의 연결이 끊어졌습니다. 페이지를 새로고침해주세요.');
});

socket.on('userJoined', (data) => {
    addMessage(data, 'system');
});

socket.on('userLeft', (data) => {
    addMessage(data, 'system');
});

socket.on('message', (data) => {
    const messageType = data.nickname === currentUser ? 'user' : 'other';
    addMessage(data, messageType);
});

socket.on('userCount', (count) => {
    userCountSpan.textContent = count;
});

// 연결 오류 처리
socket.on('connect_error', (error) => {
    console.error('연결 오류:', error);
    showError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
});

// 페이지 언로드 시 처리
window.addEventListener('beforeunload', () => {
    if (currentUser) {
        socket.emit('disconnect');
    }
});

// 초기 설정
messageInput.focus();

// 채팅 메시지 처리
socket.on('chatMessage', (data) => {
    const user = connectedUsers.get(socket.id);
    if (user) {
        const messageData = {
            nickname: user.nickname, // 서버에서 닉네임을 붙임
            message: data.message,
            timestamp: new Date().toLocaleTimeString()
        };
        io.to(user.roomId).emit('message', messageData);
    }
}); 