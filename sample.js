//mock the GPIO inside a folder 'mocks' of the current folder
//var w1 = require('./index')({path: __dirname + '/mocks'});
var w1 = require('./index')({mockPath: '/Users/alex/work/dev/private/gpio-mocker/mocks'});

w1.list(function (err, devices) {
    console.log('Found devices: ', devices);
    for (var i = 0; i < devices.length; i++) {
        //try to read temperature of a DS18B20 sensor
        console.log('Will read device: ', devices[i].device);
        w1.read(devices[i].device, 'DS18B20', function (err, value) {
            if (err != null) {
                console.log('Error', err);
            } else {
                console.log('Successfully read value ', value);
            }
        });
    }
});