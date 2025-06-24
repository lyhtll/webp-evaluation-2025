import { processMessage } from './profanityFilter.js';

// 연결된 사용자 정보를 저장하는 Map (socket.id -> 사용자 정보)
const connectedUsers = new Map();
// 채팅방 정보를 저장하는 Map (roomId -> 방 정보)
const chatRooms = new Map();

// 채팅 관련 이벤트를 등록하는 함수 (io: Socket.io 서버, socket: 개별 클라이언트 소켓)
export default function registerChat(io, socket) {
    // 사용자가 채팅방에 입장할 때 처리
    socket.on('join', (data) => {
        const { nickname, roomId } = data;
        console.log('서버 join nickname:', nickname);
        
        // 방이 없으면 새로 생성
        if (!chatRooms.has(roomId)) {
            chatRooms.set(roomId, {
                id: roomId,
                name: `방 ${roomId}`,
                users: new Map(),
                createdAt: new Date()
            });
        }
        
        const room = chatRooms.get(roomId);
        
        // 사용자 정보 객체 생성 및 저장
        const userInfo = {
            id: socket.id,
            nickname: nickname,
            roomId: roomId,
            joinTime: new Date()
        };
        
        connectedUsers.set(socket.id, userInfo);
        room.users.set(socket.id, userInfo);
        
        // 해당 방에 소켓 입장
        socket.join(roomId);
        
        // 방 정보를 입장한 클라이언트에게 전송
        socket.emit('roomInfo', {
            id: room.id,
            name: room.name
        });
        
        // 입장 메시지를 해당 방에 브로드캐스트
        io.to(roomId).emit('userJoined', {
            nickname: nickname,
            message: `${nickname}님이 입장하셨습니다.`,
            timestamp: new Date().toLocaleTimeString()
        });
        
        // 방의 현재 접속자 수를 갱신하여 전송
        io.to(roomId).emit('userCount', room.users.size);
        
        // 전체 방 목록을 모든 클라이언트에 전송
        const roomList = Array.from(chatRooms.values()).map(room => ({
            id: room.id,
            name: room.name,
            userCount: room.users.size
        }));
        io.emit('roomList', roomList);
    });

    // 채팅 메시지 처리
    socket.on('chatMessage', async (data) => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            try {
                // 욕설 필터링 및 메시지 순화 적용
                const processed = await processMessage(data.message);
                console.log('[욕설 필터링 결과]', {
                  입력값: data.message,
                  filteredText: processed.filteredText,
                  wasSanitized: processed.wasSanitized,
                  hasProfanity: processed.hasProfanity
                });
                
                // 클라이언트에 보낼 메시지 데이터 구성
                const messageData = {
                    nickname: user.nickname,
                    filteredText: processed.filteredText,
                    originalText: data.message, // 사용자가 보낸 원본 메시지
                    message: processed.filteredText, // 항상 필터링된 메시지 포함
                    timestamp: new Date().toLocaleTimeString(),
                    socketId: socket.id,
                    wasFiltered: processed.hasProfanity, // 필터링 여부
                    wasSanitized: processed.wasSanitized // 순화 여부
                };
                
                console.log('서버에서 emit:', messageData);
                io.to(user.roomId).emit('message', messageData);
                
                if (processed.hasProfanity) {
                    console.log(`욕설 순화: ${user.nickname}님이 보낸 메시지 "${data.message}"가 순화되었습니다.`);
                }
            } catch (error) {
                // 필터링 처리 중 오류 발생 시 원본 메시지 그대로 전송
                console.error('메시지 처리 중 오류:', error);
                const messageData = {
                    nickname: user.nickname,
                    filteredText: data.message,
                    originalText: data.message,
                    message: data.message,
                    timestamp: new Date().toLocaleTimeString(),
                    socketId: socket.id,
                    wasFiltered: false,
                    wasSanitized: false
                };
                io.to(user.roomId).emit('message', messageData);
            }
        }
    });

    // 방 목록 요청 처리
    socket.on('getRoomList', () => {
        const roomList = Array.from(chatRooms.values()).map(room => ({
            id: room.id,
            name: room.name,
            userCount: room.users.size
        }));
        socket.emit('roomList', roomList);
    });

    // 새 방 생성 요청 처리
    socket.on('createRoom', (roomName) => {
        // 방 ID는 현재 시간의 timestamp로 생성
        const roomId = Date.now().toString();
        const newRoom = {
            id: roomId,
            name: roomName || `방 ${roomId}`,
            users: new Map(),
            createdAt: new Date()
        };
        
        chatRooms.set(roomId, newRoom);
        
        // 전체 방 목록 갱신 및 전송
        const roomList = Array.from(chatRooms.values()).map(room => ({
            id: room.id,
            name: room.name,
            userCount: room.users.size
        }));
        io.emit('roomList', roomList);
        
        // 방 생성 결과를 요청한 클라이언트에 전송
        socket.emit('roomCreated', { roomId, roomName: newRoom.name });
    });

    // 클라이언트 연결 해제(퇴장) 처리
    socket.on('disconnect', () => {
        const user = connectedUsers.get(socket.id);
        if (user) {
            const room = chatRooms.get(user.roomId);
            if (room) {
                // 방에서 사용자 제거
                room.users.delete(socket.id);
                
                // 방에 남은 사용자가 없으면 방 삭제
                if (room.users.size === 0) {
                    chatRooms.delete(user.roomId);
                } else {
                    // 퇴장 메시지를 해당 방에 브로드캐스트
                    io.to(user.roomId).emit('userLeft', {
                        nickname: user.nickname,
                        message: `${user.nickname}님이 퇴장하셨습니다.`,
                        timestamp: new Date().toLocaleTimeString()
                    });
                    
                    // 방의 현재 접속자 수 갱신
                    io.to(user.roomId).emit('userCount', room.users.size);
                }
            }
            
            // 전체 사용자 목록에서 제거
            connectedUsers.delete(socket.id);
            
            // 전체 방 목록 갱신 및 전송
            const roomList = Array.from(chatRooms.values()).map(room => ({
                id: room.id,
                name: room.name,
                userCount: room.users.size
            }));
            io.emit('roomList', roomList);
        }
    });
}