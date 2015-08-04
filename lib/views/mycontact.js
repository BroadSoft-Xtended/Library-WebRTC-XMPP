module.exports = require('webrtc-core').bdsft.View(MyContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles')
})

var Utils = require('webrtc-core').utils;
var constants = require('../constants');

function MyContactView(xmpp) {
  var self = {};

  self.elements = ['name', 'presenceSelect', 'presence'];

  self.init = function(){
    Utils.addSelectOptions(constants.PRESENCES, self.presenceSelect);
  };

  self.listeners = function(xmppDatabinder) {
    xmppDatabinder.onModelPropChange('myContact', function(myContact){
      self.name.text(myContact.name);
      self.presence.text(myContact.presence);
      self.presenceSelect.val(myContact.presence);
    });
    self.presenceSelect.on('change', function(e) {
      xmpp.sendPresence(self.presenceSelect.val());
    });
  };

  return self;

}