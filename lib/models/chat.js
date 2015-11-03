module.exports = require('bdsft-sdk-model')(Chat);

function Chat(contact, client) {
	var self = {};

	self.props = ['name', 'messages', 'input', 'selected', 'classes'];

	self.bindings = {
		classes: {
			self: 'selected'
		},
		name: {
			contact: 'name'
		},
		messages: {
			contact: 'messages'
		},
		selected: {
			contact: 'selected'
		}
	}

	self.sendMessage = function(msg) {
		var msg = {
			type: 'chat',
			to: contact.id,
			body: msg,
			chatState: 'active'
		};
		// debug.log('sendMessage : ' + JSON.stringify(msg));
		client.sendMessage(msg);
	};

	return self;
}