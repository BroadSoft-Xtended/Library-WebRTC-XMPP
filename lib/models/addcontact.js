module.exports = require('webrtc-core').bdsft.Model(AddContact);

var Contact = require('../models/contact');

function AddContact(eventbus, client) {
	var self = {};

	self.props = ['name', 'jid', 'classes', 'visible'];

	self.bindings = {
		classes: {
			self: ['visible']
		}
	};

	var addContact = function(contact) {
		client.updateRosterItem({
			jid: contact.id,
			name: contact.name
		}, function(e) {
			// debug.log('updateRosterItem : ' + JSON.stringify(e));
			if (e && e.error) {
				eventbus.emit('addContactFailed', e.error);
			}
		});
		client.subscribe(contact.id, function(e) {
			// debug.log('subscribe : ' + JSON.stringify(e));
		});
		client.onSubscribe(function(msg) {
			if (msg.from.bare === contact.id) {
			    client.acceptSubscription(contact.id);
				// client.releaseGroup('addContact');
			}
		});
		eventbus.emit('addContact', contact);
	};

	self.cancel = function() {
		self.visible = false;
	};

	self.show = function() {
		self.name = '';
		self.jid = '';
		self.visible = true;
	};

	self.add = function() {
		var jid = self.jid;
		var name = self.name;
		if (self.jid) {
			var contact = Contact.create([{
				bare: self.jid,
				local: self.name
			}, eventbus, client]);
			addContact(contact);
			self.visible = false;
		}
	};

	return self;
}