const WebSocket = require('ws');
const readline = require('readline');

const server = new WebSocket.Server({ host: '192.168.1.26', port: 8080 });
const clients = new Set();

console.log('Menunggu koneksi dari klien...');

server.on('connection', socket => {
  clients.add(socket);
  console.log('Client connected');

  socket.on('message', message => {
    try {
    
      const data = JSON.parse(message);
      console.log('============');
      console.log(`| ${data.username}: ${data.message}`);
      console.log('============');

     
      broadcast(JSON.stringify({
        username: data.username,
        message: data.message
      }));
    } catch (err) {
      console.log('Pesan tidak valid dari client');
    }
  });

  socket.on('close', () => {
    clients.delete(socket);
    console.log('Client disconnected');
  });
});

function broadcast(message) {
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptServerMessage() {
  rl.question('Pesan dari Server: ', (msg) => {
    const data = JSON.stringify({
      username: 'Server',
      message: msg
    });

    broadcast(data);

    console.log('============');
    console.log(`| Server: ${msg}`);
    console.log('============');

    promptServerMessage();
  });
}

promptServerMessage();
