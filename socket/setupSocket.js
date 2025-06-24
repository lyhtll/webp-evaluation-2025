import { Server } from "socket.io";
import registerChat from "./chatHandler.js";

let io; // Socket.io 서버 인스턴스 전역 변수

// 서버에 Socket.io를 설정하는 함수
const setupSocket = (server) => {
    // Socket.io 서버 생성 및 CORS 설정
    io = new Server(server, {
        cors: {
            origin: "*", // 모든 도메인 허용
            methods: ["GET", "POST","DELETE"], // 허용 메서드
        }
    });

    // 클라이언트가 소켓으로 연결될 때마다 실행
    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`); // 연결된 소켓 ID 출력

        // 채팅 관련 이벤트 등록 (join, chatMessage 등)
        registerChat(io, socket);
    });

    return io; // 생성된 io 객체 반환
};

export { io }; // 외부에서 io 직접 접근 가능
export default setupSocket; // 기본 내보내기