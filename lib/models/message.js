module.exports = require('webrtc-core').bdsft.Model(Message);

function Message(msg) {
	var self = {};

	self.props = ['to', 'from', 'body', 'chatState'];

	self.init = function(){
		self.id = msg.id;
		self.to = msg.to.bare;
		self.from = msg.from.bare;
		self.body = msg.body;
		self.chatState = msg.chatState;
	};

	return self;
}
