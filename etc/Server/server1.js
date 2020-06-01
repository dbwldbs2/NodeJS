const http = require('http');
const fs = require('fs');


const server = http.createServer((req, res) => {
    fs.readFile('./server2.html', (err, data) => {
        if(err) {
            throw err;
        }
        res.end(data);
    });
});

server.listen(8080);

server.on('listening', () => {
    console.log('8080포트에서 서버 대기중입니다.');
});

server.on('error', (error) => {
    console.log(error);
});
