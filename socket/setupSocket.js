import { Server } from "socket.io";
import registerChat from "./chatHandler.js";

let io;

const setupSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST","DELETE"],
        }
    });

    io.on("connection", (socket) => {
        console.log(`${socket.id} connected`);

        // 채팅 기능 등록
        registerChat(io, socket);
    });

    return io;
};

export { io };
export default setupSocket;