module.exports = require('webrtc-core').bdsft.Model(Contact);

var Message = require('./message');

function Contact(item, eventbus, client) {
	var self = {};

	self.props = ['id', 'name', 'messages', 'presence', 'subscription', 'classes', 'selected'];

	self.bindings = {
		classes: {
			contact: ['presence', 'selected', 'subscription']
		}
	};

	self.init = function() {
		self.id = item.jid && item.jid.bare || item.bare;
		self.name = item.name || (item.jid && item.jid.local) || item.local;
		self.presence = 'unavailable';
		self.subscription = item.subscription;
		self.messages = [];
	};

	self.listeners = function() {
		client.on('available', function(msg) {
			if (msg.from.bare === self.id) {
				self.available();
			}
		});

		client.on('unavailable', function(msg) {
			if (msg.from.bare === self.id) {
				self.unavailable();
			}
		});

		client.on('chat', function(msg) {
			var message = Message.create([msg, 'incoming']);
			if (message.from === self.id) {
				self.addMessage(message);
				self.select();
			}
		});

		client.on('message:sent', function(msg) {
			if (!msg.body) {
				return;
			}

			msg.from = client.jid.bare;
			var message = Message.create([msg, 'outgoing']);
			if(message.to === self.id) {
				self.addMessage(message);
			}
		});

		client.on('presence', function(msg) {
			if(msg.from.bare === self.id) {
				self.presence = msg.show || msg.type || 'available';
			}
		});

		eventbus.on('selectContact', function(contact) {
			self.selected = contact.id === self.id;
		})
	};

	self.addMessage = function(message) {
		self.messages = self.messages.concat([message]);
	};

	self.select = function() {
		self.selected = true;
		eventbus.emit('selectContact', self);
	};

	self.deselect = function() {
		self.selected = false;
		eventbus.emit('deselectContact', self);
	};

	self.available = function() {
		self.presence = 'available';
	};

	self.unavailable = function() {
		self.presence = 'unavailable';
	};

	self.remove = function() {
		client.removeRosterItem(self.id, function(e) {
			if (e && e.error) {
				eventbus.emit('removeContactFailed', self);
			}
		});
		client.unsubscribe(self.id, function(e) {
		});
		eventbus.emit('removeContact', self);
	};


	self.close = function() {
		eventbus.emit('closeContact', self);
		self.selected = false;
	};



	return self;
}