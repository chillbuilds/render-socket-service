const WebSocket = require('ws')
const PORT = process.env.PORT || 10000

const server = new WebSocket.Server({ port: PORT })

console.log(`WebSocket server running on port ${PORT}`)

server.on('connection', socket => {
  console.log('New connection')

  socket.on('message', message => {
    console.log('Received:', message.toString())

    // Broadcast to all connected clients
    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        console.log(JSON.stringify(client))
        client.send(message.toString())
      }
    })
  })

  socket.on('close', () => {
    console.log('Client disconnected')
  })

  socket.on('error', err => {
    console.error('WebSocket error:', err)
  })
})
