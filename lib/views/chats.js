module.exports = require('webrtc-core').bdsft.View(ChatsView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

var Factory = require('../factory');
var ChatView = require('./chat');
var jQuery = jquery = $ = require('jquery');
require('jquery-ui/resizable');
require('jquery-ui/draggable');

function ChatsView(chats) {
  var self = {};

  self.updateChatsContent = function(items){
    self.updateContentView(self.chatsContent, items, function(chat){
      return ChatView.create([chat]);
    });
  };

  self.elements = ['chatsContent', 'chatTabHolder'];

  self.bindings = {
    chatsContent: {
      chats: 'items'
    }
  };

  self.init = function() {
    jQuery(self.view).resizable({
      direction: ['bottom', 'left']
    }).draggable();
    self.chatTabHolder.replaceWith(Factory.createChatTabView().view);
  };

  return self;
}