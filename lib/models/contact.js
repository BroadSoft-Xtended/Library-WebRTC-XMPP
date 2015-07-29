module.exports = require('webrtc-core').bdsft.Model(Contact);

function Contact(rosterItem) {
	var self = {};

	self.props = ['id', 'name', 'messages', 'presence'];

	self.init = function(){
		self.id = rosterItem.jid.bare;
		self.name = rosterItem.name;
		self.messages = [];
	};

	self.addMessage = function(message){
		self.messages = self.messages.concat([message]);
	};

	return self;
}
