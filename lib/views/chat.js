module.exports = require('webrtc-core').bdsft.View(ChatView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var MessageView = require('./message');

function ChatView(chat) {
  var self = {};

  self.updateChatMessages = function(messages) {
    self.chatMessages.html("");
    (messages || []).forEach(function(message, i) {
      var messageView = MessageView.create([message, xmpp]);
      messageView.view.appendTo(self.chatMessages);
    });
  }

  self.elements = ['messages', 'input', 'name'];

  self.init = function() {
  };

  self.listeners = function() {
    self.input.keypress(function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        chat.sendMessage();
      }
    });
  };

  return self;

}