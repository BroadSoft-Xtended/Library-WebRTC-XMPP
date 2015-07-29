module.exports = require('webrtc-core').bdsft.View(ContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

function ContactView(contact, xmpp, xmppView) {
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
    contact.databinder.onModelPropChange('messages', function(messages) {
      if(contact === xmpp.contact) {
        xmppView.updateChatMessages(messages);
      }
    })
  };

  return self;

}