// 연결된 사용자들을 저장할 Map (모듈 레벨에서 관리)
const connectedUsers = new Map();
// 채팅방들을 저장할 Map
const chatRooms = new Map();

export default function registerChat(io, socket) {
    // 사용자 입장 처리
    socket.on('join', (data) => {
        const { nickname, roomId } = data;
        
        // 방이 없으면 생성
        if (!chatRooms.has(roomId)) {
            chatRooms.set(roomId, {
                id: roomId,
                name: `방 ${roomId}`,
                users: new Map(),
                createdAt: new Date()
            });
        }
        
        const room = chatRooms.get(roomId);
        
        // 사용자 정보 저장
        const userInfo = {
            id: socket.id,
            nickname: nickname,
            roomId: roomId,
            joinTime: new Date()
        };
        
        connectedUsers.set(socket.id, userInfo);
        room.users.set(socket.id, userInfo);
        
        // 해당 방에만 입장
        socket.join(roomId);
        
        // 방 정보를 클라이언트에 전달
        socket.emit('roomInfo', {
            id: room.id,
            name: room.name
        });
        
        // 입장 메시지를 해당 방에만 브로드캐스트
        io.to(roomId).emit('userJoined', {
            nickname: nickname,
            message: `${nickname}님이 입장하셨습니다.`,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // 해당 방의 접속자 수 업데이트
        io.to(roomId).emit('userCount', room.users.size);
        
        // 방 목록 업데이트 (모든 클라이언트에게)
        const roomList = Array.from(chatRooms.values()).map(room => ({
            id: room.id,
            name: room.name,
            userCount: room.users.size
        }));
        io.emit('roomList', roomList);
    });

    // 채팅 메시지 처리
    socket.on('chatMessage', (data) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            const messageData = {
                nickname: user.nickname,
                message: data.message,
                timestamp: new Date().toLocaleTimeString(),
                socketId: socket.id
            };
            
            // 해당 방에만 메시지 브로드캐스트
            io.to(user.roomId).emit('message', messageData);
        }
    });

    // 방 목록 요청
    socket.on('getRoomList', () => {
        const roomList = Array.from(chatRooms.values()).map(room => ({
            id: room.id,
            name: room.name,
            userCount: room.users.size
        }));
        socket.emit('roomList', roomList);
    });

    // 새 방 생성
    socket.on('createRoom', (roomName) => {
        const roomId = Date.now().toString();
        const newRoom = {
            id: roomId,
            name: roomName || `방 ${roomId}`,
            users: new Map(),
            createdAt: new Date()
        };
        
        chatRooms.set(roomId, newRoom);
        
        // 방 목록 업데이트
        const roomList = Array.from(chatRooms.values()).map(room => ({
            id: room.id,
            name: room.name,
            userCount: room.users.size
        }));
        io.emit('roomList', roomList);
        
        socket.emit('roomCreated', { roomId, roomName: newRoom.name });
    });

    // 연결 해제 처리
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            const room = chatRooms.get(user.roomId);
            if (room) {
                // 방에서 사용자 제거
                room.users.delete(socket.id);
                
                // 방이 비었으면 방 삭제
                if (room.users.size === 0) {
                    chatRooms.delete(user.roomId);
                } else {
                    // 퇴장 메시지를 해당 방에만 브로드캐스트
                    io.to(user.roomId).emit('userLeft', {
                        nickname: user.nickname,
                        message: `${user.nickname}님이 퇴장하셨습니다.`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    
                    // 해당 방의 접속자 수 업데이트
                    io.to(user.roomId).emit('userCount', room.users.size);
                }
            }
            
            // 사용자 정보 제거
            connectedUsers.delete(socket.id);
            
            // 방 목록 업데이트
            const roomList = Array.from(chatRooms.values()).map(room => ({
                id: room.id,
                name: room.name,
                userCount: room.users.size
            }));
            io.emit('roomList', roomList);
        }
    });
}