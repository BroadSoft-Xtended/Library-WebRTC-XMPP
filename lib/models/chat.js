module.exports = require('webrtc-core').bdsft.Model(Chat);

function Chat(contact, xmpp) {
	var self = {};

	self.props = ['name', 'messages', 'input', 'selected', 'classes'];

	self.bindings = {
		classes: {
			self: 'selected'
		}
	}
	self.init = function() {
		self.name = contact.name;
	};

	self.listeners = function(xmppDatabinder) {
		contact.databinder.onModelPropChange('selected', function(value) {
			self.selected = value;
		});
		contact.databinder.onModelPropChange('messages', function(messages) {
			self.messages = [].concat(messages);
		});
	};

	self.sendMessage = function() {
		var msg = {
			type: 'chat',
			to: contact.id,
			body: self.input,
			chatState: 'active'
		};
		// debug.log('sendMessage : ' + JSON.stringify(msg));
		xmpp.client.sendMessage(msg);
	};

	return self;
}