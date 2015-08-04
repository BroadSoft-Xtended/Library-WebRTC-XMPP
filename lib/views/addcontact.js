module.exports = require('webrtc-core').bdsft.View(AddContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var Contact = require('../models/contact');

function AddContactView(xmpp) {
  var self = {};

  self.elements = ['name', 'jid', 'add', 'addLink', 'cancelLink', 'form'];

  var toggle = function(visible){
    self.form.toggle(visible);
    self.addLink.toggle(!visible);
    self.cancelLink.toggle(visible);
  };

  self.init = function(){
  };

  self.listeners = function(xmppDatabinder) {
    self.add.on('click', function(e) {
      var jid = self.jid.val();
      var name = self.name.val();
      if(jid) {
        var contact = Contact.create([{bare: jid, local: name}, xmpp])
        xmpp.addContact(contact);
        toggle(false);
      }
    });
    self.cancelLink.on('click', function(e) {
      toggle(false);
    });
    self.addLink.on('click', function(e) {
      self.name.val('');
      self.jid.val('');
      toggle(true);
    });
  };

  return self;

}