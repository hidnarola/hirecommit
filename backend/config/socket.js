const socketIO = (server) => {
    var io = require('socket.io')(server);
    io.on('connection', function (socket) {
        console.log('socket connected ==> ');

        socket.on('join', function (id) {
            console.log('Socket : Join ==> ', id);
            socket.join(id);
        });

        socket.on('leave', function (id) {
            console.log('Socket : Leave ==> ', id);
            socket.leave(id);
        });

        socket.on('changeOffer', function (id) {
            console.log('changeOffer : server ==> ', id);
            socket.to(id).emit('Offer', { id });
        });

        socket.on('disconnect', function () {
            io.emit('user disconnected');
        });
    });

}

module.exports = socketIO;
