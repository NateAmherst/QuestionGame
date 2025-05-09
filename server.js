const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

let players = {};
let gameRunner = null;
let imposters = new Set();

io.on('connection', (socket) => {
  socket.on('join', ({ name, role }) => {
    players[socket.id] = { name, role, active: true };
    if (role === 'runner') gameRunner = socket.id;
    io.emit('playerList', getPlayerList());
  });

  socket.on('setImposters', (ids) => {
    imposters = new Set(ids);
  });

  socket.on('sendQuestions', ({ regular, imposter }) => {
    for (let id in players) {
      if (!players[id].active) continue;
      const q = imposters.has(id) ? imposter : regular;
      io.to(id).emit('receiveQuestion', q);
    }
  });

  socket.on('disconnect', () => {
    delete players[socket.id];
    if (socket.id === gameRunner) gameRunner = null;
    io.emit('playerList', getPlayerList());
  });
});

function getPlayerList() {
  return Object.entries(players).map(([id, p]) => ({ id, ...p }));
}

http.listen(3000, () => console.log('Server running on http://localhost:3000'));
