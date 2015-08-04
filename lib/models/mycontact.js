module.exports = require('webrtc-core').bdsft.Model(MyContact);

var Contact = require('./contact');

function MyContact(item, xmpp) {
	var self = Contact.constructor(item, xmpp);

	self.props = ['id', 'name', 'presence', 'classes'];

	self.bindings = {
		classes: {
			mycontact: 'presence'
		}
	};

	return self;
}
