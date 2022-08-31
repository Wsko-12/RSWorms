import * as express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';
import User from './user/User';

const app = express();
const server = http.createServer(app);
const PORT: number = Number(process.env.PORT) || 3000;

const users: User[] = [];

const io = new Server(server);

server.listen(PORT, '0.0.0.0', undefined, () => {
    console.log(`Server started on port ${PORT}`);
});

io.on('connection', (socket) => {
    const user = new User(socket);
    users.push(user);
});

app.get('/', (_req, res) => {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/', express.static(__dirname + '/client'));
