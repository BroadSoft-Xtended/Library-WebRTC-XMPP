module.exports = require('webrtc-core').bdsft.Model(Contact);

function Contact(item, xmpp) {
	var self = {};

	self.props = ['id', 'name', 'messages', 'presence', 'subscription', 'classes', 'selected'];

	self.bindings = {
		classes: {
			contact: ['presence', 'selected', 'subscription']
		}
	};

	self.init = function(){
		self.id = item.jid && item.jid.bare || item.bare;
		self.name = item.name || (item.jid && item.jid.local) || item.local;
		self.presence = 'available';
		self.subscription = item.subscription;
		self.messages = [];
	};

	self.listeners = function(xmppDatabinder){
	    xmppDatabinder.onModelPropChange('contact', function(value) {
	    	self.selected = (self === value);
	    });
	    xmpp.client.on('roster:update', function(msg){
	    	var items = msg.rooster && msg.rooster.items || [];
	    	var item = items.filter(function(item){
	    		return item.jid === self.id;
	    	}).pop();
	    	if(item) {
	    		self.name = item.name;
	    		self.subscription = item.subscription;
	    	}
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
