cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-device/www/device.js",
        "id": "cordova-plugin-device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/cordova-plugin-device/src/firefoxos/DeviceProxy.js",
        "id": "cordova-plugin-device.DeviceProxy",
        "runs": true
    },
    {
        "file": "plugins/fr.julienmarcou.smartnotifier/www/Notifier.js",
        "id": "fr.julienmarcou.smartnotifier.Notifier",
        "clobbers": [
            "Notifier"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.0.0",
    "cordova-plugin-device": "1.0.0",
    "fr.julienmarcou.smartnotifier": "0.1.0",
    "cordova-plugin-console": "1.0.0"
}
// BOTTOM OF METADATA
});