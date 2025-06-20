const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.static('public'));

const server = http.createServer(app);
const io = new Server(server);

// This sets up a listener: when a client connects, you log it and can now listen to their messages.
io.on('connection', socket => {
  console.log('User connected');

  // When any client sends a "chat message" event, the server broadcasts it to all connected clients, including the sender.
  socket.on('chat message', msg => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => console.log('User disconnected'));
});

server.listen(3000, () => console.log('http://localhost:3000'));