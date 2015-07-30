module.exports = require('webrtc-core').bdsft.View(XMPPView, {
  template: require('../../js/templates'),
  style: require('../../js/styles')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;
var ContactView = require('./contact');
var ChatView = require('./chat');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');

function XMPPView(debug, eventbus, sound, xmpp) {
  var self = {};

  var updateContacts = function(contacts) {
    self.contacts.html("");
    for(var name in contacts) {
      var contact = contacts[name];
      var contactView = ContactView.create([contact, xmpp]);
      contactView.view.appendTo(self.contacts);
    }
  }

  var chatViews = {};
  self.model = xmpp;

  self.elements = ['name', 'password', 'login', 'contacts', 'chatsView', 'contentView'];

  self.init = function() {
    jQuery(self.contentView).resizable({
      direction: ['bottom', 'left']
    });
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
      self.chatsView.html('');
      chatView.view.appendTo(self.chatsView);
    });

    self.login.on('click', function(e) {
      sound.playClick();
      xmpp.connect(self.name.val(), self.password.val());
    });
  };

  return self;
}