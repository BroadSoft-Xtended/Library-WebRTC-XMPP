module.exports = require('webrtc-core').bdsft.Model(AddContact);

var Contact = require('../models/contact');

function AddContact(xmpp) {
	var self = {};

	self.props = ['name', 'jid', 'classes', 'visible'];

	self.bindings = {
		classes: {
			self: ['visible']
		}
	};

	self.init = function() {};

	self.listeners = function(xmppDatabinder) {};

	var addContact = function(contact) {
		xmpp.client.updateRosterItem({
			jid: contact.id,
			name: contact.name
		}, function(e) {
			debug.log('updateRosterItem : ' + JSON.stringify(e));
			if (e && e.error) {
				emitter.emit('addContactFailed', e.error);
			}
		});
		xmpp.client.subscribe(contact.id, function(e) {
			debug.log('subscribe : ' + JSON.stringify(e));
		});
		xmpp.client.on('subscribe', 'addContact', function(msg) {
			if (msg.from.bare === contact.id) {
				xmpp.acceptSubscription(contact);
				xmpp.client.releaseGroup('addContact');
			}
		});
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
			}, xmpp]);
			addContact(contact);
			self.visible = false;
		}
	};

	return self;
}