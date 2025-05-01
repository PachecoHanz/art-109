const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);

  socket.on('mouse', (data) => {
    socket.broadcast.emit('mouse', data); // Send to all others
  });

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
  });
});

http.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});