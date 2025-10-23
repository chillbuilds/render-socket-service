require('dotenv').config()
const WebSocket = require('ws')
const mysql = require('mysql2')
const PORT = process.env.PORT || 10000

const clientDB = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10, // maximum number of connections in the pool
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 // delay of 10 seconds before sending keep-alive packets
})

const server = new WebSocket.Server({ port: PORT })

console.log(`WebSocket server running on port ${PORT}`)

server.on('connection', socket => {
  // console.log(JSON.stringify(server.clients))

  // console.log(socket)

  socket.on('message', message => {
    // try {
      let messageJSON = JSON.parse(message.toString())
      if('device_name' in messageJSON){
        deviceCheck(messageJSON.device_type, messageJSON.device_name, messageJSON.description)
      }
    // } catch (error) {
    //   console.log('non json')
    // }

    server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          from: socket.id,
          data: message.toString(),
        }))
        // console.log('client list:' + JSON.stringify(server.clients))
      }
    })

    const clients = [...server.clients].map(client => client)
    // console.log('Connected clients:', clients)
    console.log('\n\n\n')
  })

  socket.on('close', () => {
    console.log('Client disconnected')
  })

  socket.on('error', err => {
    console.error('WebSocket error:', err)
  })
})

let deviceCheck = (deviceName, deviceType, description) => {
  const query = 'SELECT id FROM clients WHERE device_name = ?'
    
  clientDB.query(query, [deviceName], (err, result) => {
      if (err) {
          console.error('error adding device: ' + err.stack)
      }
      console.log(result)
      if(result.length == 0){
        addDevice(deviceName, deviceType, description)
      }
  })
}

let addDevice = (deviceName, deviceType, description) => {
  const query = 'INSERT INTO clients (device_name, device_type, description) VALUES (?, ?, ?)'
    
  clientDB.query(query, [deviceName, deviceType, description], (err, result) => {
      if (err) {
          console.error('error adding device: ' + err.stack)
      }
      console.log('device added')
  })
}