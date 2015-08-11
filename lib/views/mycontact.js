module.exports = require('webrtc-core').bdsft.View(MyContactView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

var Utils = require('webrtc-core').utils;
var constants = require('../constants');

function MyContactView(mycontact) {
  var self = {};

  self.elements = ['name', 'presenceSelect'];

  self.init = function(){
    Utils.addSelectOptions(constants.PRESENCES, self.presenceSelect);
  };

  self.listeners = function() {
    self.presenceSelect.on('change', function(e) {
      mycontact.sendPresence(self.presenceSelect.val());
    });
  };

  return self;

}