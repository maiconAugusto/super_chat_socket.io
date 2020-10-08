const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server);
let messages = [];
let users = [];

app.set('views','./src/view')
app.set("view engine", "ejs");

app.get('/',(req, res) => {
    return res.render('home')
})

app.get('/class-room/:id', (req, res) => {
    return res.render('chat')
})

app.post('/create-room/:id', (req ,res) => {
    return res.status(200).json({data: req.params.id})
})

io.on('connection',(socket) => {
    socket.emit('previusMessage', messages)
    socket.emit('userLogged', users)
        socket.on('messages', (data) => {
            messages.push(data);
                socket.broadcast.emit('responseMessage', messages);
        })
        socket.on('newUsers', (data) => {
            users.push(data);
                socket.broadcast.emit('users', users);
        })
        socket.on('exit', (data) => {
            if (data !== null) {
                const usersFiltered = []
                users.map(element => {
                    if (element.id !== data.id) {
                        usersFiltered.push(element)
                    }
                })
                usersFiltered.length === 0 ? null : socket.broadcast.emit('users', usersFiltered);
                usersFiltered.length === 0 ? null : users = usersFiltered
            }
        })
})

server.listen(8000);