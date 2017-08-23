var cordova = require('cordova');

module.exports = {

  register: function (onNotification, success, fail, config) {
    var client = AeroGear.UnifiedPushClient(config.simplePush.variantID, config.simplePush.variantSecret, config.pushServerURL + '/rest/registry/device'),
      regs = navigator.push.registrations();

    regs.onsuccess = function (e) {
      //For now let' clean up each time both SPS and UPS
      if (regs.result.length > 0) {
        for (var i = 0, l = regs.result.length; i < l; i++) {
          var pushEndpoint = regs.result[i].pushEndpoint;
          navigator.push.unregister(pushEndpoint);
          client.unregisterWithPushServer(pushEndpoint);
        }
      }
    };
    var req = navigator.push.register();
    req.onsuccess = function () {
      config.deviceToken = req.result;
      var settings = {
        success: success,
        error: fail
      };

      settings.metadata = config;
      client.registerWithPushServer(settings);
    };

    navigator.mozSetMessageHandler('push', function (message) {
      onNotification(message);
    });
  }
};
require('cordova/exec/proxy').add('push', module.exports);