import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import setupSocket from './socket/setupSocket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// React 빌드 파일 제공
app.use(express.static(path.join(__dirname, 'client/build')));

// Socket.IO 설정
setupSocket(server);

// 모든 GET 요청을 React 앱으로 라우팅 (SPA 지원)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 서버 시작
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT}에서 접속하세요.`);
});
