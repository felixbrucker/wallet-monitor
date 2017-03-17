const express = require('express');
const stats = require('../modules/stats');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


app.use(express.static(`${__dirname}/../public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/../public/index.html`);
});

io.sockets.on('connection', (socket) => {
    let wallet = null;
    if (stats.bestWallet !== null) {
        wallet = {
            name: stats.bestWallet.name,
            user: stats.bestWallet.user,
            pass: stats.bestWallet.pass,
            url: `http://${stats.bestWallet.hostname}:${stats.bestWallet.port}`,
            algo: stats.bestWallet.algo,
        };
    }
    socket.emit('bestWallet', wallet);
});

function sendBestWalletToAll() {
    let wallet = null;
    if (stats.bestWallet !== null) {
        wallet = {
            name: stats.bestWallet.name,
            user: stats.bestWallet.user,
            pass: stats.bestWallet.pass,
            url: `http://${stats.bestWallet.hostname}:${stats.bestWallet.port}`,
            algo: stats.bestWallet.algo,
        };
    }
    io.sockets.emit('bestWallet', wallet);
}

const listener = server.listen(process.env.PORT || 9000, () => {
    console.log(`server running on port ${listener.address().port}`);
});


module.exports = {
    sendBestWalletToAll,
};
