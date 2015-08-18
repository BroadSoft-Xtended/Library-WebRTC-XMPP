module.exports = require('webrtc-core').bdsft.Model(MyContact);

var Contact = require('./contact');

function MyContact(eventbus, client) {
	var self = {};

	self.props = ['id', 'name', 'presence', 'presenceSelect', 'classes'];

	self.bindings = {
		classes: {
			self: 'presence'
		},
		presenceSelect: {
			self: 'presence'
		}
	};

	self.listeners = function() {
		client.onSessionStarted(function() {
			self.name = client.jid.local;
			self.id = client.jid.bare;
			self.sendPresence();
		});
		client.onAvailable(function(msg) {
			if (msg.from.bare === self.id) {
				self.presence = 'available';
			}
		});
		client.onUnavailable(function(msg) {
			if (msg.from.bare === self.id) {
				self.presence = 'unavailable';
			}
		});
		client.onPresence(function(msg) {
			if(msg.from.bare === self.id) {
				self.presence = msg.show || msg.type || 'available';
			}
		});
	}

	self.sendPresence = function(presence) {
		if (!presence || presence === 'available') {
			client.sendPresence();
		} else {
			client.sendPresence({
				show: presence
			});
		}
	};

	return self;
}