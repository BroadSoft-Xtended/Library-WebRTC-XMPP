module.exports = require('webrtc-core').bdsft.Model(Handle);

function Handle(xmpp) {
	var self = {};

	self.props = ['classes'];

	self.bindings = {
		classes: {
			xmpp: ['visible', 'enableXMPP']
		}
	};

	self.toggle = function(){
      xmpp.visible = !xmpp.visible;
	};

	return self;
}