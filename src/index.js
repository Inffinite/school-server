const express = require('express')
const chalk = require('chalk')
const cors = require('cors')
const socket = require('socket.io')
const app = express()
const port = 3000
    // const https = require('https')

// require('./db/mongoose')
require('./db/mysql')
require('./socket/MessageSocket')

const UserRouter = require('./routers/User')
const MessagesRouter = require('./routers/Messages')
const EventsRouter = require('./routers/Events')
const WhatsappRouter = require('./routers/Whatsapp')
const FaqRouter = require('./routers/Faq')

app.use(UserRouter)
app.use(MessagesRouter)
app.use(EventsRouter)
app.use(WhatsappRouter)
app.use(FaqRouter)

const server = app.listen(port, () => {
    console.log(chalk.yellow('[+] The server is up on port ' + port))
})

// const server = https.createServer({
//     key: fs.readFileSync('./key.pem'),
//     cert: fs.readFileSync('./cert.pem'),
//     passphrase: 'PMuchiri@123'
// }, app).listen(3000)

// io.on("connection", (socket) => {
//     const data = '[+++] Hello from the server siiiiiiiide...'
//     io.emit('Fuckery', data)

// })

module.exports = {
    server
}