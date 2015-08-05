module.exports = require('webrtc-core').bdsft.View(XMPPView, {
  template: require('../../js/templates'),
  style: require('../../js/styles')
});

var Utils = require('webrtc-core').utils;
var Constants = require('webrtc-core').constants;
var Factory = require('../factory');

function XMPPView(sound, xmpp) {
  var self = {};

  self.elements = ['name', 'password', 'login', 'chatsHolder', 'subscriptionsHolder', 'contactsHolder'];

  self.model = xmpp;
  
  self.init = function() {
    self.subscriptionsHolder.replaceWith(Factory.createSubscriptionsView().view)
    self.contactsHolder.replaceWith(Factory.createContactsView().view)
    self.chatsHolder.replaceWith(Factory.createChatsView().view)
  };

  self.listeners = function(databinder) {
    self.login.on('click', function(e) {
      sound.playClick();
      xmpp.connect(self.name.val(), self.password.val());
    });
  };

  return self;
}