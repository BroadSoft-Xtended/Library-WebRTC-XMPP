module.exports = require('webrtc-core').bdsft.Model(Subscription);

function Subscription(item, eventbus, client) {
	var self = {};

	self.props = ['id', 'name', 'accepted', 'denied', 'classes'];

	self.bindings = {
		classes: {
			self: ['accepted', 'denied']
		}
	};

	self.init = function() {
		self.id = item.bare;
		self.name = item.local;
	};

	self.accept = function() {
		client.acceptSubscription(self.id);
		client.updateRosterItem({
			jid: self.id
		}, function(e) {
			if (e && e.error) {
				emitter.emit('acceptSubscriptionFailed', e.error);
				self.accepted = false;
			}
		});
		client.subscribe(self.id, function(e) {
		});
		self.accepted = true;
	};

	self.deny = function() {
		client.denySubscription(self.id);
		self.denied = true;
	};

	return self;
}