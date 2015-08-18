module.exports = require('webrtc-core').bdsft.Model(Subscriptions);

var Subscription = require('./subscription');

function Subscriptions(eventbus, client) {
	var self = {};

	self.updateHasSubscriptions = function(items) {
		var length = Object.keys(items).filter(function(id){
			var item = items[id];
			return !item.accepted && !item.denied;
		}).length;
		self.hasSubscriptions = !!length;
	}

	self.props = ['items', 'hasSubscriptions', 'classes'];

	self.bindings = {
		classes: {
			self: ['hasSubscriptions']
		},
		hasSubscriptions: {
			self: 'items'
		}
	}

	self.init = function() {
		self.items = {};
	}

	self.listeners = function() {
		client.onSubscribe(function(msg) {
			var subscription = Subscription.create([msg.from, eventbus, client]);
			subscription.databinder.onModelPropChange(['accepted', 'denied'], function(){
				self.updateHasSubscriptions(self.items);
			})
			self.items[subscription.id] = subscription;
		});

		client.onUnsubscribe(function(msg) {
			delete self.items[msg.from.bare];
		});
	};

	return self;
}