module.exports = require('webrtc-core').bdsft.View(XMPPView, {
  template: require('../../js/templates'),
  style: require('../../js/styles')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;
var ContactView = require('./contact');
var ChatView = require('./chat');
var ChatTabView = require('./chattab');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function XMPPView(debug, eventbus, sound, xmpp) {
  var self = {};

  var updateContacts = function(contacts) {
    self.contactsContent.html("");
    for(var name in contacts) {
      var contact = contacts[name];
      var contactView = ContactView.create([contact, xmpp]);
      contactView.view.appendTo(self.contactsContent);
    }
  }

  var chatViews = {};
  self.model = xmpp;

  self.elements = ['name', 'password', 'login', 'contactsView', 'contactsContent', 'chatsView', 'chatsContent', 'chatTabHolder'];

  self.init = function() {
    jQuery(self.contactsView).resizable({
      direction: ['bottom', 'left']
    }).draggable();
    jQuery(self.chatsView).resizable({
      direction: ['bottom', 'left']
    }).draggable();
    var chatTabView = ChatTabView.create([xmpp]);
    chatTabView.view.appendTo(self.chatTabHolder);
  };

  self.listeners = function(databinder) {
    databinder.onModelPropChange('contacts', function(contacts) {
      updateContacts(contacts);
    });
    databinder.onModelPropChange('contact', function(contact) {
      var chatView = chatViews[contact.id];
      if(!chatView) {
        chatView = ChatView.create([contact, xmpp]);
        chatViews[contact.id] = chatView;
      }
      chatView.view.appendTo(self.chatsContent);
    });

    self.login.on('click', function(e) {
      sound.playClick();
      xmpp.connect(self.name.val(), self.password.val());
    });
  };

  return self;
}