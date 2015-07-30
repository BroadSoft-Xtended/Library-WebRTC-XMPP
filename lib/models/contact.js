module.exports = require('webrtc-core').bdsft.Model(Contact);

function Contact(item) {
	var self = {};

	self.props = ['id', 'name', 'messages', 'presence'];

	self.init = function(){
		self.id = item.jid && item.jid.bare || item.bare;
		self.name = item.name || item.local;
		self.presence = 'available';
		self.messages = [];
	};

	self.addMessage = function(message){
		self.messages = self.messages.concat([message]);
	};

	return self;
}
