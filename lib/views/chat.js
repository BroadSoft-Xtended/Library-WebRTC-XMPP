module.exports = require('webrtc-core').bdsft.View(ChatView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var MessageView = require('./message');

function ChatView(chat) {
  var self = {};

  self.updateMessagesContent = function(messages) {
    self.updateContentView(self.messagesContent, messages, function(message){
      return MessageView.create([message]);
    });
  }

  self.elements = ['messagesContent', 'input', 'name'];

  self.bindings = {
    messagesContent: {
      chat: 'messages'
    }
  };

  self.listeners = function() {
    self.input.keypress(function(e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        chat.sendMessage(self.input.val());
        self.input.val('');
      }
    });
  };

  return self;

}