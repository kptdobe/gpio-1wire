gpio-mocker
===========

NodeJS module which provides 1-wire basic i/o operations: list devices, read sensor value...
Module is compatible with [the GPIO mocker](https://github.com/kptdobe/gpio-mocker.js).

Sample:
```js

//version to run on a Raspberry Pi to access "read" physical bus
var w1 = require('./index');

//use mockPath to mock the 1-wire bus inside a folder 'mocks' of the current folder
//var w1 = require('./index')({mockPath: __dirname + '/mocks'});

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

```
