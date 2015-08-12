module.exports = require('webrtc-core').bdsft.View(HandleView, {
  template: require('../../js/templates'), 
  style: require('../../js/styles'),
  module: 'xmpp'
})

function HandleView(sound, xmppHandle) {
  var self = {};

  self.listeners = function() {
    self.view.on('click', function(e) {
      e.preventDefault();
      sound.playClick();
      xmppHandle.toggle();
    });
  };

  return self;

}