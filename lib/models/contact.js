module.exports = require('webrtc-core').bdsft.Model(Contact);

function Contact(item, xmpp) {
	var self = {};

	self.props = ['id', 'name', 'messages', 'presence', 'classes', 'selected'];

	self.bindings = {
		classes: {
			contact: ['presence', 'selected']
		}
	};

	self.init = function(){
		self.id = item.jid && item.jid.bare || item.bare;
		self.name = item.name || (item.jid && item.jid.local) || item.local;
		self.presence = 'available';
		self.messages = [];
	};

	self.listeners = function(xmppDatabinder){
	    xmppDatabinder.onModelPropChange('contact', function(value) {
	    	self.selected = (self === value);
	    });
	};

	self.addMessage = function(message){
		self.messages = self.messages.concat([message]);
	};

	self.available = function(){
		self.presence = 'available';
	};

	self.unavailable = function(){
		self.presence = 'unavailable';
	};

	return self;
}
