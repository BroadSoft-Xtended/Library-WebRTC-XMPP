module.exports = require('webrtc-core').bdsft.View(ContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function ContactView(contact, xmpp) {
  var self = {};

  self.elements = ['name', 'presence'];

  self.init = function() {
    self.name.text(contact.name);
  };

  self.listeners = function() {
    self.view.on('click', function(e){
      e.preventDefault();
      xmpp.selectContact(contact);
    });
  };

  return self;

}