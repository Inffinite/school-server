const socket = require('socket.io')
const server = require('../index')

let io = socket(server)

// io.set('origins', '*:*')

io.on("connection", (data) => {
    const mydata = '[+++] Hello from the server siiiiiiiide...'
    io.emit('Fuckery', mydata)
})