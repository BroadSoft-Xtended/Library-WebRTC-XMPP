module.exports = require('bdsft-sdk-model')(Chats);

var Chat = require('./chat');

function Chats(eventbus, client) {
	var self = {};

	self.props = ['classes', 'items', 'contactSelected'];

	self.bindings = {
		classes: {
			self: 'contactSelected'
		}
	};

	self.init = function() {
		self.items = {};
	};

	self.listeners = function() {
		eventbus.on('selectContact', function(contact) {
			self.contactSelected = !!contact;
			if(contact) {
				self.items[contact.id] = Chat.create([contact, client]);
			}
		});
		eventbus.on('closeContact', function(contact) {
			delete self.items[contact.id];
			if(contact.selected) {
				self.contactSelected = false;
			}
		});
	}

	return self;
}