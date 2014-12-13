module.exports = function (gpio1wire) {
    gpio1wire.registerSensor('DS18B20', function (value) {
        var data = value.toString('ascii').split(" "); // Split by space

        // Extract temperature from string and divide by 1000 to give celsius
        var temp = parseFloat(data[data.length - 1].split("=")[1]) / 1000.0;

        // Round to one decimal place
        return Math.round(temp * 10) / 10;
    });
};