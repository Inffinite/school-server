const express = require('express')
const chalk = require('chalk')
const cors = require('cors')
const socket = require('socket.io')
const app = express()
const port = 3000

require('./db/mysql')

const UserRouter = require('./routers/User')
const MessagesRouter = require('./routers/Messages')
const EventsRouter = require('./routers/Events')
const WhatsappRouter = require('./routers/Whatsapp')
const FaqRouter = require('./routers/Faq')
const StalkerRouter = require('./routers/Stalkers')

app.use(UserRouter)
app.use(MessagesRouter)
app.use(EventsRouter)
app.use(WhatsappRouter)
app.use(FaqRouter)
app.use(StalkerRouter)

// enables accessing profile pictures
app.use('/profiles', express.static(__dirname + '/dp'))

const server = app.listen(port, () => {
    console.log(chalk.yellow('[+] The server is up on port ' + port))
})

// const server = https.createServer({
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
//     passphrase: 'PMuchiri@123'
// }, app).listen(3000)

let io = socket(server)

io.set('origins', '*:*')

io.on("connection", (socket) => {
    const mydata = '[+++] Hello from the server siiiiiiiide...'
    io.emit('Fuckery', mydata)

    socket.on('message', (data) => {
        console.log(data)
        socket.emit('resp', data)
    })
})

module.exports = {
    server
}