const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

const users = {}; // Map username -> socket.id

io.on('connection', socket => {
  console.log('User connected');

  // Register username on connection
  socket.on('register', username => {
    users[username] = socket.id;
    console.log(`${username} registered with socket ID ${socket.id}`);
  });

  // Broadcast normal chat message
  socket.on('chat message', (data, ack) => {
    io.emit('chat message', data); // Send to everyone
    if (ack) ack(); // Acknowledge receipt
  });

  // Handle private message
  socket.on('private message', ({ to, from, text }) => {
    const targetSocket = users[to];
    if (targetSocket) {
      io.to(targetSocket).emit('chat message', { user: `🔒 ${from} (whisper)`, text });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => console.log('🚀 Chat server running at http://localhost:3000'));
