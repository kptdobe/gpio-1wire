var fs = require('fs');

var PATH_W1_DEVICES = '/sys/bus/w1/devices';
var MASTER_BUS_DEVICE = 'w1_bus_master1';

var MOCK_PATH;
var MOCK_CREATE_MISSING_FOLDER = false;

function GPIO1Wire() {
    var sensors = {};

    /**
     * Async read of the value of a device.
     * @param {String} device Name of the device to read
     * @param {String|Function} sensor Name of a registered sensor or function that enhances the sensor value
     * @param {Function} cb Callback
     */
    this.read = function (device, sensor, cb) {
        if (typeof sensor == 'string' && !sensors[sensor]) throw new Error('Unknown sensor ' + sensor);

        var sensorFct = sensor ? (typeof sensor == 'function' ? sensor : sensors[sensor]) :
            function (value) {
                return value.toString('ascii');
            };

        fs.readFile(getPath(PATH_W1_DEVICES + '/' + device + '/w1_slave'), function (err, value) {
            if (err) {
                return process.nextTick(function () {
                    cb(new Error(err));
                });
            }

            return cb(err, {
                'device': device,
                'path': PATH_W1_DEVICES + '/' + device,
                'value': sensorFct(value),
                'time': new Date().toJSON()
            });
        });
    };

    /**
     * Register a new sensor: mainly a function that will transform an input value (example: a temperature) into the
     * value writen on the bus (something close to the Raspberry Pi output)
     * @param {String} name Name of the sensor
     * @param {Function} fct Sensor implementation
     */
    this.registerSensor = function (name, fct) {
        sensors[name] = fct;
    };

    /**
     * Async listing of all the available 1-wire devices
     * @param cb Callback
     */
    this.list = function (cb) {
        fs.readdir(getPath(PATH_W1_DEVICES), function (err, files) {
            if (err) {
                return process.nextTick(function () {
                    cb(new Error(err));
                });
            }

            var devices = [];
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                if (f != MASTER_BUS_DEVICE) {
                    devices.push({
                        'device': f,
                        'path': PATH_W1_DEVICES + '/' + f,
                        'time': new Date().toJSON()
                    });
                }
            }

            return cb(err, devices);
        });
    };
}

function getPath(suffix) {
    if (MOCK_PATH) {
        var path = MOCK_PATH + suffix;
        if (MOCK_CREATE_MISSING_FOLDER) {
            var folderPath = "";
            var folders = path.substring(0, path.lastIndexOf("/")).split("/");
            for (var i = 1; i < folders.length; i++) {
                folderPath += "/" + folders[i];
                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath);
                }
            }
        }
        return path;
    }

    return suffix;
}

module.exports = function (config) {
    if (config) {
        PATH_W1_DEVICES = config.pathW1Devices || PATH_W1_DEVICES;

        MOCK_PATH = config.mockPath;
        MOCK_CREATE_MISSING_FOLDER = config.mockCreateMissingFolders;
    }

    return new GPIO1Wire;
};