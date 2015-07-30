module.exports = require('webrtc-core').bdsft.View(ChatView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var MessageView = require('./message');

function ChatView(contact, xmpp) {
  var self = {};

  var updateChatMessages = function(messages) {
    self.chatMessages.html("");
    (messages || []).forEach(function(message, i) {
      var messageView = MessageView.create([message, xmpp]);
      messageView.view.appendTo(self.chatMessages);
    });
  }

  self.elements = ['chatMessages', 'chatInput', 'name'];

  self.init = function() {
    self.name.text(contact.name);
  };

  self.listeners = function() {
    contact.databinder.onModelPropChange('messages', function(messages) {
      updateChatMessages(messages);
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