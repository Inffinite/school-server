const express = require('express')
const chalk = require('chalk')
const cors = require('cors')
const socket = require('socket.io')
const app = express()
const port = 3000

// require('./db/mongoose')
require('./db/mysql')

const UserRouter = require('./routers/User')
const MessagesRouter = require('./routers/Messages')
const EventsRouter = require('./routers/Events')


app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
})

app.use(UserRouter)
app.use(MessagesRouter)
app.use(EventsRouter)

const server = app.listen(port, () => {
    console.log(chalk.yellow('[+] The server is up on port ' + port))
})

let io = socket(server)

io.set('origins', '*:*')
io.on("connection", (socket) => {
    const data = '[+++] Hello from the server siiiiiiiide...'
    io.emit('Fuckery', data)

})


