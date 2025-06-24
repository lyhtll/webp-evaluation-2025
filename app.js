// Express, http, path, fileURLToPath 등 필요한 모듈 import
import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import setupSocket from './socket/setupSocket.js';

// __filename, __dirname 설정 (ESM 환경에서 경로 사용을 위해)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Express 앱과 HTTP 서버 생성
const app = express();
const server = http.createServer(app);

// React로 빌드된 정적 파일 제공 (프론트엔드 서비스)
app.use(express.static(path.join(__dirname, 'client/build')));

// Socket.IO 서버 설정 (실시간 통신)
setupSocket(server);

// 모든 GET 요청을 React 앱으로 라우팅 (SPA 지원)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

// 서버 시작 (포트는 환경변수 또는 3000)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`http://localhost:${PORT}에서 접속하세요.`);
});
