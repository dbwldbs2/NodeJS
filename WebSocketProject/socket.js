const SocketIO = require('socket.io');

module.exports = (server, app, sessionMiddleware) => {
    const io = SocketIO(server, {path: '/socket.io'});
    app.set('io', io);
    
    const room = io.of('./room');
    const chat = io.of('./chat');
    io.use((socket, next) => {
        sessionMiddleware(socket.request, socket.request.res, next);
    });

    room.on('connection', (socket) => {
        console.log('room 네임 스페이스에 접속');

        socket.on('disconnect', () => {
            console.log('room 네임스페이스 접속 해제');
        });
    });

    chat.on('connection', (socket) => {
        console.log('chat 네임 스페이스에 접속');

        const req = socket.request;
        const {headers: {referer}} = req;

        console.log('referer :: ', referer);
        
        const roomId = referer
            .split('/')[referer.split('/').length -1]
            .replace(/\?.+/, '');
        
        socket.join(roomId);
        socket.to(roomId).emdi('join', {
            user: 'system',
            chat: `${req.session.color}님이 입장하셨습니다.`
        });

        socket.on('disconnect', () => {
            console.log('chat 네임스페이스 접속 해제');
            socket.leave(roomId);
            
            const currentRoom = socket.adapter.room[roomId];
            const userCount = currentRoom ? currentRoom.length : 0;
            if (userCount === 0) {
                axios.delete(`http://localhost:8005/room/${roomId}`)
                    .then(() => {
                        console.log('방 제거 요청 성공');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                socket.to(roomId).emit('exit', {
                    user: 'system',
                    chat: `${req.session.color}님이 퇴장하셨습니다.`
                });
            }
        });
    });
}; 