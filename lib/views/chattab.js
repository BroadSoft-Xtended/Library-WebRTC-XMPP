module.exports = require('webrtc-core').bdsft.View(ChatTabView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var ContactView = require('./contact');

function ChatTabView(xmpp) {
  var self = {};

  var contactViews = {};

  self.elements = ['chatTabContent'];

  self.init = function() {
  };

  self.listeners = function(xmppDatabinder) {
    xmppDatabinder.onModelPropChange('contact', function(contact) {
      var contactView = contactViews[contact.id];
      if(!contactView) {
        var contactView = ContactView.create([contact, xmpp]);
        contactViews[contact.id] = contactView;
        contactView.view.appendTo(self.chatTabContent);
      }
    });
  };

  return self;

}