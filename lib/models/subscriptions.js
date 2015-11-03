module.exports = require('bdsft-sdk-model')(Subscriptions);

var Subscription = require('./subscription');

function Subscriptions(eventbus, client, contacts) {
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
		client.on('subscribe', function(msg) {
			if(contacts.items[msg.from.bare] && contacts.items[msg.from.bare].hasToSubscription()) {
				return;
			};

			var subscription = Subscription.create([msg.from, eventbus, client]);
			subscription.databinder.onModelPropChange(['accepted', 'denied'], function(){
				self.updateHasSubscriptions(self.items);
			})
			self.items[subscription.id] = subscription;
		});

		client.on('unsubscribe', function(msg) {
			delete self.items[msg.from.bare];
		});
	};

	return self;
}