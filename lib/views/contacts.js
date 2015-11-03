module.exports = require('bdsft-sdk-view')(ContactsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

var ContactView = require('./contact');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function ContactsView(contacts, addcontactView, mycontactView) {
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
    self.addContactHolder.replaceWith(addcontactView.view);
    self.myContactHolder.replaceWith(mycontactView.view);
  };

  self.listeners = function() {
    contacts.onRemoveContactFailed(function(error){
      self.removeContactFailed.fadeIn(10).fadeOut(3000);
    });
  };

  return self;

}