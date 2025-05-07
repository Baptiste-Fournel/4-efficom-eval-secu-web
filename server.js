const http = require('http');
const app = require('./app.js');

const port = 3000;

const server = http.createServer(app);

const blockedIps = ['127.0.0.1']; 

app.use((req, res, next) => {
    const ip = req.ip;
    if (blockedIps.includes(ip)) {
        return res.status(403).send('Access denied');
    }
    next();
});

server.on('listening',() => {
    console.log("server en route sur le port : " + port);
});

server.listen(port);