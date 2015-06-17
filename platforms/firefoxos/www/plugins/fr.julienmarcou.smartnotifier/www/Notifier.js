cordova.define("fr.julienmarcou.smartnotifier.Notifier", function(require, exports, module) { "use strict";

function Notifier() {

	var self = this;
	var exec = require('cordova/exec');
	var defaultTitle = 'Untitled';
	var defaultMessage = 'No description';
	var icons = {
		'default' : 'icon_smartnotifier_default',
		'error'   : 'icon_smartnotifier_error',
		'success' : 'icon_smartnotifier_success',
		'calendar' : 'icon_smartnotifier_calendar',
		'killall' : 'icon_smartnotifier_killall'
	};

	self.notifySuccess = function(info) {};

	self.notifyError = function(error) {};

	self.notify = function(title, message, icon) {
		if(typeof title === 'undefined') {
			title = defaultTitle;
		}
		if(typeof message === 'undefined') {
			message = defaultMessage;
		}
		if(typeof icon === 'undefined' || typeof icons[icon] === 'undefined') {
			icon = icons.default;
		}
		else {
			icon = icons[icon];
		}
		exec(self.notifySuccess, self.notifyError, "Notifier", "notify", [title, message, icon]);
	};

}

module.exports = new Notifier();

});
