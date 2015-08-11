module.exports = require('webrtc-core').bdsft.View(ContactsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

var Factory = require('../factory');
var ContactView = require('./contact');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function ContactsView(contacts) {
  var self = {};

  self.updateContactsContent = function(items){
    self.updateContentView(self.contactsContent, items, function(contact){
      return ContactView.create([contact]);
    });
  };

  self.elements = ['contactsContent', 'removeContactFailed', 'myContactHolder', 'addContactHolder'];

  self.bindings = {
    contactsContent: {
      contacts: 'items'
    }
  }
  self.init = function() {
    jQuery(self.view).resizable({
      direction: ['bottom', 'left']
    }).draggable();
    self.addContactHolder.replaceWith(Factory.createAddContactView().view);
    self.myContactHolder.replaceWith(Factory.createMyContactView().view);
  };

  self.listeners = function() {
    contacts.onRemoveContactFailed(function(error){
      self.removeContactFailed.fadeIn(10).fadeOut(3000);
    });
  };

  return self;

}