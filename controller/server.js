const express = require('express');
const stats = require('../modules/stats');
const runningConfig = require('../modules/running_config');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


app.use(express.static(`${__dirname}/../public`));

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/../public/index.html`);
});

io.sockets.on('connection', (socket) => {
    let hashrateArray = null;

    socket.on('subscribe', (data) => {
        // add hashrates to ownhashrates
        hashrateArray = data;
        hashrateArray.forEach((entry) => {
            runningConfig.addHashrate(entry.algo, entry.hashrate);
        });
        runningConfig.setBestWallet(true)
            .then((broadcast) => {
                if (broadcast) {
                    sendBestWalletToAll();
                }
            });
    });

    socket.on('disconnect', () => {
        // remove hashrates from ownhashrates
        hashrateArray.forEach((entry) => {
            runningConfig.delHashrate(entry.algo, entry.hashrate);
        });
        runningConfig.setBestWallet(true)
            .then((broadcast) => {
                if (broadcast) {
                    sendBestWalletToAll();
                }
            });
    });
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
