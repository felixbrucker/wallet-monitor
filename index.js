const runningConfig = require('./modules/running_config');
const server = require('./controller/server');

runningConfig.init();
runningConfig.setBestWallet()
.then((broadcast) => {
    if (broadcast) {
        server.sendBestWalletToAll();
    }
});
setInterval(() => {
    runningConfig.setBestWallet()
        .then((broadcast) => {
            if (broadcast) {
                server.sendBestWalletToAll();
            }
        });
}, 3 * 60 * 1000); // check every 3 minutes
