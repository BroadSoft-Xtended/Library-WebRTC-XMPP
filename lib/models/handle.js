module.exports = require('bdsft-sdk-model')(Handle);

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