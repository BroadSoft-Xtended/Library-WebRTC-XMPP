module.exports = require('webrtc-core').bdsft.View(ChatTabView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var ContactView = require('./contact');

function ChatTabView(chattab) {
  var self = {};

  self.updateChatTabContent = function(contacts){
    self.updateContentView(self.chatTabContent, contacts, function(contact){
      return ContactView.create([contact]);
    });
  }

  self.bindings = {
    chatTabContent: {
      chattab: 'contacts' 
    }
  }

  self.elements = ['chatTabContent'];

  return self;

}