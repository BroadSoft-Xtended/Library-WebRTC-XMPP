module.exports = require('webrtc-core').bdsft.View(ContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function ContactView(contact, xmpp) {
  var self = {};

  self.elements = ['name', 'presence', 'remove', 'close'];

  self.contact = contact;

  self.init = function() {
    self.name.text(contact.name);
  };

  self.listeners = function(xmppDatabinder) {
    xmppDatabinder.onModelPropChange('contact', function(value) {
      self.view.toggleClass('selected', contact === value);
    });
    self.view.on('click', function(e){
      e.preventDefault();
      xmpp.selectContact(contact);
    });
    self.remove.on('click', function(e){
      e.preventDefault();
      xmpp.removeContact(contact);
    });
    self.close.on('click', function(e){
      e.preventDefault();
      xmpp.closeContact(contact);
    });
  };

  return self;

}