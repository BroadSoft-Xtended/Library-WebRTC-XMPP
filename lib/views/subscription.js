module.exports = require('webrtc-core').bdsft.View(SubscriptionView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function SubscriptionView(contact, xmpp) {
  var self = {};

  self.elements = ['name', 'accept', 'deny'];

  self.init = function() {
    self.name.text(contact.name);
  };

  self.listeners = function(xmppDatabinder) {
    self.accept.on('click', function(e){
      e.preventDefault();
      xmpp.acceptSubscription(contact);
    });
    self.deny.on('click', function(e){
      e.preventDefault();
      xmpp.denySubscription(contact);
    });
  };

  return self;

}