const jayson = require('jayson/promise');
const config = require('./config');
const normalizeHashrate = require('./util/normalize_hashrate');

let clients = [];
config.wallets.forEach((wallet) => {
	clients.push({
		name: wallet.name,
		rpcClient: jayson.client.http(`http://${wallet.user}:${wallet.pass}@${wallet.hostname}:${wallet.port}`),
		limit: wallet.limit
	});
});

console.log('== Nethashrates ==');

clients.forEach((client) => {
	client.rpcClient.request('getmininginfo',[])
	.then(response => {
		console.log(`${client.name}: ${normalizeHashrate(response.result.networkhashps)} (diff: ${response.result.difficulty})`);
	})
	.catch(err => {
		console.log(`Error: ${err.message}`);
		console.error(err);
	});
});