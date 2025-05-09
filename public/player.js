const socket = io();
document.getElementById('playerName').innerText = sessionStorage.getItem('name');

socket.emit('join', {
  name: sessionStorage.getItem('name'),
  role: sessionStorage.getItem('role')
});

socket.on('receiveQuestion', (question) => {
  document.getElementById('questionBox').innerText = question;
});
