module.exports = require('bdsft-sdk-model')(Message);

function Message(msg, direction) {
	var self = {};

	self.props = ['to', 'from', 'body', 'chatState', 'time', 'direction', 'classes'];

	self.bindings = {
		classes: {
			self: 'direction'
		}
	};
	
	self.init = function(){
		self.id = msg.id;
		self.to = msg.to.bare;
		self.from = msg.from.bare;
		self.body = msg.body;
		self.chatState = msg.chatState;
		self.direction = direction;
		self.time = new Date();
	};

	return self;
}
