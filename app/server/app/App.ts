import * as express from 'express';
import * as http from 'http';
import SocketsManager from './managers/socketsManager/SocketsManager';
import UserManager from './managers/userManager/UserManager';

export default class App {
    private app = express();
    private server = http.createServer(this.app);
    private PORT: number = Number(process.env.PORT) || 3000;
    private socketManager = new SocketsManager(this.server);
    private usersManager = new UserManager();
    public start() {
        this.server.listen(this.PORT, '0.0.0.0', undefined, () => {
            console.log(`Server started on port ${this.PORT}`);
        });

        this.app.get('/', (_req, res) => {
            res.sendFile(__dirname + '/client/index.html');
        });

        this.app.use('/', express.static(__dirname + '/client'));
    }
}
