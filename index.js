const jayson = require('jayson/promise');
const config = require('./config');
const stats = require('./modules/stats');
const server = require('./controller/server');

const wallets = [];

function init() {
    config.wallets.forEach((wallet) => {
        const tmp = Object.assign({}, wallet);
        tmp.rpcClient = jayson.client.http(`http://${wallet.user}:${wallet.pass}@${wallet.hostname}:${wallet.port}`);
        wallets.push(tmp);
    });
    setBestWallet();
    setInterval(setBestWallet, 3 * 60 * 1000); // check every 3 minutes
}

function setBestWallet() {
    updateTTF()
        .then(() => {
            const tempBestWallet = getBestWallet();
            if (tempBestWallet !== null) {
                if (stats.bestWallet !== tempBestWallet) {
                    // switch!
                    stats.setBestWallet(tempBestWallet);
                    console.log(`New best Wallet: ${stats.bestWallet.name}`);
                    server.sendBestWalletToAll();
                }
            } else {
                console.log('No Wallet with low enough TTF');
            }
        });
}

function updateTTF() {
    const promises = [];
    wallets.forEach((wallet) => {
        promises.push(wallet.rpcClient.request('getmininginfo', [])
            .then((response) => {
                if (!(response.error && !response.result === null)) {
                    wallet.ttf = (response.result.networkhashps / wallet.ownHashrate) * wallet.blocktime;
                } else {
                    wallet.ttf = 999999999999;
                }
            })
            .catch((err) => {
                console.error(err);
            })
        );
    });

    return Promise.all(promises);
}

function getBestWallet() {
    let tempBestWallet = null;
    let bestRatio = 9999999999;
    wallets.forEach((wallet) => {
        if (wallet.ttf / 60 < wallet.ttfLimit && wallet.ttf / 60 / wallet.ttfLimit < bestRatio) {
            tempBestWallet = wallet;                                // TODO: check if ref
            bestRatio = wallet.ttf / 60 / wallet.ttfLimit;
        }
    });

    return tempBestWallet;
}

init();
