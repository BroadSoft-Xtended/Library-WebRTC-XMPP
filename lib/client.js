var self = {};
module.exports = self;

var opts = {
	useStreamManagement: false,
	transports: ['bosh'],
	wait: 30
};

var client = require('stanza.io').createClient(opts);

Object.defineProperties(self, {
	jid: {
		get: function(){
			return client.jid;
		}
	}
});

self.busy = function() {
	client.sendPresence({
		show: 'dnd'
	});
};

self.active = function() {
	client.sendPresence();
};

self.connect = function(credentials) {
	client.connect(credentials);
};

self.disconnect = function() {
	client.disconnect();
};

self.releaseGroup = function(name) {
	client.releaseGroup(name);
};

self.sendPresence = function(item) {
	client.sendPresence(item);
};

self.on = function(name, group, callback) {
	if(arguments.length === 3) {
		client.on(name, group, callback);
	} else {
		client.on(name, group);
	}
};

self.once = function(name, group, callback) {
	if(arguments.length === 3) {
		client.once(name, group, callback);
	} else {
		client.once(name, group);
	}
};

self.boshURL = function(url) {
    client.config.boshURL = url;
};

self.getRoster = function(callback) {
    client.getRoster(callback);
};

self.updateRosterItem = function(item, callback) {
    client.updateRosterItem(item, callback);
};

self.subscribe = function(jid, callback) {
    client.subscribe(jid, callback);
};

self.unsubscribe = function(jid, callback) {
    client.unsubscribe(jid, callback);
};

self.sendMessage = function(msg) {
    client.sendMessage(msg);
};

self.removeRosterItem = function(jid, callback) {
    client.removeRosterItem(jid, callback);
};

self.acceptSubscription = function(jid) {
    client.acceptSubscription(jid);
};

self.denySubscription = function(jid) {
    client.denySubscription(jid);
};

