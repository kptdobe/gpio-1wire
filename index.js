module.exports = function (options) {
    var w1 = require('./lib/gpio-1wire')(options);
    require('./lib/DS18B20-sensor')(w1);

    return w1;
};