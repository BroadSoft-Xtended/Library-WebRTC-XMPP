module.exports = require('webrtc-core').bdsft.Model(ChatTab);

function ChatTab(eventbus, client) {
	var self = {};

	var adjacentContact = function(contact) {
		var ids = Object.keys(self.contacts);
		var result = undefined;
		ids.forEach(function(id, index) {
			if (contact.id === id) {
				if (index > 0) {
					result = self.contacts[ids[index - 1]];
				} else if (index < ids.length) {
					result = self.contacts[ids[index + 1]];
				}
			}
		});
		return result;
	}

	self.props = ['contacts'];

	self.init = function() {
		self.contacts = {};
	}

	self.listeners = function() {
		eventbus.on('selectContact', function(contact) {
			if(contact) {
				self.contacts[contact.id] = contact;
			}
		});
		eventbus.on('closeContact', function(contact) {
			if (self.contacts[contact.id]) {
				// select adjacent tab if closed tab === current tab
				if (contact.selected) {
					var nextContact = adjacentContact(contact);
					if (nextContact) {
						nextContact.select();
					}
				}
				delete self.contacts[contact.id];
			}
		});
	};

	return self;
}