import App from './app/App';
import './style.scss';
import { io } from 'socket.io-client';
const app = new App();
const socket = io();
app.start();