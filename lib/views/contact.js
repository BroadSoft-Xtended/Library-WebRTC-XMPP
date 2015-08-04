module.exports = require('webrtc-core').bdsft.View(ContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function ContactView(contact, xmpp) {
  var self = {};

  self.elements = ['name', 'remove', 'close'];

  self.contact = contact;

  self.init = function() {
    self.name.text(contact.name);
  };

  self.listeners = function() {
    self.view.on('click', function(e){
      e.preventDefault();
      xmpp.selectContact(contact);
    });
    self.remove.on('click', function(e){
      e.preventDefault();
      if(confirm("Are you sure you want to remove the contact?")) {
        xmpp.removeContact(contact);  
      }
    });
    self.close.on('click', function(e){
      e.preventDefault();
      xmpp.closeContact(contact);
    });
  };

  return self;

}