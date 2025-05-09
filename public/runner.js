const socket = io();
document.getElementById('runnerName').innerText = sessionStorage.getItem('name');

socket.emit('join', {
  name: sessionStorage.getItem('name'),
  role: sessionStorage.getItem('role')
});

let currentPlayers = [];

socket.on('playerList', (players) => {
  currentPlayers = players.filter(p => p.role === 'player');
  updatePlayerList();
});

function updatePlayerList() {
  const div = document.getElementById('playerList');
  div.innerHTML = '';
  currentPlayers.forEach(p => {
    const wrapper = document.createElement('label');
    wrapper.className = 'checkbox-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = p.id;

    const span = document.createElement('span');
    span.innerText = p.name;

    wrapper.appendChild(checkbox);
    wrapper.appendChild(span);
    div.appendChild(wrapper);
  });
}

function sendQuestions() {
  const imposterIDs = Array.from(document.querySelectorAll('#playerList input:checked')).map(cb => cb.value);
  socket.emit('setImposters', imposterIDs);
  socket.emit('sendQuestions', {
    regular: document.getElementById('regularQuestion').value,
    imposter: document.getElementById('imposterQuestion').value
  });
}
