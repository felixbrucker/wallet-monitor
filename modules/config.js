const fs = require('fs');
const toPromise = require('../util/to_promise');

const configPath = 'conf.json';

const config = {
    wallets: null,
    saveConfig: () => {
        fs.writeFile(configPath, JSON.stringify(config.wallets, null, 2), (err) => {
            if (err) {
                throw (err);
            }
        });
    },
    init: () =>
        toPromise(fs.stat, configPath)
            .then(() => toPromise(fs.readFile, configPath))
            .then((data) => {
                config.wallets = JSON.parse(data);
            })
            .catch((err) => {
                if (err.code === 'ENOENT') {
                    // default conf
                    config.wallets = [];
                    config.saveConfig();
                } else {
                    console.log('no valid JSON');
                }
            }),
};

module.exports = config;
