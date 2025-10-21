const WebSocket = require('ws')
const PORT = process.env.PORT || 10000

const server = new WebSocket.Server({ port: PORT })

console.log(`WebSocket server running on port ${PORT}`)

server.on('connection', socket => {
  console.log('New connection')

  socket.on('message', message => {
    console.log('Received:', message.toString())

    socket.send(`Echo: ${message}`)
  })

  socket.on('close', () => {
    console.log('Client disconnected')
  })

  socket.on('error', err => {
    console.error('WebSocket error:', err)
  })
})
