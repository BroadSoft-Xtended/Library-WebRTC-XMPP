module.exports = require('bdsft-sdk-model')(Contacts);

var Contact = require('./contact');

function Contacts(eventbus, client) {
	var self = {};

	self.props = ['classes', 'items'];

	self.init = function(){
		self.items = {};
	};

	self.listeners = function() {
	    client.on('roster:update', function(msg){
	    	var items = msg.roster && msg.roster.items || [];
	    	items.forEach(function(item){
	    		var contact = self.items[item.jid.bare];
	    		if(!contact) {
	    			contact = Contact.create([item, eventbus, client]);
	    			self.items[contact.id] = contact;
	    		} else {
		    		contact.name = item.name;
		    		contact.subscription = item.subscription;
	    		}
	    	});
	    });

		client.on('session:started', function() {
			client.getRoster(function(err, res) {
				if(res.roster && res.roster.items) {
					self.items = res.roster.items.map(function(item) {
						return Contact.create([item, eventbus, client]);
					}).reduce(function(obj, contact) {
						obj[contact.id] = contact;
						return obj;
					}, {});
				}
			});

			client.sendPresence();
		});
	}

	self.contains = function(id){
		return !!self.items[id];
	};

	self.containsActive = function(id){
		return self.items[id] && self.items[id].subscription !== 'remove';
	};

	self.onRemoveContactFailed = function(callback) {
		eventbus.on('removeContactFailed', callback);
	};

	return self;
}