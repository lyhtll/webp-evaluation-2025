// 연결된 사용자들을 저장할 Map (모듈 레벨에서 관리)
const connectedUsers = new Map();

export default function registerChat(io, socket) {
    // 사용자 입장 처리
    socket.on('join', (nickname) => {
        // 사용자 정보 저장
        connectedUsers.set(socket.id, {
            id: socket.id,
            nickname: nickname,
            joinTime: new Date()
        });

        // 입장 메시지 브로드캐스트
        io.emit('userJoined', {
            nickname: nickname,
            message: `${nickname}님이 입장하셨습니다.`,
            timestamp: new Date().toLocaleTimeString()
        });

        // 접속자 수 업데이트
        io.emit('userCount', connectedUsers.size);
    });

    // 채팅 메시지 처리
    socket.on('chatMessage', (data) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            io.emit('message', {
                nickname: user.nickname,
                message: data.message,
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });

    // 연결 해제 처리
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            // 사용자 정보 제거
            connectedUsers.delete(socket.id);

            // 퇴장 메시지 브로드캐스트
            io.emit('userLeft', {
                nickname: user.nickname,
                message: `${user.nickname}님이 퇴장하셨습니다.`,
                timestamp: new Date().toLocaleTimeString()
            });

            // 접속자 수 업데이트
            io.emit('userCount', connectedUsers.size);
        }
    });
}