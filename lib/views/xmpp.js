module.exports = require('webrtc-core').bdsft.View(XMPPView, {
  template: require('../../js/templates'),
  style: require('../../js/styles')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;
var ContactView = require('./contact');
var ChatView = require('./chat');
var ChatTabView = require('./chattab');
var MyContactView = require('./mycontact');
var AddContactView = require('./addcontact');
var AddContact = require('../models/addcontact');
var SubscriptionsView = require('./subscriptions');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function XMPPView(debug, eventbus, sound, xmpp) {
  var self = {};

  var updateContacts = function(contacts) {
    self.updateContentView(self.contactsContent, contacts, function(contact){
      return ContactView.create([contact, xmpp]);
    });
  }

  var chatViews = {};
  self.model = xmpp;

  self.elements = ['name', 'password', 'login', 'contactsView', 'contactsContent', 'chatsView', 'chatsContent', 'chatTabHolder', 
  'subscriptionsHolder', 'removeContactFailed', 'myContactHolder', 'addContactHolder'];

  self.init = function() {
    jQuery(self.contactsView).resizable({
      direction: ['bottom', 'left']
    }).draggable();
    jQuery(self.chatsView).resizable({
      direction: ['bottom', 'left']
    }).draggable();
    var chatTabView = ChatTabView.create([xmpp]);
    chatTabView.view.appendTo(self.chatTabHolder);
    var subscriptionsView = SubscriptionsView.create([xmpp]);
    self.subscriptionsHolder.replaceWith(subscriptionsView.view)
    var addContact = AddContact.create([xmpp]);
    var addContactView = AddContactView.create([addContact]);
    self.addContactHolder.replaceWith(addContactView.view);
  };

  self.listeners = function(databinder) {
    databinder.onModelPropChange('contacts', function(contacts) {
      updateContacts(contacts);
    });
    databinder.onModelPropChange('myContact', function(myContact) {
      var myContactView = MyContactView.create([myContact, xmpp]);
      self.myContactHolder.replaceWith(myContactView.view);
    });
    databinder.onModelPropChange('contact', function(contact) {
      var chatView = chatViews[contact.id];
      if(!chatView) {
        chatView = ChatView.create([contact, xmpp]);
        chatViews[contact.id] = chatView;
      }
      chatView.view.appendTo(self.chatsContent);
    });

    xmpp.onCloseContact(function(contact){
      var chatView = chatViews[contact.id];
      if(chatView) {
        chatView.view.remove();
        delete chatViews[contact.id];
      }
    });
    xmpp.onRemoveContactFailed(function(error){
      self.removeContactFailed.fadeIn(10).fadeOut(3000);
    });

    self.login.on('click', function(e) {
      sound.playClick();
      xmpp.connect(self.name.val(), self.password.val());
    });
  };

  return self;
}