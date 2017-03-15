module.exports = ((hashps) => {
    if (isNaN(parseFloat(hashps)) || !isFinite(hashps)) return '';
    if (parseFloat(hashps, 10) === 0) return '0 H/s';
    const units = ['H/s', 'KH/s', 'MH/s', 'GH/s', 'TH/s', 'PH/s', 'EH/s'];
    const number = Math.floor(Math.log(hashps) / Math.log(1000));
    if (number < 0) {
        return `${hashps.toFixed(2)} H/s`;
    }

    return `${(hashps / (1000 ** Math.floor(number))).toFixed(2)} ${units[number]}`;
});
