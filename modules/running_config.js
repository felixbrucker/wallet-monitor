const jayson = require('jayson/promise');
const config = require('../config');
const stats = require('./stats');

const runningConfig = {
    wallets: [],
    init: () => {
        config.wallets.forEach((wallet) => {
            if (wallet.enabled) {
                const tmp = Object.assign({}, wallet);
                tmp.rpcClient = jayson.client.http(`http://${wallet.user}:${wallet.pass}@` +
                    `${wallet.hostname}:${wallet.port}`);
                runningConfig.wallets.push(tmp);
            }
        });
    },
    addHashrate: (algo, hashrate) => {
        runningConfig.wallets.forEach((wallet) => {
            if (wallet.algo === algo) {
                wallet.ownHashrate += hashrate;
            }
        });
    },
    delHashrate: (algo, hashrate) => {
        runningConfig.wallets.forEach((wallet) => {
            if (wallet.algo === algo) {
                wallet.ownHashrate -= hashrate;
            }
        });
    },
    setBestWallet: (force) => {
        force = force || false;

        return runningConfig.updateTTF()
            .then(() => {
                const tempBestWallet = runningConfig.getBestWallet();
                if (stats.bestWallet !== tempBestWallet) {
                    if (tempBestWallet === null) {
                        console.log('No Wallet with low enough TTF');
                    } else {
                        console.log(`New best Wallet: ${tempBestWallet.name}`);
                    }
                    // switch!
                    stats.setBestWallet(tempBestWallet);
                    force = true;
                } else if (force) {
                    stats.setBestWallet(runningConfig.getBestWallet());
                }

                return force;
            });
    },
    updateTTF: () => {
        const promises = [];
        runningConfig.wallets.forEach((wallet) => {
            promises.push(wallet.rpcClient.request('getmininginfo', [])
                .then((response) => {
                    // console.log(JSON.stringify(response, null, 2));
                    if (!(response.error || response.result === null)) {
                        if (response.result.netmhashps) {
                            response.result.networkhashps = response.result.netmhashps * 1000 * 1000;
                        }
                        if (wallet.ownHashrate !== 0) {
                            wallet.ttf = (response.result.networkhashps / wallet.ownHashrate) * wallet.blocktime;
                        } else {
                            wallet.ttf = 999999999999;
                        }
                    } else {
                        wallet.ttf = 999999999999;
                    }
                    console.log(`TTF ${wallet.name}: ${(wallet.ttf / 60 / 60).toFixed(1)} h`);
                })
                .catch((err) => {
                    console.error(err);
                })
            );
        });

        return Promise.all(promises);
    },
    getBestWallet: () => {
        let tempBestWallet = null;
        let bestRatio = 9999999999;
        runningConfig.wallets.forEach((wallet) => {
            if (wallet.ttf / 60 < wallet.ttfLimit && wallet.ttf / 60 / wallet.ttfLimit < bestRatio) {
                tempBestWallet = wallet;                                // TODO: check if ref
                bestRatio = wallet.ttf / 60 / wallet.ttfLimit;
            }
        });

        return tempBestWallet;
    },
};

module.exports = runningConfig;
