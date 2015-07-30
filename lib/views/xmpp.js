module.exports = require('webrtc-core').bdsft.View(XMPPView, {
  template: require('../../js/templates'),
  style: require('../../js/styles')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;
var MessageView = require('./message');
var ContactView = require('./contact');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');

function XMPPView(debug, eventbus, sound, xmpp) {
  var self = {};

  var updateContacts = function(contacts) {
    self.contacts.html("");
    for(var name in contacts) {
      var contact = contacts[name];
      var contactView = ContactView.create([contact, xmpp, self]);
      contactView.view.appendTo(self.contacts);
    }
  }

  self.updateChatMessages = function(messages) {
    self.chatMessages.html("");
    (messages || []).forEach(function(message, i) {
      var messageView = MessageView.create([message, xmpp]);
      messageView.view.appendTo(self.chatMessages);
    });
  }

  self.model = xmpp;

  self.elements = ['name', 'password', 'login', 'contacts', 'chatMessages', 'chatInput', 'xmpp'];

  self.init = function() {
    jQuery(self.xmpp).resizable({
      direction: ['bottom', 'left']
    })
  };

  self.listeners = function(databinder) {
    databinder.onModelPropChange('contacts', function(contacts) {
      updateContacts(contacts);
    });
    databinder.onModelPropChange('contact', function(contact) {
      self.updateChatMessages(contact.messages);
    });

    self.login.on('click', function(e) {
      sound.playClick();
      xmpp.connect(self.name.val(), self.password.val());
    });
    self.chatInput.keypress(function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        xmpp.sendMessage(self.chatInput.val());
        self.chatInput.val('');
      }
    });
  };

  return self;
}