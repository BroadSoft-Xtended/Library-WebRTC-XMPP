module.exports = require('webrtc-core').bdsft.View(ChatTabView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var ContactView = require('./contact');

function ChatTabView(xmpp) {
  var self = {};

  var contactViews = {};

  var adjacentContactView = function(contact) {
    var ids = Object.keys(contactViews);
    var result = undefined;
    ids.forEach(function(id, index){
      if(contact.id === id) {
        if(index > 0) {
          result = contactViews[ids[index-1]];
        } else if(index < ids.length) {
          result = contactViews[ids[index+1]];
        }
      } 
    });
    return result;
  }

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
    xmpp.onCloseContact(function(contact){
      var contactView = contactViews[contact.id];
      if(contactView) {
        contactView.view.remove();
        // select adjacent tab if closed tab === current tab
        if(contact === xmpp.contact) {
          var tab = adjacentContactView(contact);
          if(tab) {
            xmpp.selectContact(tab.contact);
          }
        }
        delete contactViews[contact.id];
      }
    });
  };

  return self;

}