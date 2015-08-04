module.exports = require('webrtc-core').bdsft.View(MyContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var Utils = require('webrtc-core').utils;
var constants = require('../constants');

function MyContactView(myContact, xmpp) {
  var self = {};

  self.elements = ['name', 'presenceSelect', 'presence'];

  self.init = function(){
    self.name.text(myContact.name);
    self.presence.text('');
    self.presenceSelect.val(myContact.presence);
    Utils.addSelectOptions(constants.PRESENCES, self.presenceSelect);
  };

  self.listeners = function(xmppDatabinder) {
    self.presenceSelect.on('change', function(e) {
      xmpp.sendPresence(self.presenceSelect.val());
    });
  };

  return self;

}