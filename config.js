module.exports = {
    wallets: [
        {
            enabled: true,          // use this wallet
            name: 'Hexx',           // name of the coin/wallet
            algo: 'zoin',           // cryptonight has no getwork support
            hostname: 'localhost',  // hostname of computer where the wallet is running
            port: 29200,            // JSON-RPC port
            user: 'myuser',         // JSON-RPC username
            pass: 'mypass',         // JSON-RPC password
            blocktime: 150,         // blocktime in seconds
            ttfLimit: 600,          // start mining when TTF is below this limit (minutes)
            ownHashrate: 0,         // starting point of the personal hashrate in h/s, you will want to use 0 here
        },
        {
            enabled: false,         // use this wallet
            name: 'Lisa',           // name of the coin/wallet
            algo: 'x11',            // cryptonight has no getwork support
            hostname: 'localhost',  // hostname of computer where the wallet is running
            port: 43784,            // JSON-RPC port
            user: 'myuser',         // JSON-RPC username
            pass: 'mypass',         // JSON-RPC password
            blocktime: 600,         // blocktime in seconds
            ttfLimit: 600,          // start mining when TTF is below this limit (minutes)
            ownHashrate: 0,         // starting point of the personal hashrate in h/s, you will want to use 0 here
        },
    ],
};
