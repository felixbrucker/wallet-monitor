module.exports = {
    wallets: [
        {
            name: 'Hexx',           // name of the coin/wallet
            algo: 'zoin',           // cryptonight has no getwork support
            hostname: 'localhost',  // hostname of computer where the wallet is running
            port: 29200,            // JSON-RPC port
            user: 'myuser',         // JSON-RPC username
            pass: 'mypass',         // JSON-RPC password
            limit: 20000,           // nethashrate limit in h/s, mining is disabled if nethashrate is above this limit
        },
    ],
};
